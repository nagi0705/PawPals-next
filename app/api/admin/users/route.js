import { NextResponse } from "next/server";

// ダミーデータ
let users = [
  { id: 1, name: "田中 太郎", email: "taro@example.com" },
  { id: 2, name: "鈴木 花子", email: "hanako@example.com" },
];

// GETリクエストの処理（全ユーザー表示）
export async function GET() {
  return NextResponse.json(users);
}