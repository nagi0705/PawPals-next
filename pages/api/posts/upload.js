import { Client, Storage, ID, Databases } from 'node-appwrite';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'メソッドが許可されていません' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
      return res.status(401).json({ message: '認証が必要です' });
  }
  const userId = session.user.id;

  try {
    console.log('リクエスト受信');

    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024 // 10MB
    });

    // ファイルとフィールドのパース
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Formidableパースエラー:', err);
          reject(err);
        }
        console.log('パース結果 - fields:', fields);
        console.log('パース結果 - files:', files);
        resolve([fields, files]);
      });
    });

    // petIdの確認
    console.log('petId:', fields.petId);

    // petIdを配列から取得
    const petId = fields.petId[0]; // 最初の要素を取得

    // ファイルの存在確認
    if (!files || !files.file) {
      console.error('ファイルが見つかりません');
      return res.status(400).json({ message: 'ファイルが見つかりません' });
    }

    const file = files.file[0];
    console.log('処理するファイル:', file);

    // Appwriteクライアントの設定
    const client = new Client();
    const databases = new Databases(client);
    
    try {
      client
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('675183a100255c6c9a3f')
        .setKey('standard_a140d7d79991c5dca6069a16a33865c1b12492dcf47503408cd0f1880d0c3e51d9cc8719bbc170350604d23f26edf68f836a82d48ae8482b86b1ad86db0f366ef9419d7f24f4ce3e743caf2fa9502c035d7c312849c241ce8fd453b92a1d5990409ba345049de90b6c7468f0842040a23ccd320446a8e314d3d7e24ea40f1ac3');
    } catch (error) {
      console.error('Appwriteクライアント設定エラー:', error);
      throw error;
    }

    const storage = new Storage(client);

    // ファイルの読み込み
    console.log('ファイルパス:', file.filepath);
    const fileBuffer = fs.readFileSync(file.filepath);

    // Appwriteにファイルをアップロード
    console.log('Appwriteにアップロード開始');
    
    const response = await storage.createFile(
    '675fd78e002253c189a7',
    ID.unique(),
    new File([fileBuffer], file.originalFilename, { type: file.mimetype })  // Fileオブジェクトを作成
    );
    console.log('Appwriteアップロード成功:', response);

    // 一時ファイルの削除
    fs.unlinkSync(file.filepath);

    // ドキュメントを作成する際にidフィールドを追加
    const postData = {
      id: ID.unique(), // 必須フィールド
      userId: userId, // 追加: ログインユーザーのID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      petId: petId, // 修正: 取得したpetIdを使用
      imageUrl: `https://cloud.appwrite.io/v1/storage/buckets/675fd78e002253c189a7/files/${response.$id}/view`,
      content: fields.content[0] || '', // フォームから取得したcontentフィールドを追加
    };

    // postDataの内容をログに出力
    console.log('ポストデータ:', postData);

    // データベースにドキュメントを作成
    await databases.createDocument(
      '6751bd2800009a139bb8',
      '675689f200161a70d144',
      postData.id,  // ドキュメントID
      postData      // ドキュメントデータ
    );

    return res.status(200).json({
      fileId: response.$id,
      fileUrl: `https://cloud.appwrite.io/v1/storage/buckets/675fd78e002253c189a7/files/${response.$id}/view`,
      documentId: postData.id, // ドキュメントIDをレスポンスに追加
    });

  } catch (error) {
    console.error('サーバーエラー詳細:', error);
    return res.status(500).json({ 
      message: 'ファイルのアップロードに失敗しました',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}