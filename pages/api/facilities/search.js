// /pages/api/facilities/search.js
import { Client, Databases, Query } from 'appwrite';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'GETメソッドのみ許可されています' });
  }

  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: '検索クエリが必要です' });
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);
  const databases = new Databases(client);

  try {
    const result = await databases.listDocuments(
      '6751bd2800009a139bb8',
      '67e8e07100164c327c35',
      [
        Query.or([
          Query.search('name', query),
          Query.search('location', query),
          Query.search('type', query),
          Query.search('petsAllowed', query),
          Query.search('features', query)
        ])
      ]
    );

    return res.status(200).json(result.documents);
  } catch (error) {
    console.error('施設検索エラー:', error);
    return res.status(500).json({
      message: '施設の検索に失敗しました',
      error: error.message,
    });
  }
}