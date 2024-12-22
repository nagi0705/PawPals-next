// pages/api/posts/search.js
import { Client, Databases } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  // セッション情報を取得
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { q } = req.query; // 検索クエリを取得

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteのエンドポイント
    .setProject('675183a100255c6c9a3f'); // プロジェクトID
  const databases = new Databases(client);

  try {
    // 投稿を検索（タイトルと内容を検索）
    const response = await databases.listDocuments(
      '6751bd2800009a139bb8', // データベースID
      '6767d981000f6f6e0cfa', // コレクションID
      [ // 検索クエリのオプション
        { key: 'title_fulltext', value: q },
        { key: 'content_fulltext', value: q }
      ]
    );

    return res.status(200).json(response.documents);
  } catch (err) {
    console.error('エラー:', err);
    return res.status(500).json({ message: '投稿の検索に失敗しました', error: err.message });
  }
}