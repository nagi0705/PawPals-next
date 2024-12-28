import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const EditPost = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
          setTitle(data.title);
          setContent(data.content);
        } else {
          setError('投稿の取得に失敗しました');
        }
      } catch (err) {
        setError('投稿の取得に失敗しました');
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('投稿が更新されました');
        router.push(`/posts/${id}`);
      } else {
        setError(data.message || '投稿の更新に失敗しました');
      }
    } catch (err) {
      setError('投稿の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!post) {
    return <p>読み込み中...</p>;
  }

  return (
    <div
      style={{
        backgroundColor: '#e2ffe2',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        margin: '2rem auto',
        maxWidth: '600px',
        textAlign: 'center',
      }}
    >
      <h1 style={{ color: '#f68fe1' }}>投稿を編集</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 30))} // 最大30文字
            required
            style={{
              padding: '10px',
              width: '100%',
              border: '2px solid black',
              borderRadius: '5px',
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="5"
            style={{
              padding: '10px',
              width: '100%',
              border: '2px solid black',
              borderRadius: '5px',
            }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f68fe1',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#007bff')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#f68fe1')}
        >
          {loading ? '更新中...' : '更新'}
        </button>
      </form>
      <button
        onClick={() => router.push(`/posts/${id}`)}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#f68fe1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#007bff')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#f68fe1')}
      >
        投稿詳細に戻る
      </button>
    </div>
  );
};

export default EditPost;