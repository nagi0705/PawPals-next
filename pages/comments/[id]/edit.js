import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const EditComment = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchComment = async () => {
      try {
        const response = await fetch(`/api/comments/${id}`);
        if (!response.ok) {
          throw new Error('コメントの取得に失敗しました');
        }
        const data = await response.json();
        
        // 自分のコメントでない場合はリダイレクト
        if (data.ownerEmail !== session?.user?.email) {
          router.push('/');
          return;
        }

        setComment(data.content);
        setLoading(false);
      } catch (err) {
        setError('コメントの取得に失敗しました');
        setLoading(false);
      }
    };

    fetchComment();
  }, [id, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) {
        throw new Error('コメントの更新に失敗しました');
      }

      // 元の投稿ページに戻る
      const data = await response.json();
      router.push(`/posts/${data.postId}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>コメントを編集</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? '更新中...' : '更新'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditComment;