import { Client, Databases } from 'appwrite';

export default async function handler(req, res) {
  const { id } = req.query; // 投稿のIDを取得

  if (!id) {
    return res.status(400).json({ message: '投稿IDが必要です' });
  }

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteのエンドポイント
    .setProject('675183a100255c6c9a3f'); // プロジェクトID

  const databases = new Databases(client);

  if (req.method === 'GET') {
    try {
      // 投稿データを取得
      const post = await databases.getDocument(
        '6751bd2800009a139bb8', // データベースID
        '6767d981000f6f6e0cfa', // コレクションID
        id // 投稿ID
      );
      return res.status(200).json(post);
    } catch (error) {
      console.error('投稿取得エラー:', error);
      return res.status(404).json({ message: '投稿の取得に失敗しました' });
    }
  } else if (req.method === 'PATCH') {
    const { title, content } = req.body;

    if (!title || typeof title !== 'string' || title.length > 30) {
      return res.status(400).json({ message: 'タイトルは必須で、30文字以内である必要があります。' });
    }

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ message: '内容は必須です。' });
    }

    try {
      const updatedPost = await databases.updateDocument(
        '6751bd2800009a139bb8', // データベースID
        '6767d981000f6f6e0cfa', // コレクションID
        id,
        {
          title: String(title),
          content: String(content),
        }
      );

      return res.status(200).json({ message: '投稿が更新されました', post: updatedPost });
    } catch (error) {
      console.error('投稿更新エラー:', error);
      return res.status(500).json({ message: '投稿の更新に失敗しました' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await databases.deleteDocument(
        '6751bd2800009a139bb8', // データベースID
        '6767d981000f6f6e0cfa', // コレクションID
        id
      );
      return res.status(200).json({ message: '投稿を削除しました' });
    } catch (error) {
      console.error('投稿削除エラー:', error);
      return res.status(500).json({ message: '投稿の削除に失敗しました' });
    }
  } else {
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}