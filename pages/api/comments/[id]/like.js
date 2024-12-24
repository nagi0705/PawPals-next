import { Client, Databases } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  const { id } = req.query; // コメントID
  const session = await getServerSession(req, res, authOptions);

  // 認証チェック
  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  if (req.method === 'POST') {
    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteエンドポイント
      .setProject('675183a100255c6c9a3f'); // プロジェクトID

    const databases = new Databases(client);

    try {
      // コメントを取得
      const comment = await databases.getDocument(
        '6751bd2800009a139bb8', // データベースID
        '676a2d8800069374a74a', // コレクションID (commentsのID)
        id
      );

      const userEmail = session.user.email; // ログイン中のユーザーのメールアドレス
      const likedBy = comment.likedBy || [];
      let updatedLikedBy;

      if (likedBy.includes(userEmail)) {
        // いいねを取り消す
        updatedLikedBy = likedBy.filter((email) => email !== userEmail);
      } else {
        // いいねを追加
        updatedLikedBy = [...likedBy, userEmail];
      }

      // コメントを更新
      const updatedComment = await databases.updateDocument(
        '6751bd2800009a139bb8', // データベースID
        '676a2d8800069374a74a', // コレクションID
        id,
        {
          likedBy: updatedLikedBy,
          likes: updatedLikedBy.length, // いいね数を更新
        }
      );

      return res.status(200).json(updatedComment);
    } catch (error) {
      console.error('いいねエラー:', error);
      return res.status(500).json({ message: 'いいね操作に失敗しました' });
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}