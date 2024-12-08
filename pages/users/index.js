import { useEffect, useState } from "react";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 検索クエリ
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ユーザー一覧を取得
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data); // 初期状態では全ユーザーを表示
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // 検索クエリに応じてユーザーをフィルタリング
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = users.filter((user) => {
        const petMatch = user.pets?.some(
          (pet) =>
            pet.name.toLowerCase().includes(lowerCaseQuery) ||
            pet.species.toLowerCase().includes(lowerCaseQuery)
        );
        return (
          user.name.toLowerCase().includes(lowerCaseQuery) ||
          user.email.toLowerCase().includes(lowerCaseQuery) ||
          (user.groups && user.groups.some((group) => group.toLowerCase().includes(lowerCaseQuery))) ||
          petMatch // ペット情報で一致する場合
        );
      });
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>ユーザー一覧</h1>

      {/* 検索フォーム */}
      <input
        type="text"
        placeholder="名前、メール、グループ、ペットで検索"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px", fontSize: "16px" }}
      />

      {/* ユーザーリスト */}
      <ul>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li key={user.id} style={{ marginBottom: "30px" }}>
              <h2>{user.name}</h2>
              <p>Email: {user.email}</p>
              <img
                src={user.profileImage}
                alt={`${user.name}のプロフィール画像`}
                width="100"
                style={{ borderRadius: "50%" }}
              />
              <p>所属グループ: {user.groups?.join(", ") || "なし"}</p>

              {/* ペット情報 */}
              <h3>登録ペット</h3>
              <ul>
                {user.pets && user.pets.length > 0 ? (
                  user.pets.map((pet, index) => (
                    <li key={index}>
                      <strong>{pet.name}</strong> ({pet.species}, {pet.breed}, {pet.age}歳)
                    </li>
                  ))
                ) : (
                  <p>ペットが登録されていません。</p>
                )}
              </ul>
            </li>
          ))
        ) : (
          <p>該当するユーザーが見つかりません。</p>
        )}
      </ul>
    </div>
  );
};

export default UsersPage;