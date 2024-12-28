import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function GroupDetail() {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/groups/${id}`);
        if (!response.ok) {
          throw new Error("グループ情報の取得に失敗しました");
        }
        const data = await response.json();
        setGroup(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  const handleDeleteGroup = async () => {
    const confirmDelete = confirm("このグループを削除してもよろしいですか？");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/groups/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "削除に失敗しました");
      }

      alert("グループが削除されました");
      router.push("/groups");
    } catch (err) {
      alert(err.message);
    }
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
        maxWidth: "800px",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#f68fe1" }}>{group.name}</h1>
      <p>{group.description}</p>
      <br />
      <div style={{ marginBottom: "20px" }}>
        <Link href={`/groups/${id}/edit`}>
          <button
            style={{
              marginRight: "10px",
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
            グループを編集
          </button>
        </Link>
        <button
          onClick={handleDeleteGroup}
          style={{
            backgroundColor: "#f68fe1",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#007bff")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#f68fe1")}
        >
          グループを削除
        </button>
        <Link href={`/groups/${id}/chat`}>
          <button
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
            チャットページに移動
          </button>
        </Link>
      </div>

      <h2 style={{ color: "#f68fe1" }}>Members</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {group.members && group.members.length > 0 ? (
          group.members.map((member) => (
            <li
              key={member.email}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                padding: "1rem",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {member.name || member.email}
            </li>
          ))
        ) : (
          <li>メンバーはいません</li>
        )}
      </ul>

      <div style={{ marginTop: "20px" }}>
        <Link href="/groups">
          <button
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
            グループ一覧に戻る
          </button>
        </Link>
      </div>
    </div>
  );
}