// /pages/api/facilities/[id].js
import { Client, Databases } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('675183a100255c6c9a3f');
  const databases = new Databases(client);

  try {
    // 取得対象の施設
    const facility = await databases.getDocument(
      '6751bd2800009a139bb8',
      '67e8e07100164c327c35',
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
        '6751bd2800009a139bb8',
        '67e8e07100164c327c35',
        id,
        {
          name: name.trim(),
          location: location.trim(),
          type: type || '',
          petsAllowed: Array.isArray(petsAllowed) ? petsAllowed.join(', ') : petsAllowed,
          features: features ? (Array.isArray(features) ? features.join(', ') : features) : ''
        }
      );

      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      await databases.deleteDocument(
        '6751bd2800009a139bb8',
        '67e8e07100164c327c35',
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