import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { databases } from '@/lib/appwrite';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: '認証が必要です' });

  const { id } = req.query;
  const userId = session.user.id;

  try {
    // 投稿の取得
    const post = await databases.getDocument(
      '6751bd2800009a139bb8', // 正しい DATABASE_ID
      '675689f200161a70d144', // 正しい POSTS_COLLECTION_ID
      id
    );

    if (!post) return res.status(404).json({ message: '投稿が見つかりません' });

    // いいね配列が存在しない場合は空配列に設定
    const likes = Array.isArray(post.likes) ? post.likes : [];

    if (req.method === 'POST') {
      // いいねの追加
      if (!likes.includes(userId)) {
        likes.push(userId);
        await databases.updateDocument(
          '6751bd2800009a139bb8', 
          '675689f200161a70d144', 
          id, 
          { likes }
        );
        return res.status(200).json({ message: 'いいねしました', likes });
      }
      return res.status(400).json({ message: 'すでにいいね済みです' });
    }

    if (req.method === 'DELETE') {
      // いいねの削除
      const updatedLikes = likes.filter((likeId) => likeId !== userId);
      await databases.updateDocument(
        '6751bd2800009a139bb8', 
        '675689f200161a70d144', 
        id, 
        { likes: updatedLikes }
      );
      return res.status(200).json({ message: 'いいねを削除しました', likes: updatedLikes });
    }

    return res.status(405).json({ message: 'メソッドが許可されていません' });
  } catch (error) {
    console.error('エラー:', error);
    return res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
}