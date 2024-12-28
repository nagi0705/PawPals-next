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
    <div
      style={{
        backgroundColor: "#e2ffe2", // グリーンの背景色
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "800px",
      }}
    >
      <h1 style={{ color: "#f68fe1", textAlign: "center" }}>投稿一覧</h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <button
          onClick={handleGoHome}
          style={{
            backgroundColor: "#f68fe1",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          トップページに戻る
        </button>
        <button
          onClick={handleCreateNewPost}
          style={{
            backgroundColor: "#f68fe1",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          新規投稿を作成
        </button>
      </div>
      <form onSubmit={handleSearch} style={{ margin: "20px 0", textAlign: "center" }}>
        <input
          type="text"
          placeholder="検索クエリを入力"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "8px",
            width: "70%",
            border: "2px solid black", // 黒い縁を追加
            borderRadius: "8px",
            marginRight: "10px",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#f68fe1",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          検索
        </button>
      </form>
      <div>
        {posts.map((post) => (
          <div
            key={post.$id}
            style={{
              backgroundColor: "#ffffff", // 個々の投稿を白で囲む
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ color: "#f68fe1", textAlign: "center" }}>{post.title}</h2>
            <p style={{ textAlign: "center" }}>{post.content}</p>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => router.push(`/posts/${post.$id}`)}
                style={{
                  backgroundColor: "#f68fe1",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  border: "none",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                詳細を見る
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsList;