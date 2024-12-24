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
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/top">
          <button style={{ marginRight: '10px' }}>トップページに戻る</button>
        </Link>
      </div>

      <h1>グループ一覧</h1>
      <Link href="/groups/new">
        <button>グループを作成する</button>
      </Link>

      <ul>
        {groups.map(group => (
          <li key={group.$id}>
            <Link href={`/groups/${group.$id}`}>
              {group.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}