import { Client, Databases, Query } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  // 認証の確認
  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  // メソッドの制限
  if (req.method !== 'GET') {
    return res.status(405).json({ message: `Method ${req.method} は許可されていません` });
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  const databases = new Databases(client);

  try {
    const { query, minAge, maxAge, age, species, breed } = req.query; // クエリパラメータで取得

    // 検索条件の初期化
    const searchConditions = [];

    // 名前の部分一致検索
    if (query && query.trim() !== '') {
      searchConditions.push(Query.search('name', query.trim()));
    }

    // 特定の年齢での検索
    if (age) {
      searchConditions.push(Query.equal('age', parseInt(age, 10)));
    }

    // 年齢の範囲検索
    if (minAge) {
      searchConditions.push(Query.greaterEqual('age', parseInt(minAge, 10)));
    }
    if (maxAge) {
      searchConditions.push(Query.lessEqual('age', parseInt(maxAge, 10)));
    }

    // 種類の正確な一致検索
    if (species && species.trim() !== '') {
      searchConditions.push(Query.equal('species', species.trim()));
    }

    // 品種の正確な一致検索
    if (breed && breed.trim() !== '') {
      searchConditions.push(Query.equal('breed', breed.trim()));
    }

    // 検索条件が空の場合
    if (searchConditions.length === 0) {
      return res.status(400).json({ message: '少なくとも1つの検索条件が必要です' });
    }

    // Appwriteの検索機能を使用
    const pets = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_PETS_COLLECTION_ID,
      searchConditions
    );

    // 検索結果が空の場合
    if (pets.documents.length === 0) {
      return res.status(404).json({ message: '該当するペットが見つかりませんでした' });
    }

    // 検索結果を返す
    return res.status(200).json(pets.documents);
  } catch (error) {
    console.error('ペット検索中のエラー:', error);
    return res.status(500).json({
      message: 'ペット検索に失敗しました',
      error: error.message || '予期しないエラーが発生しました',
    });
  }
}