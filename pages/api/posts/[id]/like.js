import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { databases } from '@/lib/appwrite';
import { ID } from 'appwrite';

export default async function handler(req, res) {
  // セッションの取得
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  const { id } = req.query;
  const userId = session.user.id;

  try {
    // 投稿の取得
    const post = await databases.getDocument(
      '6751bd2800009a139bb8',  // DATABASE_ID
      '675689f200161a70d144',  // POSTS_COLLECTION_ID
      id
    );

    if (!post) {
      return res.status(404).json({ message: '投稿が見つかりません' });
    }

    // 現在のいいね配列を取得
    const likes = post.likes || [];
    
    if (req.method === 'POST') {
      // いいねの追加
      if (!likes.includes(userId)) {
        likes.push(userId);
        await databases.updateDocument(
          '6751bd2800009a139bb8',  // DATABASE_ID
          '675689f200161a70d144',  // POSTS_COLLECTION_ID
          id,
          { likes }
        );
        return res.status(200).json({ message: 'いいねを追加しました', likes });
      }
      return res.status(400).json({ message: 'すでにいいね済みです' });

    } else if (req.method === 'DELETE') {
      // いいねの削除
      const newLikes = likes.filter(likeId => likeId !== userId);
      if (likes.length !== newLikes.length) {
        await databases.updateDocument(
          '6751bd2800009a139bb8',  // DATABASE_ID
          '675689f200161a70d144',  // POSTS_COLLECTION_ID
          id,
          { likes: newLikes }
        );
        return res.status(200).json({ message: 'いいねを削除しました', likes: newLikes });
      }
      return res.status(400).json({ message: 'いいねが見つかりません' });

    } else {
      return res.status(405).json({ message: 'メソッドが許可されていません' });
    }

  } catch (error) {
    console.error('エラー:', error);
    return res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
}