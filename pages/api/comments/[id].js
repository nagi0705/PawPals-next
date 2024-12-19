import { Client, Databases } from 'appwrite';

const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteのエンドポイント
  .setProject('675183a100255c6c9a3f'); // AppwriteのプロジェクトID

const databases = new Databases(client);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'コメント内容は必須です' });
    }

    try {
      const updatedComment = await databases.updateDocument(
        '6751bd2800009a139bb8', // データベースID
        '67568c740018fb94fa2d', // コメントコレクションID
        id, // コメントID
        { content } // 更新するフィールド
      );

      return res.status(200).json(updatedComment);
    } catch (error) {
      console.error('コメント更新エラー:', error);
      return res.status(500).json({ message: 'コメントの更新に失敗しました', error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await databases.deleteDocument(
        '6751bd2800009a139bb8', // データベースID
        '67568c740018fb94fa2d', // コメントコレクションID
        id // コメントID
      );
      return res.status(200).json({ message: 'コメントを削除しました' });
    } catch (error) {
      console.error('コメント削除エラー:', error);
      return res.status(500).json({ message: 'コメントの削除に失敗しました', error: error.message });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}