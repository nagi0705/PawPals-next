import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // 検索クエリの状態
  const [error, setError] = useState(null);
  const router = useRouter();

  // 投稿データの取得
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

  // 検索機能
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/posts/search?query=${searchQuery}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      } else {
        setError(data.message || '検索に失敗しました');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
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
      <form onSubmit={handleSearch} style={{ margin: '20px 0' }}>
        <input
          type="text"
          placeholder="検索クエリを入力"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button type="submit">検索</button>
      </form>
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