import { NextResponse } from "next/server";

// ダミーデータ
let posts = [
  { id: 1, title: "最初の投稿", content: "これは最初の投稿です。" },
  { id: 2, title: "次の投稿", content: "これは次の投稿です。" },
  { id: 3, title: "新しい投稿のタイトル", content: "これは新しい投稿の内容です。" },
];

// GETリクエストの処理
export async function GET(req, { params }) {
  const { id } = params;
  const post = posts.find((p) => p.id === parseInt(id, 10));

  if (!post) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.json(post);
}

// PATCHリクエストの処理
export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();

  // 指定された投稿を検索
  const postIndex = posts.findIndex((p) => p.id === parseInt(id, 10));
  if (postIndex === -1) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 投稿データを部分更新
  posts[postIndex] = {
    ...posts[postIndex],
    title: body.title || posts[postIndex].title,
    content: body.content || posts[postIndex].content,
  };

  return NextResponse.json(posts[postIndex]);
}

// PUTリクエストの処理
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  // 指定された投稿を検索
  const postIndex = posts.findIndex((p) => p.id === parseInt(id, 10));
  if (postIndex === -1) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 投稿データを完全更新
  posts[postIndex] = {
    id: parseInt(id, 10),
    title: body.title || "無題",
    content: body.content || "内容がありません。",
  };

  return NextResponse.json(posts[postIndex]);
}

// DELETEリクエストの処理
export async function DELETE(req, { params }) {
  const { id } = params;

  // 指定された投稿を検索
  const postIndex = posts.findIndex((p) => p.id === parseInt(id, 10));
  if (postIndex === -1) {
    return new Response(JSON.stringify({ error: "Post not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 投稿データを削除
  const deletedPost = posts.splice(postIndex, 1);

  return NextResponse.json({
    message: "Post deleted successfully",
    deletedPost: deletedPost[0],
  });
}