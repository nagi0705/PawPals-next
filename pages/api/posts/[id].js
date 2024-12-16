import { Client, Databases, Query } from 'appwrite';
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

  try {
    switch (req.method) {
      case 'GET':
        const post = await databases.getDocument(
          databaseId,
          postsCollectionId,
          id
        );
        return res.status(200).json(post);

      case 'PATCH':
        // まず投稿が存在し、ユーザーが所有者であることを確認
        const existingPost = await databases.getDocument(
          databaseId,
          postsCollectionId,
          id
        );

        if (existingPost.userId !== session.user.id) {
          return res.status(403).json({ message: '投稿の編集権限がありません' });
        }

        const { content } = req.body;
        if (!content) {
          return res.status(400).json({ message: '投稿内容は必須です' });
        }

        const updatedPost = await databases.updateDocument(
          databaseId,
          postsCollectionId,
          id,
          {
            content,
            updatedAt: new Date().toISOString()
          }
        );
        return res.status(200).json(updatedPost);

      case 'DELETE':
        // まず投稿が存在し、ユーザーが所有者であることを確認
        const postToDelete = await databases.getDocument(
          databaseId,
          postsCollectionId,
          id
        );

        if (postToDelete.userId !== session.user.id) {
          return res.status(403).json({ message: '投稿の削除権限がありません' });
        }

        await databases.deleteDocument(
          databaseId,
          postsCollectionId,
          id
        );
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