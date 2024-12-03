import { NextResponse } from "next/server";

// ダミーデータ
let users = [
  { id: 1, name: "田中 太郎", email: "taro@example.com" },
  { id: 2, name: "鈴木 花子", email: "hanako@example.com" },
];

// GETリクエストの処理（ユーザーIDによる取得）
export async function GET(req, { params }) {
  const { id } = params;
  const user = users.find((user) => user.id === parseInt(id, 10));

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.json(user);
}

// PATCHリクエストの処理（ユーザー情報の更新）
export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const userIndex = users.findIndex((u) => u.id === parseInt(id, 10));

  if (userIndex === -1) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  users[userIndex] = {
    ...users[userIndex],
    name: body.name || users[userIndex].name,
    email: body.email || users[userIndex].email,
  };

  return NextResponse.json(users[userIndex]);
}