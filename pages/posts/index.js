// pages/posts/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  // 投稿データの取得
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();

        if (response.ok) {
          setPosts(data);
        } else {
          setError(data.message || '投稿データの取得に失敗しました');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPosts();
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>エラー: {error}</p>;
  }

  // トップページに戻る
  const handleGoHome = () => {
    router.push('/top');
  };

  // 新規投稿ページに遷移
  const handleCreateNewPost = () => {
    router.push('/posts/new');
  };

  return (
    <div>
      <h1>投稿一覧</h1>
      <div>
        <button onClick={handleGoHome} style={{ marginRight: '10px' }}>
          トップページに戻る
        </button>
        <button onClick={handleCreateNewPost}>新規投稿を作成</button>
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post.$id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <a href={`/posts/${post.$id}`}>詳細を見る</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;