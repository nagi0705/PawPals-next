// /pages/api/facilities/[id].js
import { Client, Databases } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);
  const databases = new Databases(client);

  try {
    // 取得対象の施設
    const facility = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_FACILITIES_COLLECTION_ID,
      id
    );

    // PATCH / DELETE はログイン必須 & オーナーのみ
    if (['PATCH', 'DELETE'].includes(req.method)) {
      if (!session) {
        return res.status(401).json({ message: '認証が必要です' });
      }
      if (facility.ownerEmail !== session.user.email) {
        return res.status(403).json({ message: 'この施設を編集・削除する権限がありません' });
      }
    }

    if (req.method === 'GET') {
      return res.status(200).json(facility);
    }

    if (req.method === 'PATCH') {
      const { name, location, type, petsAllowed, features } = req.body;
      if (!name || !location || !petsAllowed) {
        return res.status(400).json({ message: '必須項目が不足しています' });
      }

      const updated = await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_FACILITIES_COLLECTION_ID,
        id,
        {
          name: name.trim(),
          location: location.trim(),
          type: type || '',
          petsAllowed: petsAllowed.trim(),
          features: features || '',
          updatedAt: new Date().toISOString(),
        }
      );

      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      await databases.deleteDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_FACILITIES_COLLECTION_ID,
        id
      );

      return res.status(200).json({ message: '施設が削除されました' });
    }

    res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });

  } catch (error) {
    console.error('施設操作エラー:', error);
    return res.status(500).json({ message: 'エラーが発生しました', error: error.message });
  }
}