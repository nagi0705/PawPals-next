import { Client, Databases } from 'appwrite';

export default async function handler(req, res) {
  // Appwriteクライアントの初期化
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite APIエンドポイント
    .setProject('675183a100255c6c9a3f'); // プロジェクトID

  const databases = new Databases(client);

  // GET メソッドの場合のみ処理を行う
  if (req.method !== 'GET') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // ペットのデータを取得
    const pets = await databases.listDocuments(
      '6751bd2800009a139bb8', // データベースID
      '67679a6600013eb8b9ed'  // ペットコレクションID
    );

    // 成功した場合、ペットデータを返す
    return res.status(200).json(pets.documents);
  } catch (error) {
    console.error('エラー:', error);
    return res.status(500).json({ message: 'ペットデータの取得に失敗しました', error: error.message });
  }
}