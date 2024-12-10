import { Client, Databases } from "appwrite";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const client = new Client();
    const databases = new Databases(client);

    client
      .setEndpoint(process.env.APPWRITE_ENDPOINT) // エンドポイントを設定
      .setProject(process.env.APPWRITE_PROJECT_ID); // プロジェクトIDを設定

    const { id } = req.query; // リクエストからユーザーIDを取得

    try {
      // 特定のユーザーデータを取得
      const response = await databases.getDocument(
        process.env.APPWRITE_DATABASE_ID, // データベースID
        process.env.APPWRITE_USER_COLLECTION_ID, // コレクションID
        id // ドキュメントID（ユーザーID）
      );
      res.status(200).json(response); // ユーザー詳細データを返却
    } catch (error) {
      if (error.message === "Document not found") {
        res.status(404).json({
          error: "指定されたIDのユーザーが存在しません。",
        });
      } else {
        res.status(500).json({
          error: "ユーザーの詳細情報の取得に失敗しました。",
          details: error.message,
        });
      }
    }
  } else {
    res.status(405).json({ error: "メソッドが許可されていません。" });
  }
}