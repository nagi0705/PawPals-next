import { useState } from 'react';

export default function CommentForm({ postId, onCommentAdded, authorId }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postId || !content.trim()) {
      setError('投稿IDまたはコメント内容が無効です');
      return;
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content,
          authorId, // APIにauthorIdを渡す
        }),
      });

      if (!response.ok) {
        throw new Error('コメントの投稿に失敗しました');
      }

      const result = await response.json();
      setContent('');
      setError('');
      onCommentAdded(result.data); // 親コンポーネントでのコールバック
    } catch (err) {
      console.error('コメント投稿エラー:', err.message);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="コメントを入力してください"
        required
        rows={4}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <button
        type="submit"
        style={{
          padding: '10px 20px',
          background: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        コメントを投稿
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </form>
  );
}