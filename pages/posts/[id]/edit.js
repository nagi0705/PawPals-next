import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;

  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const sessionData = await getSession();
        if (!sessionData) {
          router.push('/api/auth/signin');
          return;
        }
        setSession(sessionData);

        // 投稿データを取得
        const response = await fetch(`/api/posts/${id}`);
        if (!response.ok) throw new Error('投稿データの取得に失敗しました');
        const post = await response.json();

        // 自分の投稿か確認
        if (post.userId !== sessionData.user.id) {
          alert('権限がありません');
          router.push('/posts');
          return;
        }

        setContent(post.content);
      } catch (err) {
        setError(err.message);
      }
    };

    if (id) fetchPost();
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('投稿の更新に失敗しました');
      alert('投稿が更新されました');
      router.push(`/posts/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!session) return <p>読み込み中...</p>;

  return (
    <div>
      <h1>投稿を編集</h1>
      <form onSubmit={handleSubmit}>
        <label>
          内容:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            cols="50"
          />
        </label>
        <div style={{ marginTop: '10px' }}>
          <button type="submit">更新する</button>
          <button
            type="button"
            onClick={() => router.push(`/posts/${id}`)}
            style={{ marginLeft: '10px' }}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}