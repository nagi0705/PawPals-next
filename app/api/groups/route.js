import { NextResponse } from "next/server";

// ダミーデータ
let groups = [
  { id: 1, name: "グループA", description: "これはグループAです。" },
  { id: 2, name: "グループB", description: "これはグループBです。" },
  { id: 3, name: "グループC", description: "これはグループCです。" },
];

// GETリクエストの処理
export async function GET() {
  return NextResponse.json(groups);
}

// POSTリクエストの処理
export async function POST(req) {
  const body = await req.json();

  const newGroup = {
    id: groups.length + 1,
    name: body.name || "新しいグループ",
    description: body.description || "説明がありません。",
  };

  groups.push(newGroup);

  return NextResponse.json(newGroup, { status: 201 });
}