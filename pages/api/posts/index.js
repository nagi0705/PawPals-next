import { Client, Databases, ID, Query } from 'appwrite';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

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
        const posts = await databases.listDocuments(
          databaseId,
          postsCollectionId,
          [
            Query.orderDesc('createdAt'), // 新しい投稿順
            Query.limit(50) // 一度に取得する投稿数を制限
          ]
        );
        
        return res.status(200).json(posts);

      case 'POST':
        const { content, petId } = req.body;
        
        if (!content || !petId) {
          return res.status(400).json({ 
            message: '投稿内容とペットIDは必須です' 
          });
        }

        const post = await databases.createDocument(
          databaseId,
          postsCollectionId,
          ID.unique(),
          {
            content,
            petId,
            userId: session.user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        );
        
        return res.status(201).json(post);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}