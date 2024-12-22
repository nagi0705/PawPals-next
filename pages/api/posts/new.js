import { Client, Databases } from 'appwrite';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, content, image } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'タイトルと本文は必須です' });
    }

    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')  // Appwriteのエンドポイント
      .setProject('675183a100255c6c9a3f');  // プロジェクトID

    const databases = new Databases(client);

    try {
      const userSession = req.headers.authorization; // セッションからユーザー情報を取得

      // 新しい投稿を作成
      const response = await databases.createDocument(
        '6751bd2800009a139bb8',  // データベースID
        '6767d981000f6f6e0cfa',   // コレクションID
        'unique()',  // ユニークなID
        {
          title,
          content,
          ownerEmail: userSession, // ログイン中のユーザーのメールアドレスを保存
          image: image || '',  // 画像（任意）
          createdAt: new Date().toISOString(),  // 作成日時
        }
      );

      res.status(200).json({ message: '投稿が作成されました', post: response });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '投稿の作成に失敗しました' });
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}