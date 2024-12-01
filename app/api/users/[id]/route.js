export async function GET(req, { params }) {
  const { id } = params;

  const users = [
    { id: 1, name: "田中 太郎", email: "taro@example.com" },
    { id: 2, name: "鈴木 花子", email: "hanako@example.com" },
  ];

  // ユーザー検索
  const user = users.find((u) => u.id === parseInt(id));

  // ユーザーが見つからない場合
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ユーザー情報を返す
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}