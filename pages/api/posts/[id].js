// pages/api/posts/[id].js
import { Client, Databases } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]'; // 認証用の設定をインポート

export default async function handler(req, res) {
  const { id } = req.query; // URLパラメータから投稿IDを取得
  const session = await getServerSession(req, res, authOptions); // 現在のセッションを取得

  if (!session) {
    return res.status(401).json({ message: 'ログインが必要です' }); // ログインしていない場合
  }

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('675183a100255c6c9a3f');
  const databases = new Databases(client);

  if (req.method === 'GET') {
    try {
      // 特定の投稿を取得
      const response = await databases.getDocument(
        '6767d981000f6f6e0cfa', // コレクションID
        id // 投稿ID
      );

      if (response.ownerEmail !== session.user.email) {
        return res.status(403).json({ message: 'この投稿は編集できません' });
      }

      res.status(200).json(response); // 投稿データを返す
    } catch (error) {
      res.status(500).json({ message: '投稿の取得に失敗しました' });
    }
  }

  if (req.method === 'PUT') {
    const { title, content, image } = req.body;

    try {
      // まず投稿を取得して、オーナーが現在のユーザーかどうかを確認
      const response = await databases.getDocument(
        '6767d981000f6f6e0cfa', // コレクションID
        id // 投稿ID
      );

      if (response.ownerEmail !== session.user.email) {
        return res.status(403).json({ message: 'この投稿は編集できません' });
      }

      // 投稿を更新
      const updatedResponse = await databases.updateDocument(
        '6767d981000f6f6e0cfa', // コレクションID
        id, // 投稿ID
        {
          title,
          content,
          image: image || null, // 画像がない場合もあるため、nullを許容
        }
      );

      res.status(200).json(updatedResponse); // 更新した投稿データを返す
    } catch (error) {
      res.status(500).json({ message: '投稿の更新に失敗しました' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      // まず投稿を取得して、オーナーが現在のユーザーかどうかを確認
      const response = await databases.getDocument(
        '6767d981000f6f6e0cfa', // コレクションID
        id // 投稿ID
      );

      if (response.ownerEmail !== session.user.email) {
        return res.status(403).json({ message: 'この投稿は削除できません' });
      }

      // 投稿を削除
      await databases.deleteDocument('6767d981000f6f6e0cfa', id); // 投稿IDで削除

      res.status(200).json({ message: '投稿が削除されました' });
    } catch (error) {
      res.status(500).json({ message: '投稿の削除に失敗しました' });
    }
  }

  // 他のHTTPメソッドは許可しない
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}