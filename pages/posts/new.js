import { useState } from 'react';
import { useRouter } from 'next/router';

const NewPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // 画像ファイル
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('/api/posts/new', {
        method: 'POST',
        body: formData, // FormDataをそのまま送信
      });

      const data = await response.json();
      if (response.ok) {
        router.push('/posts'); // 投稿成功後、一覧ページにリダイレクト
      } else {
        setError(data.message || '投稿の作成に失敗しました');
      }
    } catch (err) {
      setError('投稿の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/posts'); // http://localhost:3000/posts に戻る
  };

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
      <h1 style={{ color: '#f68fe1' }}>新規投稿</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>タイトル (30文字以内)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 30))} // 最大30文字に制限
            required
            style={{
              padding: '10px',
              width: '100%',
              border: '2px solid black',
              borderRadius: '5px',
            }}
          />
          {title.length > 30 && (
            <p style={{ color: 'red' }}>タイトルは30文字以内にしてください。</p>
          )}
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

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>画像 (任意)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{
              padding: '5px',
              width: '100%',
              border: '2px solid black',
              borderRadius: '5px',
            }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1rem' }}>
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
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#007bff')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f68fe1')}
          >
            {loading ? '投稿中...' : '投稿を作成'}
          </button>
          <button
            type="button"
            onClick={handleBack}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f68fe1',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#007bff')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#f68fe1')}
          >
            戻る
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;