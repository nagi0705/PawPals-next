import { NextResponse } from "next/server";

let posts = [
  { id: 1, title: "最初の投稿", content: "これは最初の投稿です。" },
  { id: 2, title: "次の投稿", content: "これは次の投稿です。" },
];

// POSTリクエストの処理
export async function POST(req) {
  const body = await req.json();
  const newPost = {
    id: posts.length + 1,
    title: body.title || "無題",
    content: body.content || "内容がありません。",
  };

  posts.push(newPost);

  return NextResponse.json(newPost, { status: 201 });
}

// GETリクエストの処理（既存コードのまま）
export async function GET() {
  return NextResponse.json(posts);
}