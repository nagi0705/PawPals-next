import { Client, Databases } from 'appwrite';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')  // Appwriteのエンドポイント
      .setProject('675183a100255c6c9a3f');  // プロジェクトID

    const databases = new Databases(client);

    try {
      // 全ての投稿を取得
      const response = await databases.listDocuments(
        '6751bd2800009a139bb8',  // データベースID
        '6767d981000f6f6e0cfa'   // コレクションID
      );
      res.status(200).json(response.documents);  // 取得した投稿を返す
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '投稿データの取得に失敗しました' });
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}