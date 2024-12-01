import { NextResponse } from "next/server";

// ダミーデータの投稿一覧
let posts = [
  { id: 1, title: "最初の投稿", content: "これは最初の投稿です。" },
  { id: 2, title: "次の投稿", content: "これは次の投稿です。" },
  { id: 3, title: "新しい投稿", content: "新しい投稿の内容です。" },
];

// GETリクエストの処理
export async function GET(req, { params }) {
  const { id } = params;

  // 指定された投稿を検索
  const post = posts.find((p) => p.id === parseInt(id, 10));

  if (!post) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 編集用のデータを返却
  return NextResponse.json({
    id: post.id,
    title: post.title,
    content: post.content,
  });
}