import { Client, Databases } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req, res) {
  const { id } = req.query;

  // セッション情報を取得
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteのエンドポイント
    .setProject('675183a100255c6c9a3f'); // プロジェクトID
  const databases = new Databases(client);

  try {
    // 特定の投稿を取得
    const response = await databases.getDocument(
      '6751bd2800009a139bb8', // データベースID
      '6767d981000f6f6e0cfa', // コレクションID
      id // 投稿ID
    );

    // 現在の「いいね」の数を取得
    const currentLikes = response.likes || 0;

    // 「いいね」を1増やす
    const updatedLikes = currentLikes + 1;

    // 投稿の「いいね」数を更新
    await databases.updateDocument(
      '6751bd2800009a139bb8', // データベースID
      '6767d981000f6f6e0cfa', // コレクションID
      id, // 投稿ID
      { likes: updatedLikes } // 更新するフィールド
    );

    return res.status(200).json({ message: 'いいねをしました', likes: updatedLikes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'いいねの更新に失敗しました', error: err.message });
  }
}