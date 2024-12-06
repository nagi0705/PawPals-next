// pages/api/auth/signin.js
import { Client, Account } from 'appwrite';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Appwriteクライアントの設定
    const client = new Client();
    client.setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID);

    const account = new Account(client);

    try {
      // Appwriteでサインイン（createEmailPasswordSessionを使用）
      const session = await account.createEmailPasswordSession(email, password);  // emailとpasswordを使う
      res.status(200).json(session);  // サインイン成功
    } catch (error) {
      console.error('サインインエラー:', error);
      res.status(500).json({ error: 'サインインに失敗しました' });  // エラー処理
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });  // メソッドが間違っている場合
  }
}