import { Client, Databases } from 'appwrite';

const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteのエンドポイント
    .setProject('675183a100255c6c9a3f'); // AppwriteのプロジェクトID

const databases = new Databases(client);

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        // バリデーション
        if (!id) {
            return res.status(400).json({ message: 'Comment ID is required' });
        }

        try {
            // コメント詳細を取得
            const comment = await databases.getDocument(
                '6751bd2800009a139bb8', // データベースID
                '67568c740018fb94fa2d', // コメントコレクションID
                id
            );
            res.status(200).json({ data: comment });
        } catch (error) {
            console.error('コメント取得エラー:', error);
            res.status(500).json({ message: 'Failed to retrieve comment', error });
        }
    } else if (req.method === 'DELETE') {
        // バリデーション
        if (!id) {
            return res.status(400).json({ message: 'Comment ID is required' });
        }

        try {
            // コメントを削除
            await databases.deleteDocument(
                '6751bd2800009a139bb8', // データベースID
                '67568c740018fb94fa2d', // コメントコレクションID
                id
            );
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('コメント削除エラー:', error);
            res.status(500).json({ message: 'Failed to delete comment', error });
        }
    } else {
        res.setHeader('Allow', ['GET', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}