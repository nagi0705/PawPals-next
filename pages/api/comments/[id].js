// pages/api/comments/[id].js
import { Client, Databases } from 'appwrite';

const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteのエンドポイントを直打ち
    .setProject('675183a100255c6c9a3f'); // AppwriteのプロジェクトIDを直打ち

const databases = new Databases(client);

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        // 必要なバリデーション
        if (!id) {
            return res.status(400).json({ message: 'Comment ID is required' });
        }

        try {
            // コメント詳細データを取得
            const comment = await databases.getDocument(
                '6751bd2800009a139bb8', // データベースIDを直打ち
                '67568c740018fb94fa2d', // コメントコレクションIDを直打ち
                id
            );
            res.status(200).json({ data: comment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to retrieve comment', error });
        }
    } else if (req.method === 'DELETE') {
        // 必要なバリデーション
        if (!id) {
            return res.status(400).json({ message: 'Comment ID is required' });
        }

        try {
            // コメントをデータベースから削除
            await databases.deleteDocument(
                '6751bd2800009a139bb8', // データベースIDを直打ち
                '67568c740018fb94fa2d', // コメントコレクションIDを直打ち
                id
            );
            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete comment', error });
        }
    } else {
        res.setHeader('Allow', ['GET', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}