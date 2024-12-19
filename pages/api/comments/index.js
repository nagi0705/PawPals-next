import { Client, Databases, Query } from 'appwrite';

const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteのエンドポイント
    .setProject('675183a100255c6c9a3f'); // AppwriteのプロジェクトID

const databases = new Databases(client);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { postId, content, authorId } = req.body;

        console.log('リクエストデータ:', { postId, content, authorId }); // デバッグ用ログ

        // バリデーション: 必須フィールド確認
        if (!postId || !content || !authorId) {
            console.error('バリデーションエラー: 必須項目が不足しています');
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const response = await databases.createDocument(
              '6751bd2800009a139bb8', // データベースID
              '67568c740018fb94fa2d', // コメントコレクションID
              'unique()', // ドキュメントIDを自動生成
                {
                    id: 'unique()', // 自動生成
                    postId, // リクエストから取得
                    authorId, // リクエストから取得
                    content, // リクエストから取得
                    createdAt: new Date().toISOString(), // 現在時刻を設定
                }
            );
            console.log('コメント作成成功:', response);
            res.status(201).json({ message: 'Comment added successfully', data: response });
        } catch (error) {
            console.error('コメント作成エラー:', error.message);
            res.status(500).json({ message: 'Failed to add comment', error });
        }
    } else if (req.method === 'GET') {
        const { postId } = req.query;

        console.log('コメント取得リクエスト:', { postId }); // デバッグ用ログ

        if (!postId) {
            console.error('バリデーションエラー: Post IDが不足しています');
            return res.status(400).json({ message: 'Post ID is required' });
        }

        try {
            const comments = await databases.listDocuments(
                '6751bd2800009a139bb8', // データベースID
                '67568c740018fb94fa2d', // コメントコレクションID
                [Query.equal('postId', postId)]
            );
            console.log('コメント取得成功:', comments.documents);
            res.status(200).json({ comments: comments.documents });
        } catch (error) {
            console.error('コメント取得エラー:', error.message);
            res.status(500).json({ message: 'Failed to retrieve comments', error });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}