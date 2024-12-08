// pages/api/posts/new.js

export default function handler(req, res) {
  if (req.method === "GET") {
    // 新しい投稿作成フォーム用のデータを返す
    const formData = {
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
    };

    res.status(200).json(formData);
  } else {
    // サポートされていないメソッド
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}