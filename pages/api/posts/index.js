// ダミーデータ
let posts = [
  { id: "1", title: "はじめての投稿", content: "これはサンプル投稿です。", authorId: "1", createdAt: "2024-12-01T10:00:00Z" },
  { id: "2", title: "今日の気づき", content: "今日は天気が良かったです！", authorId: "2", createdAt: "2024-12-02T15:30:00Z" },
];

export default function handler(req, res) {
  if (req.method === "GET") {
    // 全投稿を取得
    res.status(200).json(posts);
  } else if (req.method === "POST") {
    // 新しい投稿を作成
    const { title, content, authorId } = req.body;

    // 必須フィールドのチェック
    if (!title || !content || !authorId) {
      return res.status(400).json({ error: "すべてのフィールドを入力してください" });
    }

    const newPost = {
      id: (posts.length + 1).toString(), // 新しいIDを生成
      title,
      content,
      authorId,
      createdAt: new Date().toISOString(),
    };

    posts.push(newPost); // ダミーデータに追加
    res.status(201).json(newPost); // 作成された投稿を返す
  } else {
    // サポートされていないメソッド
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}