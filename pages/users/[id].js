import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const UserDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);  // エラーを格納する状態

  useEffect(() => {
    // ユーザーIDがURLパラメータで渡されていればAPIから詳細を取得
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/admin/users/${id}`);

          // レスポンスが成功したかチェック
          if (!response.ok) {
            throw new Error(`ユーザーの取得に失敗しました: ${response.status}`);
          }

          const data = await response.json();

          // ユーザーが取得できた場合
          setUser(data);
        } catch (error) {
          setError(error.message);  // エラーメッセージを設定
        }
      };

      fetchUser();
    }
  }, [id]);

  if (error) {
    return <div>エラー: {error}</div>;  // エラーがあれば表示
  }

  if (!user) {
    return <div>Loading...</div>;  // ユーザー情報がまだ取得されていない場合
  }

  return (
    <div>
      <h1>ユーザー詳細</h1>
      <p><strong>名前:</strong> {user.name}</p>
      <p><strong>メールアドレス:</strong> {user.email}</p>
    </div>
  );
};

export default UserDetail;