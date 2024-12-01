import { NextResponse } from "next/server";

// ダミーデータ
let users = [
  { id: 1, name: "田中 太郎", email: "taro@example.com" },
  { id: 2, name: "鈴木 花子", email: "hanako@example.com" },
];

// GETリクエストの処理（ユーザー編集用データ）
export async function GET(req, { params }) {
  const { id } = params;
  const user = users.find((u) => u.id === parseInt(id, 10));

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.json(user);
}