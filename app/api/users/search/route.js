import { NextResponse } from "next/server";

// ダミーデータの作成
const users = [
  { id: 1, name: "田中 太郎", email: "taro@example.com" },
  { id: 2, name: "鈴木 花子", email: "hanako@example.com" },
  { id: 3, name: "佐藤 一郎", email: "ichiro@example.com" },
];

// GETリクエストの処理
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "検索クエリが指定されていません。" }, { status: 400 });
  }

  // 名前またはメールアドレスにクエリが含まれるユーザーをフィルタリング
  const filteredUsers = users.filter(
    (user) =>
      user.name.includes(query) || user.email.includes(query)
  );

  if (filteredUsers.length === 0) {
    return NextResponse.json({ message: "該当するユーザーが見つかりません。" }, { status: 404 });
  }

  return NextResponse.json(filteredUsers);
}