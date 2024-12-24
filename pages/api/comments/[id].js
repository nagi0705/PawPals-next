import { Client, Databases } from 'appwrite';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'コメントIDが必要です' });
  }

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteエンドポイント
    .setProject('675183a100255c6c9a3f'); // プロジェクトID

  const databases = new Databases(client);

  if (req.method === 'DELETE') {
    const { ownerEmail } = req.body; // リクエストボディから作成者メールを取得

    if (!ownerEmail) {
      return res.status(400).json({ message: '必要なデータが不足しています' });
    }

    try {
      // 対象コメントを取得
      const comment = await databases.getDocument(
        '6751bd2800009a139bb8', // データベースID
        '676a2d8800069374a74a', // コレクションID
        id
      );

      // コメント作成者の確認
      if (comment.ownerEmail !== ownerEmail) {
        return res.status(403).json({ message: '削除する権限がありません' });
      }

      // コメント削除
      await databases.deleteDocument(
        '6751bd2800009a139bb8', // データベースID
        '676a2d8800069374a74a', // コレクションID
        id
      );

      res.status(200).json({ message: 'コメントが削除されました' });
    } catch (error) {
      console.error('コメント削除エラー:', error);
      return res.status(500).json({ message: 'コメントの削除に失敗しました' });
    }
  } else if (req.method === 'GET') {
    try {
      // コメントデータの取得
      const comment = await databases.getDocument(
        '6751bd2800009a139bb8', // データベースID
        '676a2d8800069374a74a', // コレクションID (commentsのID)
        id // コメントID
      );

      return res.status(200).json(comment);
    } catch (error) {
      console.error('コメント取得エラー:', error);
      return res.status(404).json({ message: 'コメントが見つかりませんでした' });
    }
  } else {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}