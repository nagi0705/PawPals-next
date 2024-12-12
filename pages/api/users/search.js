import { Client, Databases, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT) // Appwriteエンドポイント
  .setProject(process.env.APPWRITE_PROJECT_ID); // プロジェクトID

const databases = new Databases(client);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { name } = req.query; // 検索クエリを取得

    if (!name) {
      return res.status(400).json({ error: '検索クエリが必要です' });
    }

    try {
      // AppwriteのlistDocumentsで検索
      const result = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID, // データベースID
        process.env.APPWRITE_USER_COLLECTION_ID, // コレクションID
        [
          Query.equal('name', name), // 名前に基づく検索
        ]
      );

      res.status(200).json(result.documents); // 一致したドキュメントを返す
    } catch (error) {
      console.error('検索エラー:', error);
      res.status(500).json({ error: '検索処理に失敗しました' });
    }
  } else {
    res.status(405).json({ error: 'メソッドが許可されていません' });
  }
}