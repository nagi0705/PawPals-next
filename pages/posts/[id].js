import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [likes, setLikes] = useState([]);
  const router = useRouter();
  const { id } = router.query;

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
        setLikes(data.likes || []); // likesがない場合は空配列に設定
      } catch (err) {
        setError(err.message);
      }
    };

    if (id) fetchPost();
  }, [id, router]);

  const handleLike = async () => {
  try {
    const method = likes.includes(session.user.id) ? 'DELETE' : 'POST';
    const res = await fetch(`/api/posts/${id}/like`, { method });
    if (!res.ok) throw new Error('いいねの操作に失敗しました');

    const data = await res.json();
    setLikes(data.likes); // いいね数を更新
  } catch (err) {
    console.error(err);
  }
};

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>読み込み中...</p>;

  const isLiked = likes.includes(session?.user.id);

  return (
    <div>
      <h1>投稿詳細</h1>
      <h2>{post.content}</h2>
      <p>ユーザーID: {post.userId}</p>
      <p>作成日: {new Date(post.createdAt).toLocaleString()}</p>
      <p>いいね数: {likes.length}</p>

      {/* ハートボタン */}
      <button
        onClick={handleLike}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: isLiked ? 'red' : 'gray',
        }}
      >
        {isLiked ? '❤️' : '🤍'}
      </button>

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => router.push('/posts')}>一覧へ戻る</button>
      </div>
    </div>
  );
}