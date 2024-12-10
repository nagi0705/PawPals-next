import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 検索クエリ
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/users/search?query=${query}`);
      if (!response.ok) {
        throw new Error("データの取得に失敗しました。");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 初期ロード
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchQuery); // 検索クエリを利用してデータ取得
  };

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p>エラーが発生しました: {error}</p>;
  }

  return (
    <div>
      <h1>ユーザー一覧</h1>
      {/* 検索フォーム */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="名前で検索..."
        />
        <button type="submit">検索</button>
      </form>

      {/* ユーザー一覧 */}
      {users.length === 0 ? (
        <p>ユーザーが見つかりません。</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.$id}>
              <Link href={`/users/${user.$id}`}>
                {user.name} - {user.email}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}