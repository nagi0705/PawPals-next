import { Client, Databases } from 'appwrite';

export default async function handler(req, res) {
  const { id } = req.query;

  // クライアントの初期化
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  const databases = new Databases(client);

  try {
    switch (req.method) {
      case 'GET':
        // コメントの取得
        const comment = await databases.getDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_COMMENTS_COLLECTION_ID,
          id
        );
        return res.status(200).json(comment);

      case 'PATCH':
        // コメントの更新
        const updatedComment = await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_COMMENTS_COLLECTION_ID,
          id,
          {
            content: req.body.content
          }
        );
        return res.status(200).json(updatedComment);

      case 'DELETE':
        // コメントの削除
        await databases.deleteDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_COMMENTS_COLLECTION_ID,
          id
        );
        return res.status(200).json({ message: 'コメントが削除されました' });

      default:
        return res.status(405).json({ message: 'メソッドが許可されていません' });
    }
  } catch (error) {
    console.error('コメント操作エラー:', error);
    return res.status(500).json({ 
      message: 'エラーが発生しました',
      error: error.message 
    });
  }
}