// ダミーデータ
const users = [
  { id: "1", name: "Alice", email: "alice@example.com", profileImage: "https://via.placeholder.com/150" },
  { id: "2", name: "Bob", email: "bob@example.com", profileImage: "https://via.placeholder.com/150" },
  { id: "3", name: "Charlie", email: "charlie@example.com", profileImage: "https://via.placeholder.com/150" },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    const { name, email } = req.query;

    // 検索条件に一致するユーザーをフィルタリング
    const results = users.filter(user => {
      if (name && user.name.toLowerCase().includes(name.toLowerCase())) {
        return true;
      }
      if (email && user.email.toLowerCase().includes(email.toLowerCase())) {
        return true;
      }
      return false;
    });

    return res.status(200).json(results);
  }

  // GET以外のリクエストを拒否
  return res.status(405).json({ error: "Method Not Allowed" });
}