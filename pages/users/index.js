// /pages/users/index.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('ユーザー一覧の取得に失敗しました');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/search?name=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('検索に失敗しました');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>ユーザー一覧</h1>

      {/* 検索フォーム */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="名前で検索"
        />
        <button type="submit">検索</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>検索中...</p>
      ) : (
        <ul>
          {users.length === 0 ? (
            <p>ユーザーが見つかりません。</p>
          ) : (
            users.map((user) => (
              <li key={user.id}>
                <Link href={`/users/${user.id}`}>
                  {user.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Users;