import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Groups() {
  const [groups, setGroups] = useState(null); // 初期値を null に設定
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // ルーターの使用

  useEffect(() => {
    // グループ一覧の取得
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/groups");
        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }
        const data = await response.json();
        setGroups(data.documents || []); // 空の配列で初期化
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      style={{
        backgroundColor: "#e2ffe2", // グリーンの背景
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "800px",
      }}
    >
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Link href="/top">
          <button
            style={{
              backgroundColor: "#f68fe1",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            トップページに戻る
          </button>
        </Link>
      </div>

      <h1 style={{ color: "#f68fe1", textAlign: "center" }}>グループ一覧</h1>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <Link href="/groups/new">
          <button
            style={{
              backgroundColor: "#f68fe1",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              border: "none",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            グループを作成する
          </button>
        </Link>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {groups.map((group) => (
          <li
            key={group.$id}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            <Link
              href={`/groups/${group.$id}`}
              style={{
                color: "#f68fe1",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              {group.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}