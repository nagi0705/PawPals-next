import { Client, Databases, Query } from 'appwrite';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'メソッドが許可されていません' });
  }

  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: '検索クエリが必要です' });
    }

    // Appwriteクライアントの初期化を修正
    const client = new Client();
    
    // 正しい環境変数名を使用
    const endpoint = process.env.APPWRITE_ENDPOINT;
    const projectId = process.env.APPWRITE_PROJECT_ID;
    
    if (!endpoint || !projectId) {
      throw new Error('必要な環境変数が設定されていません');
    }

    client
      .setEndpoint(endpoint)
      .setProject(projectId);

    const databases = new Databases(client);

    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_POSTS_COLLECTION_ID,
      [
        Query.or([
          Query.search('title', query),
          Query.search('content', query)
        ])
      ]
    );

    return res.status(200).json(response.documents);

  } catch (error) {
    console.error('検索エラー:', error.message);
    return res.status(500).json({ 
      message: '検索中にエラーが発生しました',
      error: error.message 
    });
  }
}