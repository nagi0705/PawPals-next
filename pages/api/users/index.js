export default function handler(req, res) {
  // ダミーデータ
  const users = [
    { id: "1", name: "Alice", email: "alice@example.com", profileImage: "https://via.placeholder.com/150" },
    { id: "2", name: "Bob", email: "bob@example.com", profileImage: "https://via.placeholder.com/150" },
    { id: "3", name: "Charlie", email: "charlie@example.com", profileImage: "https://via.placeholder.com/150" },
  ];

  if (req.method === "GET") {
    res.status(200).json(users); // ユーザー一覧を返す
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}