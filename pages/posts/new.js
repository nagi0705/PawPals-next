import { useState } from 'react';
import { useRouter } from 'next/router';

const NewPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] =useState('');
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
    <div>
      <h1>新規投稿</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>タイトル (30文字以内)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 30))} // 最大30文字に制限
            required
          />
          {title.length > 30 && (
            <p style={{ color: 'red' }}>タイトルは30文字以内にしてください。</p>
          )}
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

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading}>
            {loading ? '投稿中...' : '投稿を作成'}
          </button>
          <button type="button" onClick={handleBack}>
            戻る
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;