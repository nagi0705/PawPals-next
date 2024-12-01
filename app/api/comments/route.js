import { NextResponse } from "next/server";

// コメントデータ（ダミーデータ）
let comments = [
  { id: 1, postId: 1, content: "最初の投稿へのコメント" },
  { id: 2, postId: 2, content: "次の投稿へのコメント" },
];

// POSTリクエストの処理
export async function POST(req) {
  const body = await req.json();
  const newComment = {
    id: comments.length + 1,
    postId: body.postId,
    content: body.content,
  };

  comments.push(newComment);

  return NextResponse.json(newComment, { status: 201 });
}