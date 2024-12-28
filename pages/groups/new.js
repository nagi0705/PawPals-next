import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const NewGroup = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users || []);
        } else {
          console.error("Failed to fetch users:", data);
        }
      } catch (err) {
        console.error("ユーザー取得エラー:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/groups/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          members,
        }),
      });

      if (response.ok) {
        router.push("/groups");
      } else {
        const data = await response.json();
        setError(data.message || "グループの作成に失敗しました");
      }
    } catch (err) {
      setError("グループの作成中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <div>ログインが必要です</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "#e2ffe2",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "800px",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#f68fe1" }}>新しいグループを作成</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>
            グループ名
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "2px solid black",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="description" style={{ display: "block", marginBottom: "5px" }}>
            説明
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "2px solid black",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <label style={{ display: "block", marginBottom: "10px" }}>
            メンバー（複数選択可。自分は含めないで選択してください。）
          </label>
          <div style={{ display: "inline-block" }}>
            <select
              multiple
              value={members}
              onChange={(e) => setMembers(Array.from(e.target.selectedOptions, (option) => option.value))}
              style={{
                width: "300px",
                padding: "10px",
                borderRadius: "5px",
                border: "2px solid black",
                minHeight: "150px",
                textAlign: "left",
              }}
            >
              {users.map((user) => (
                <option key={user.$id} value={user.email}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <small style={{ color: "#666", marginTop: "5px", display: "block" }}>
            コマンドキーを押しながらクリックで複数選択できます
          </small>
        </div>

        {error && <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>}

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f68fe1",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#007bff")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f68fe1")}
          >
            {loading ? "作成中..." : "作成"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/groups")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f68fe1",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#007bff")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f68fe1")}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewGroup;