import { Client, Databases } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  const { id } = req.query;
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  if (req.method === 'POST') {
    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('675183a100255c6c9a3f');

    const databases = new Databases(client);

    try {
      // 投稿を取得
      const post = await databases.getDocument(
        '6751bd2800009a139bb8',
        '6767d981000f6f6e0cfa',
        id
      );

      const userEmail = session.user.email;
      const likedBy = post.likedBy || [];
      let updatedLikes;

      if (likedBy.includes(userEmail)) {
        // いいねを取り消す
        updatedLikes = likedBy.filter((email) => email !== userEmail);
      } else {
        // いいねを追加
        updatedLikes = [...likedBy, userEmail];
      }

      // 投稿を更新
      const updatedPost = await databases.updateDocument(
        '6751bd2800009a139bb8',
        '6767d981000f6f6e0cfa',
        id,
        {
          likedBy: updatedLikes,
          likes: updatedLikes.length, // いいね数を更新
        }
      );

      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error('いいねエラー:', error);
      return res.status(500).json({ message: 'いいね操作に失敗しました' });
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}