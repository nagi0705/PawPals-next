// /pages/users/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const UserDetail = () => {
  const router = useRouter();
  const { id } = router.query; // URLからユーザーIDを取得
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // idが未定義の場合は処理をスキップ
    if (!id) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error('ユーザー情報の取得に失敗しました');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // ページロード中の処理
  if (loading) return <p>読み込み中...</p>;

  // エラーが発生した場合の処理
  if (error) return <p>エラー: {error}</p>;

  // ユーザー情報が正常に取得された場合の表示
  return (
    <div>
      <h1>ユーザー詳細</h1>
      {user ? (
        <div>
          <p><strong>名前:</strong> {user.name}</p>
          <p><strong>メールアドレス:</strong> {user.email}</p>
          <p><strong>登録日時:</strong> {new Date(user.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>ユーザー情報が見つかりません。</p>
      )}
    </div>
  );
};

export default UserDetail;