// pages/api/comments/index.js
import { Client, Databases } from 'appwrite';

const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteのエンドポイントを直打ち
    .setProject('675183a100255c6c9a3f'); // AppwriteのプロジェクトIDを直打ち

const databases = new Databases(client);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { postId, content, userId } = req.body;

        // 必要なバリデーション
        if (!postId || !content || !userId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            // コメントをデータベースに追加
            const response = await databases.createDocument(
                '6751bd2800009a139bb8', // データベースIDを直打ち
                '67568c740018fb94fa2d', // コメントコレクションIDを直打ち
                'unique()', // ドキュメントIDを自動生成
                {
                    postId,
                    content,
                    userId,
                    createdAt: new Date().toISOString(),
                }
            );
            res.status(201).json({ message: 'Comment added successfully', data: response });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to add comment', error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}