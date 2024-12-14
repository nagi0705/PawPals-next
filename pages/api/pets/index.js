import { Client, Databases, Query } from 'appwrite';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // セッションを取得してユーザー認証を確認
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "認証が必要です" });
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  const databases = new Databases(client);

  // GET リクエスト（ペット一覧の取得）
  if (req.method === 'GET') {
    try {
      const response = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_PETS_COLLECTION_ID
      );
      return res.status(200).json(response.documents);
    } catch (error) {
      console.error('Error details:', error);
      return res.status(500).json({ 
        message: 'Internal Server Error',
        error: error.message
      });
    }
  }

  // POST リクエスト（新しいペットの登録）
  if (req.method === 'POST') {
    try {
      // ユーザーのペット登録数を確認
      const userPets = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_PETS_COLLECTION_ID,
        [Query.equal('userId', session.user.id)]
      );

      // 10匹以上登録している場合はエラー
      if (userPets.total >= 10) {
        return res.status(400).json({ message: "ペットの登録は10匹までです" });
      }

      const { name, species, breed, age } = req.body;

      // 必須フィールドの検証
      if (!name || !species || !breed || !age) {
        return res.status(400).json({ message: "必須項目が不足しています" });
      }

      const response = await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_PETS_COLLECTION_ID,
        'unique()',
        {
          name,
          species,
          breed,
          age: parseInt(age),
          userId: session.user.id,
          createdAt: new Date().toISOString()
        }
      );

      return res.status(201).json(response);
    } catch (error) {
      console.error('Error creating pet:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}