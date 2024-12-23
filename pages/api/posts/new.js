import { Client, Databases, Storage, ID } from 'appwrite';
import formidable from 'formidable';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

// formidableの設定
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  if (req.method === 'POST') {
    // formidableの設定を修正
    const form = formidable({ 
      multiples: false,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024 // 10MB
    });

    try {
      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      });

      const title = String(fields.title || '').trim();
      const content = String(fields.content || '').trim();
      const imageFile = files.image;

      // バリデーション
      if (!title || title.length > 30) {
        return res.status(400).json({ message: 'タイトルは必須で、30文字以内である必要があります。' });
      }

      if (!content) {
        return res.status(400).json({ message: '本文は必須です。' });
      }

      // Appwriteクライアントの設定
      const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT_ID);

      const databases = new Databases(client);
      const storage = new Storage(client);

      let imageUrl = null;

      // 画像アップロード処理を修正
      if (imageFile) {
        try {
          console.log('アップロードされたファイル情報:', {
            imageFile,
            filepath: imageFile[0]?.filepath,  // 配列の最初の要素にアクセス
            mimetype: imageFile[0]?.mimetype,
            originalFilename: imageFile[0]?.originalFilename
          });

          // 配列の最初の要素を使用
          const file = imageFile[0];
          if (!file || !file.filepath) {
            throw new Error('ファイルパスが見つかりません');
          }

          const fs = require('fs').promises;
          const imageData = await fs.readFile(file.filepath);

          const uploadedFile = await storage.createFile(
            '675fd78e002253c189a7',  // BUCKET_ID
            ID.unique(),
            new File([imageData], file.originalFilename, { 
              type: file.mimetype 
            })
          );

          if (uploadedFile.$id) {
            imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/675fd78e002253c189a7/files/${uploadedFile.$id}/view?project=675183a100255c6c9a3f`;
            console.log('画像アップロード成功:', imageUrl);
          }
        } catch (uploadError) {
          console.error('画像アップロードエラーの詳細:', uploadError);
          if (uploadError.stack) {
            console.error('エラースタック:', uploadError.stack);
          }
        }
      }

      // ドキュメントの作成
      const response = await databases.createDocument(
        '6751bd2800009a139bb8',  // DATABASE_ID
        '6767d981000f6f6e0cfa',  // COLLECTION_ID
        'unique()',
        {
          title,
          content,
          ownerEmail: session.user.email,
          image: imageUrl,
          createdAt: new Date().toISOString(),
          likes: 0,
          likedBy: []
        }
      );

      console.log('保存された投稿データ:', response);
      return res.status(200).json({ message: '投稿が作成されました', post: response });

    } catch (error) {
      console.error('投稿作成エラー:', error);
      return res.status(500).json({ message: '投稿の作成に失敗しました' });
    }
  } else {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}