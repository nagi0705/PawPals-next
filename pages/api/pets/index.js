import { Client, Databases } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  const databases = new Databases(client);

  try {
    const pets = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_PETS_COLLECTION_ID 
    );

    return res.status(200).json(pets.documents);
  } catch (error) {
    console.error('エラー:', error);
    return res.status(500).json({ message: 'ペットデータの取得に失敗しました', error: error.message });
  }
}