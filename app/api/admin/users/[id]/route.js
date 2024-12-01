import { NextResponse } from "next/server";

// ダミーデータ
let users = [
  { id: 1, name: "田中 太郎", email: "taro@example.com" },
  { id: 2, name: "鈴木 花子", email: "hanako@example.com" },
];

// PATCHリクエストの処理（部分更新）
export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();

  // ユーザーの検索
  const userIndex = users.findIndex((u) => u.id === parseInt(id, 10));
  if (userIndex === -1) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ユーザー情報の更新
  users[userIndex] = {
    ...users[userIndex],
    name: body.name || users[userIndex].name,
    email: body.email || users[userIndex].email,
  };

  return NextResponse.json(users[userIndex]);
}

// DELETEリクエストの処理（ユーザー削除）
export async function DELETE(req, { params }) {
  const { id } = params;

  // ユーザーを検索
  const userIndex = users.findIndex((user) => user.id === parseInt(id, 10));

  if (userIndex === -1) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ユーザーを削除
  const deletedUser = users.splice(userIndex, 1)[0];

  return NextResponse.json({
    message: "User deleted successfully",
    deletedUser,
  });
}