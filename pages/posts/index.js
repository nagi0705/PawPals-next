import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('投稿データの取得に失敗しました');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>投稿一覧</h1>

      {/* 新規投稿ボタン */}
      <div style={{ marginBottom: '20px' }}>
        <Link href="/posts/new">
          <button style={{ padding: '10px 20px', cursor: 'pointer' }}>
            新しい投稿を作成
          </button>
        </Link>
      </div>

      {/* エラーメッセージ */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 投稿リスト */}
      <ul>
        {posts.map((post) => (
          <li key={post.$id} style={{ marginBottom: '10px' }}>
            {/* 投稿内容のみ表示 */}
            <Link
              href={`/posts/${post.$id}`}
              style={{ textDecoration: 'none', color: 'blue', cursor: 'pointer' }}
            >
              {post.content}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}