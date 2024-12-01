import { NextResponse } from "next/server";

// コメントデータ（ダミーデータ）
let comments = [
  { id: 1, postId: 1, content: "最初の投稿へのコメント" },
  { id: 2, postId: 2, content: "次の投稿へのコメント" },
];

// DELETEリクエストの処理
export async function DELETE(req, { params }) {
  const { id } = params;

  // 削除対象のコメントを検索
  const commentIndex = comments.findIndex((c) => c.id === parseInt(id, 10));
  if (commentIndex === -1) {
    return new Response(JSON.stringify({ error: "Comment not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // コメントを削除
  const deletedComment = comments.splice(commentIndex, 1);

  return NextResponse.json(
    { message: "Comment deleted successfully", deletedComment },
    { status: 200 }
  );
}