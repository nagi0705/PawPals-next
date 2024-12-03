import { useEffect, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');  // 検索クエリのステート

  useEffect(() => {
    // APIからユーザー一覧を取得（検索クエリをURLに追加）
    const fetchUsers = async () => {
      const response = await fetch(`/api/admin/users?q=${searchQuery}`);
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, [searchQuery]);  // 検索クエリが変更されたら再取得

  return (
    <div>
      <h1>ユーザー一覧</h1>

      {/* ユーザー検索フォーム */}
      <input
        type="text"
        placeholder="ユーザーを検索"
        value={searchQuery}  // 入力フィールドの値はsearchQueryにバインド
        onChange={(e) => setSearchQuery(e.target.value)}  // 入力値が変更されるたびにsearchQueryを更新
      />

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;