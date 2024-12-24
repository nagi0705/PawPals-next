import { Client, Databases } from "appwrite";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('675183a100255c6c9a3f');

    const databases = new Databases(client);

    // Usersコレクションからデータを取得
    const response = await databases.listDocuments(
      '6751bd2800009a139bb8',  // Database ID
      '6751bf630013fb0750e9'   // Users Collection ID
    );

    // レスポンスを適切にJSON形式で返す
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      users: response.documents.map(user => ({
        $id: user.$id,
        name: user.name || user.email.split('@')[0],
        email: user.email
      }))
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    // エラーレスポンスもJSON形式で返す
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      message: 'ユーザー情報の取得に失敗しました',
      error: error.message 
    });
  }
}