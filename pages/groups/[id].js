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
          throw new Error("Failed to fetch group");
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
      const token = await fetch("/api/auth/session").then((res) => res.json());
      const response = await fetch(`/api/groups/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token?.user?.jwt}`, // 認証トークンを送信
        },
      });

      if (!response.ok) {
        throw new Error("メンバー以外は削除できません");
      }

      alert("グループが削除されました");
      router.push("/groups"); // グループ一覧ページへリダイレクト
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!group) return <p>グループが見つかりません</p>;

  return (
    <div>
      <h1>{group.name}</h1>
      <p>{group.description}</p>

      <div style={{ marginBottom: '20px' }}>
        <Link href={`/groups/${id}/edit`}>
          <button style={{ marginRight: '10px' }}>グループを編集</button>
        </Link>
        <button 
          onClick={handleDeleteGroup} 
          style={{ backgroundColor: '#ff4444', color: 'white' }}
        >
          グループを削除
        </button>
      </div>

      <h2>Members</h2>
      <ul>
        {group.members && group.members.length > 0 ? (
          group.members.map((member) => (
            <li key={member.$id}>
              {member.name || member.userEmail}
            </li>
          ))
        ) : (
          <li>メンバーはいません</li>
        )}
      </ul>

      <div style={{ marginTop: '20px' }}>
        <Link href="/groups">
          <button>グループ一覧に戻る</button>
        </Link>
      </div>
    </div>
  );
}