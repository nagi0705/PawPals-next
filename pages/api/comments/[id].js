import { Client, Databases } from 'appwrite';

const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteのエンドポイント
  .setProject('675183a100255c6c9a3f'); // AppwriteのプロジェクトID

const databases = new Databases(client);

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    const { content, like, userId } = req.body;

    try {
      const comment = await databases.getDocument(
        '6751bd2800009a139bb8', // データベースID
        '67568c740018fb94fa2d', // コメントコレクションID
        id
      );

      if (like !== undefined) {
        if (!userId) {
          return res.status(400).json({ message: 'ユーザーIDが必要です' });
        }

        const updatedLikes = like
          ? [...new Set([...(comment.likes || []), userId])]
          : comment.likes?.filter((uid) => uid !== userId);

        const updatedComment = await databases.updateDocument(
          '6751bd2800009a139bb8',
          '67568c740018fb94fa2d',
          id,
          { likes: updatedLikes }
        );

        return res.status(200).json(updatedComment);
      }

      if (content) {
        const updatedComment = await databases.updateDocument(
          '6751bd2800009a139bb8',
          '67568c740018fb94fa2d',
          id,
          { content }
        );

        return res.status(200).json(updatedComment);
      }

      return res.status(400).json({ message: 'リクエストが不正です' });
    } catch (error) {
      console.error('コメント更新エラー:', error);
      return res
        .status(500)
        .json({ message: 'コメントの更新に失敗しました', error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await databases.deleteDocument(
        '6751bd2800009a139bb8',
        '67568c740018fb94fa2d',
        id
      );
      return res.status(200).json({ message: 'コメントを削除しました' });
    } catch (error) {
      console.error('コメント削除エラー:', error);
      return res.status(500).json({ message: 'コメントの削除に失敗しました', error: error.message });
    }
  }

  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}