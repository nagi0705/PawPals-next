import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const NewGroup = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users || []);
        } else {
          console.error("Failed to fetch users:", data);
        }
      } catch (err) {
        console.error("ユーザー取得エラー:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/groups/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          members,
        }),
      });

      if (response.ok) {
        router.push("/groups");
      } else {
        const data = await response.json();
        setError(data.message || "グループの作成に失敗しました");
      }
    } catch (err) {
      setError("グループの作成中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const maskEmail = (email) => {
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.charAt(0) + "*".repeat(username.length - 2) + username.charAt(username.length - 1);
    const [domainName, extension] = domain.split(".");
    const maskedDomain = domainName.charAt(0) + "*".repeat(domainName.length - 1);
    return `${maskedUsername}@${maskedDomain}.${extension}`;
  };

  if (!session) {
    return <div>ログインが必要です</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>新しいグループを作成</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>
            グループ名
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="description" style={{ display: "block", marginBottom: "5px" }}>
            説明
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            メンバー（複数選択可。自分は含めないで選択してください。）
          </label>
          <select
            multiple
            value={members}
            onChange={(e) => setMembers(Array.from(e.target.selectedOptions, (option) => option.value))}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              minHeight: "150px",
            }}
          >
            {users.map((user) => (
              <option key={user.$id} value={user.email}>
                {user.name} ({maskEmail(user.email)})
              </option>
            ))}
          </select>
          <small style={{ color: "#666", marginTop: "5px", display: "block" }}>
            コマンドキーを押しながらクリックで複数選択できます
          </small>
        </div>

        {error && <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>}

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "作成中..." : "作成"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/groups")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#666",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewGroup;