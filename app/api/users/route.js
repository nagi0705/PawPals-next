import { NextResponse } from "next/server";

const users = [
  { id: 1, name: "田中 太郎", email: "taro@example.com" },
  { id: 2, name: "鈴木 花子", email: "hanako@example.com" },
];

// GET /api/users
export async function GET() {
  return NextResponse.json(users);
}