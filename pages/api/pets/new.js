import { Client, Databases, ID } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // 認証の確認
  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  // POST メソッドの確認
  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { name, age, species, breed } = req.body;

  // 必須フィールドの確認
  if (!name || !age || !species || !breed) {
    return res.status(400).json({ message: '必須フィールドが不足しています' });
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  const databases = new Databases(client);

  try {
    const newPet = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_PETS_COLLECTION_ID,
      ID.unique(), // 自動生成されたユニークID
      {
        name,
        age: parseInt(age, 10), // 年齢を数値に変換
        species,
        breed,
        ownerEmail: session.user.email, // ログイン中のユーザーのメールを紐付け
        createdAt: new Date().toISOString(), // 登録日時
      }
    );

    // 成功時のレスポンス
    return res.status(201).json(newPet);
  } catch (error) {
    console.error('ペット登録中のエラー:', error);
    return res.status(500).json({
      message: 'ペット登録に失敗しました',
      error: error.message || '予期しないエラーが発生しました',
    });
  }
}