import { Client, Databases, Query } from 'appwrite';

export default async function handler(req, res) {
  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteエンドポイント
    .setProject('675183a100255c6c9a3f'); // プロジェクトID

  const databases = new Databases(client);

  if (req.method === 'POST') {
    const { postId, content, ownerEmail } = req.body;

    // 入力データのバリデーション
    if (!postId || !content || !ownerEmail) {
      return res.status(400).json({ message: '必要なデータが不足しています' });
    }

    try {
      // コメントの作成
      const comment = await databases.createDocument(
        '6751bd2800009a139bb8', // データベースID
        '676a2d8800069374a74a', // コレクションID（CommentsのID）
        'unique()', // ドキュメントIDを自動生成
        {
          postId,
          content,
          ownerEmail,
          createdAt: new Date().toISOString(),
          likes: 0,
          likedBy: [],
        }
      );

      res.status(201).json({ message: 'コメントが作成されました', comment });
    } catch (error) {
      console.error('コメント作成エラー:', error);
      res.status(500).json({ message: 'コメントの作成に失敗しました' });
    }
  } else if (req.method === 'GET') {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ message: '投稿IDが必要です' });
    }

    try {
      // 投稿に紐づくコメントを取得
      const response = await databases.listDocuments(
        '6751bd2800009a139bb8', // データベースID
        '676a2d8800069374a74a', // コレクションID (commentsのID)
        [
          // フィルタ: postId が一致するドキュメント
          Query.equal('postId', postId)
        ]
      );

      return res.status(200).json(response.documents);
    } catch (error) {
      console.error('コメント取得エラー:', error);
      return res.status(500).json({ message: 'コメントの取得に失敗しました' });
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}