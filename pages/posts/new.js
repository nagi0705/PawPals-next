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
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        // 投稿成功後、投稿一覧ページにリダイレクト
        router.push('/posts');
      } else {
        setError(data.message || '投稿の作成に失敗しました');
      }
    } catch (err) {
      setError('投稿の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>新規投稿</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label>画像 (任意)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? '投稿中...' : '投稿を作成'}
        </button>
      </form>
    </div>
  );
};

export default NewPostForm;