import { Client, Databases, Query } from "appwrite";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const client = new Client();
    const databases = new Databases(client);

    client
      .setEndpoint(process.env.APPWRITE_ENDPOINT) // エンドポイントを設定
      .setProject(process.env.APPWRITE_PROJECT_ID); // プロジェクトIDを設定

    const { query } = req.query; // クエリパラメータを取得

    if (!query) {
      return res.status(400).json({ error: "クエリパラメータが必要です。" });
    }

    try {
      // ユーザーデータを検索
      const response = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID, // データベースID
        process.env.APPWRITE_USER_COLLECTION_ID, // コレクションID
        [Query.search("name", query)] // nameフィールドを対象に検索
      );

      if (response.documents.length === 0) {
        return res.status(404).json({ message: "該当するユーザーが見つかりませんでした。" });
      }

      res.status(200).json(response.documents); // 検索結果を返却
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({
        error: "ユーザー検索に失敗しました。",
        details: error.message,
      });
    }
  } else {
    res.status(405).json({ error: "メソッドが許可されていません。" });
  }
}