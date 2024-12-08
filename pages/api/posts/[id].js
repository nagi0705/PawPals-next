// ダミーデータ
let posts = [
  { id: "1", title: "はじめての投稿", content: "これはサンプル投稿です。", authorId: "1", createdAt: "2024-12-01T10:00:00Z" },
  { id: "2", title: "今日の気づき", content: "今日は天気が良かったです！", authorId: "2", createdAt: "2024-12-02T15:30:00Z" },
  { id: "3", title: "編集済み投稿", content: "この投稿は更新されました。", authorId: "3", createdAt: "2024-12-08T12:30:18.281Z", updatedAt: "2024-12-08T12:33:34.452Z" },
];

export default function handler(req, res) {
  const { id } = req.query; // 投稿IDを取得

  if (req.method === "GET") {
    const post = posts.find((p) => p.id === id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } else if (req.method === "PATCH") {
    const { title, content } = req.body;

    // 投稿を検索
    const postIndex = posts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      res.status(404).json({ error: "Post not found" });
    } else {
      // 投稿データを更新
      const updatedPost = {
        ...posts[postIndex],
        title: title || posts[postIndex].title,
        content: content || posts[postIndex].content,
        updatedAt: new Date().toISOString(), // 更新日時を追加
      };

      posts[postIndex] = updatedPost;
      res.status(200).json(updatedPost); // 更新されたデータを返す
    }
  } else if (req.method === "DELETE") {
    const postIndex = posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    posts.splice(postIndex, 1); // 投稿を削除
    return res.status(200).json({ message: "Post deleted successfully" });
  } else {
    res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}