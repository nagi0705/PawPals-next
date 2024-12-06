import { Client, Account, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('675183a100255c6c9a3f');

const account = new Account(client);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body; // name, email, password を取得
    
    console.log('Received name:', name);
    console.log('Received email:', email);
    console.log('Received password:', password);
    console.log('Request body:', req.body);

    // 必須フィールドの確認
    if (!email || !password || !name) { // nameも必須に追加
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    try {
      // AppwriteのcreateUserメソッドを使用してユーザー登録
      const user = await account.create(ID.unique(), email, password, name); // nameを追加
      res.status(201).json(user);  // 成功時
    } catch (error) {
      console.error('サインアップエラー:', error); // エラーの詳細をログに出力
      res.status(400).json({ error: error.message });  // エラー時
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });  // 他のHTTPメソッドは拒否
  }
}