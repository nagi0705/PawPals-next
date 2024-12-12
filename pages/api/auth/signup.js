import { Client, Account, ID, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('675183a100255c6c9a3f');

const account = new Account(client);
const databases = new Databases(client);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    try {
      // 1. Appwriteでユーザーアカウントを作成
      const user = await account.create(ID.unique(), email, password, name);

      // 2. ユーザーコレクションにデータを保存
      const userDoc = await databases.createDocument(
        '6751bd2800009a139bb8',
        '6751bf630013fb0750e9',
        user.$id,  // ユーザーIDをドキュメントIDとして使用
        {
          name: name,
          email: email,
          createdAt: new Date().toISOString()
        }
      );

      res.status(201).json({ user, userDoc });
    } catch (error) {
      console.error('サインアップエラー:', error);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}