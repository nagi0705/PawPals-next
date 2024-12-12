import { Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT) // Appwriteエンドポイント
  .setProject(process.env.APPWRITE_PROJECT_ID); // プロジェクトID

const databases = new Databases(client);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Appwrite APIで特定のユーザー情報を取得
      const userDoc = await databases.getDocument(
        process.env.APPWRITE_DATABASE_ID, // データベースID
        process.env.APPWRITE_USER_COLLECTION_ID, // コレクションID
        id // ユーザーID
      );

      res.status(200).json(userDoc); // ユーザー情報を返す
    } catch (error) {
      console.error('ユーザー詳細取得エラー:', error);
      res.status(404).json({ error: 'ユーザーが見つかりませんでした。' });
    }
  } else {
    res.status(405).json({ error: 'メソッドが許可されていません。' });
  }
}