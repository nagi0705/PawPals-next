import { Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID);

const databases = new Databases(client);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_USER_COLLECTION_ID
      );

      const users = response.documents.map(user => ({
        id: user.$id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }));

      res.status(200).json(users);
    } catch (error) {
      console.error('ユーザー一覧取得エラー:', error);
      res.status(500).json({ error: 'ユーザー一覧の取得に失敗しました。' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}