import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function EditGroup() {
  const router = useRouter();
  const { id } = router.query;
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] =useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/groups/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch group");
        }
        const data = await response.json();
        setGroup(data);
        setFormData({
          name: data.name,
          description: data.description,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/groups/${id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("メンバー以外は編集できません");
      }

      router.push(`/groups/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!group) return <p>グループが見つかりません</p>;

  return (
    <div
      style={{
        backgroundColor: "#e2ffe2",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "600px",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#f68fe1" }}>グループを編集</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem" }}>
            グループ名:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "2px solid black",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="description" style={{ display: "block", marginBottom: "0.5rem" }}>
            説明:
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "2px solid black",
            }}
          />
        </div>

        <div>
          <button
            type="submit"
            style={{
              backgroundColor: "#f68fe1",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#007bff")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f68fe1")}
          >
            更新
          </button>
          <Link href={`/groups/${id}`}>
            <button
              type="button"
              style={{
                marginLeft: "10px",
                backgroundColor: "#f68fe1",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#007bff")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#f68fe1")}
            >
              キャンセル
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}