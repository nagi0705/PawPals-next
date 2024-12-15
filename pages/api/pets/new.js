import { Client, Databases, ID } from 'appwrite';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Appwrite クライアントの設定
    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('675183a100255c6c9a3f');

    const databases = new Databases(client);
    const { name, species, breed, age, userId } = req.body;

    if (!name || !species || !breed || !age || !userId) {
      return res.status(400).json({ message: "必須項目が不足しています" });
    }

    const documentId = ID.unique();
    const response = await databases.createDocument(
      '6751bd2800009a139bb8',  // 正しいデータベースID
      '675688340037914f3d5a',  // コレクションID
      documentId,
      {
        id: documentId,
        name,
        species,
        breed,
        age: parseInt(age),
        userId,
        createdAt: new Date().toISOString()
      }
    );

    return res.status(201).json(response);
  } catch (error) {
    console.error('Error details:', error);
    return res.status(500).json({ 
      message: 'ペットの登録に失敗しました',
      error: error.message
    });
  }
}