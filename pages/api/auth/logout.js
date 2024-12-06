// pages/api/auth/logout.js
import { Client, Account } from 'appwrite';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new Client();
    client.setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID);

    const account = new Account(client);

    try {
      // AppwriteのdeleteSessionメソッドを使用してログアウト
      await account.deleteSession('current'); // 'current'は現在のセッションを指します
      res.status(200).json({ message: 'ログアウトしました' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });  // 他のHTTPメソッドは拒否
  }
}