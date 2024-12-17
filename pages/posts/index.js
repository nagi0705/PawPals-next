// pages/posts/index.js
import { useEffect, useState } from 'react';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  // 投稿データを取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('投稿データの取得に失敗しました');
        }
        const data = await response.json();
        console.log('APIレスポンス:', data); // レスポンスを確認
        setPosts(data.documents || []); // Appwriteのレスポンス形式に合わせる
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>投稿一覧</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {posts.map((post) => (
          <li key={post.$id}>
            <a href={`/posts/${post.$id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
      <a href="/posts/new">
        <button>新しい投稿を作成</button>
      </a>
    </div>
  );
}