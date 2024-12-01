import { NextResponse } from "next/server";

// ダミーデータ
let groups = [
  { id: 1, name: "グループA", description: "これはグループAです。" },
  { id: 2, name: "グループB", description: "これはグループBです。" },
];

// GETリクエストの処理（特定のグループを取得）
export async function GET(req, { params }) {
  const { id } = params;
  const group = groups.find((g) => g.id === parseInt(id, 10));

  if (!group) {
    return new Response(JSON.stringify({ error: "Group not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.json(group);
}

// PATCHリクエストの処理（部分更新）
export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();

  const groupIndex = groups.findIndex((g) => g.id === parseInt(id, 10));
  if (groupIndex === -1) {
    return new Response(JSON.stringify({ error: "Group not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  groups[groupIndex] = {
    ...groups[groupIndex],
    name: body.name || groups[groupIndex].name,
    description: body.description || groups[groupIndex].description,
  };

  return NextResponse.json(groups[groupIndex]);
}

// PUTリクエストの処理（完全更新）
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  const groupIndex = groups.findIndex((g) => g.id === parseInt(id, 10));
  if (groupIndex === -1) {
    return new Response(JSON.stringify({ error: "Group not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  groups[groupIndex] = {
    id: parseInt(id, 10),
    name: body.name || "デフォルトグループ名",
    description: body.description || "デフォルト説明",
  };

  return NextResponse.json(groups[groupIndex]);
}

// DELETEリクエストの処理（削除）
export async function DELETE(req, { params }) {
  const { id } = params;

  const groupIndex = groups.findIndex((g) => g.id === parseInt(id, 10));
  if (groupIndex === -1) {
    return new Response(JSON.stringify({ error: "Group not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const deletedGroup = groups.splice(groupIndex, 1)[0];

  return NextResponse.json({
    message: "Group deleted successfully",
    deletedGroup,
  });
}