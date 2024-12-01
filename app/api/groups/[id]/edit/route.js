import { NextResponse } from "next/server";

// ダミーデータ
let groups = [
  { id: 1, name: "グループA", description: "これはグループAです。" },
  { id: 2, name: "グループB", description: "これはグループBです。" },
  { id: 3, name: "グループC", description: "これはグループCの説明です。" },
];

// GETリクエストの処理
export async function GET(req, { params }) {
  const { id } = params;

  const group = groups.find((g) => g.id === parseInt(id, 10));

  if (!group) {
    return new Response(JSON.stringify({ error: "Group not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 編集用データを返却
  const editForm = {
    name: group.name,
    description: group.description,
  };

  return NextResponse.json(editForm);
}