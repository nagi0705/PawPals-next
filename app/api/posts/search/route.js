import { NextResponse } from "next/server";

// ダミーデータ
let posts = [
  { id: 1, title: "最初の投稿", content: "これは最初の投稿です。" },
  { id: 2, title: "次の投稿", content: "これは次の投稿です。" },
  { id: 3, title: "新しい投稿のタイトル", content: "これは新しい投稿の内容です。" },
];

// GETリクエストの処理
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return new Response(JSON.stringify({ error: "Search query is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 検索結果のフィルタリング
  const results = posts.filter(
    (post) =>
      post.title.includes(query) || post.content.includes(query)
  );

  if (results.length === 0) {
    return new Response(JSON.stringify({ error: "No posts found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.json(results);
}