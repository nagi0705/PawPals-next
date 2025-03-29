import { Client, Databases } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // 認証の確認
  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  const { id } = req.query;

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  const databases = new Databases(client);

  try {
    // 対象の物件データを取得
    const property = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_PROPERTIES_COLLECTION_ID,
      id
    );

    // 所有者チェック
    if (property.ownerEmail !== session.user.email) {
      return res.status(403).json({ message: 'この物件を編集または削除する権限がありません' });
    }

    // PATCH メソッド: 物件情報の更新
    if (req.method === 'PATCH') {
      const { housename, location, price, petsAllowed, features } = req.body;

      if (!housename || !location || !price || !petsAllowed) {
        return res.status(400).json({ message: '必須項目が不足しています' });
      }

      const updatedProperty = await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_PROPERTIES_COLLECTION_ID,
        id,
        {
          housename: housename.trim(),
          location: location.trim(),
          price: parseInt(price, 10),
          petsAllowed: Array.isArray(petsAllowed)
            ? petsAllowed.join(', ')
            : petsAllowed,  // 文字列でもそのまま
          features: features
            ? Array.isArray(features)
              ? features.join(', ')
              : features
            : '',
          updatedAt: new Date().toISOString(),
        }
      );

      return res.status(200).json(updatedProperty);
    }

    // DELETE メソッド: 物件情報の削除
    if (req.method === 'DELETE') {
      await databases.deleteDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_PROPERTIES_COLLECTION_ID,
        id
      );

      return res.status(200).json({ message: '物件情報を削除しました' });
    }

    // GET メソッド: 物件情報の取得
    if (req.method === 'GET') {
      return res.status(200).json(property);
    }

    // サポートされていないメソッド
    res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('エラー:', error);

    if (error.code === 404) {
      return res.status(404).json({ message: '物件が見つかりません' });
    }

    return res.status(500).json({ message: 'サーバーエラーが発生しました', error: error.message });
  }
}