import { useState } from 'react';
import { useRouter } from 'next/router';

export default function NewPost() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '投稿作成に失敗しました');
      }

      setSuccess('投稿が作成されました！');
      setContent('');
      router.push('/posts');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>新しい投稿を作成</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          内容:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">投稿する</button>
      </form>
    </div>
  );
}