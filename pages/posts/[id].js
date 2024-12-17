import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const router = useRouter();
  const { id } = router.query; // URLからidを取得

  // 認証情報の取得と投稿データの取得
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const userSession = await getSession();
        if (!userSession) {
          router.push('/api/auth/signin');
          return;
        }
        setSession(userSession);

        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error('投稿データの取得に失敗しました');

        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    if (id) fetchPost();
  }, [id, router]);

  // 投稿削除処理
  const handleDelete = async () => {
    if (!confirm('本当にこの投稿を削除しますか？')) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('投稿の削除に失敗しました');

      alert('投稿が削除されました');
      router.push('/posts');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>読み込み中...</p>;

  // 現在のユーザーが投稿者かどうかを確認
  const isOwner = session?.user.id === post.userId;

  return (
    <div>
      <h1>投稿詳細</h1>
      <h2>{post.content}</h2>
      <p>ユーザーID: {post.userId}</p>
      <p>作成日: {new Date(post.createdAt).toLocaleString()}</p>
      <p>更新日: {new Date(post.updatedAt).toLocaleString()}</p>

      {/* 投稿者のみ表示 */}
      {isOwner && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={() => router.push(`/posts/${id}/edit`)}>編集する</button>
          <button
            onClick={handleDelete}
            style={{ marginLeft: '10px', color: 'red' }}
          >
            削除する
          </button>
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => router.push('/posts')}>一覧へ戻る</button>
      </div>
    </div>
  );
}