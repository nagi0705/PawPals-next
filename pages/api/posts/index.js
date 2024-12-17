import { Client, Databases, ID } from 'appwrite'; // IDを追加
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  // 認証セッションの確認
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  // Appwriteクライアントのセットアップ
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteのエンドポイント
    .setProject('675183a100255c6c9a3f'); // プロジェクトID

  const databases = new Databases(client);
  const databaseId = '6751bd2800009a139bb8'; // データベースID
  const postsCollectionId = '675689f200161a70d144'; // コレクションID

  try {
    switch (req.method) {
      case 'GET': {
        // GETリクエスト: 投稿データ一覧を取得
        const posts = await databases.listDocuments(databaseId, postsCollectionId, []);
        return res.status(200).json(posts.documents);
      }

      case 'POST': {
        const { content } = req.body;

        if (!content) {
          return res.status(400).json({ message: '投稿内容は必須です' });
        }

        // Appwriteの自動生成IDを使用
        const post = await databases.createDocument(
          databaseId,
          postsCollectionId,
          ID.unique(), // Appwriteが自動でID生成
          {
            content,
            userId: session.user.id, // 認証済みユーザーID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        );

        return res.status(201).json(post);
      }

      default: {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
      }
    }
  } catch (error) {
    console.error('Error:', error); // エラーログの詳細を表示
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}