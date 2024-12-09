import { Client } from "appwrite";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const client = new Client();

    client
      .setEndpoint(process.env.APPWRITE_ENDPOINT) // エンドポイントを設定
      .setProject(process.env.APPWRITE_PROJECT_ID); // プロジェクトIDを設定

    try {
      // 完全なURLを構築
      const url = `${process.env.APPWRITE_ENDPOINT}/databases/${process.env.APPWRITE_DATABASE_ID}/collections/${process.env.APPWRITE_USER_COLLECTION_ID}/documents`;

      // APIキーを使用してヘッダーを追加
      const response = await client.call("GET", url, {
        headers: {
          "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID,
          "X-Appwrite-Key": process.env.APPWRITE_API_KEY, // APIキーを追加
        },
      });

      res.status(200).json(response.documents); // ユーザー一覧を返却
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        error: "ユーザー一覧の取得に失敗しました。",
        details: error.message,
      });
    }
  } else {
    res.status(405).json({ error: "メソッドが許可されていません。" });
  }
}