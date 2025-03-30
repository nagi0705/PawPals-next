// /pages/api/facilities/new.js
import { Client, Databases, ID } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  const { name, location, type, petsAllowed, features } = req.body;

  if (!name || !location || !petsAllowed) {
    return res.status(400).json({ message: '必須フィールドが不足しています' });
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  const databases = new Databases(client);

  try {
        const newFacility = await databases.createDocument(
        '6751bd2800009a139bb8',
        '67e8e07100164c327c35',
        ID.unique(),
        {
        name: name.trim(),
        location: location.trim(),
        type: type || '',
        petsAllowed: petsAllowed.trim(),
        features: features || '',
        ownerEmail: session.user.email,
        createdAt: new Date().toISOString(),
      }
    );

    return res.status(201).json(newFacility);
  } catch (error) {
    console.error('施設登録エラー:', error);
    return res.status(500).json({ message: '施設登録に失敗しました', error: error.message });
  }
}