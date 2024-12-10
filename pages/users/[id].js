import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function UserDetails() {
  const router = useRouter();
  const { id } = router.query; // URLパラメータからIDを取得
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error("ユーザー情報の取得に失敗しました。");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>エラーが発生しました: {error}</p>;
  }

  if (!user) {
    return <p>ユーザーが見つかりません。</p>;
  }

  return (
    <div>
      <h1>ユーザー詳細</h1>
      <p><strong>ID:</strong> {user.$id}</p>
      <p><strong>名前:</strong> {user.name}</p>
      <p><strong>メールアドレス:</strong> {user.email}</p>
    </div>
  );
}