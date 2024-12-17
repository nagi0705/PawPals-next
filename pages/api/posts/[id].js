import { Client, Databases } from 'appwrite';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('675183a100255c6c9a3f');

  const databases = new Databases(client);
  const databaseId = '6751bd2800009a139bb8';
  const postsCollectionId = '675689f200161a70d144';
  const usersCollectionId = '6751bf630013fb0750e9';

  try {
    switch (req.method) {
      case 'GET':
        const post = await databases.getDocument(databaseId, postsCollectionId, id);
        if (!post) return res.status(404).json({ message: '投稿が見つかりません' });

        // 投稿者名を取得
        let userName = '匿名ユーザー';
        if (post.userId) {
          try {
            const user = await databases.getDocument(databaseId, usersCollectionId, post.userId);
            userName = user?.name || '匿名ユーザー';
          } catch {
            console.warn('ユーザー情報が見つかりません');
          }
        }

        return res.status(200).json({ ...post, userName });

      case 'PATCH':
        const existingPost = await databases.getDocument(databaseId, postsCollectionId, id);
        if (existingPost.userId !== session.user.id) {
          return res.status(403).json({ message: '編集権限がありません' });
        }

        const { content } = req.body;
        if (!content) {
          return res.status(400).json({ message: '投稿内容は必須です' });
        }

        const updatedPost = await databases.updateDocument(databaseId, postsCollectionId, id, {
          content,
          updatedAt: new Date().toISOString(),
        });
        return res.status(200).json(updatedPost);

      case 'DELETE':
        const postToDelete = await databases.getDocument(databaseId, postsCollectionId, id);
        if (postToDelete.userId !== session.user.id) {
          return res.status(403).json({ message: '削除権限がありません' });
        }

        await databases.deleteDocument(databaseId, postsCollectionId, id);
        return res.status(200).json({ message: '投稿を削除しました' });

      default:
        res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}