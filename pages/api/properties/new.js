// /pages/api/properties/new.js
import { Client, Databases, ID } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);


    // ログを追加
    console.log('セッション情報:', session);

    // 認証の確認
    if (!session) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    // POSTメソッド以外は拒否
    if (req.method !== 'POST') {
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    // リクエストボディ
    const { housename, location, price, petsAllowed, features } = req.body;

    // 必須フィールドの確認
    if (!housename || !location || price === undefined || !petsAllowed) {
      return res.status(400).json({ message: '必須フィールドが不足しています' });
    }

    // Appwriteクライアントの初期化
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID);

    const databases = new Databases(client);

    // ownerEmail を session から取得（undefined 対策あり）
    const ownerEmail = session?.user?.email;
    if (!ownerEmail) {
      console.error('セッションからメールアドレスが取得できません');
      return res.status(500).json({ message: 'ユーザーのメールアドレスが取得できません' });
    }

    // 登録データの整形
    const propertyData = {
      housename: housename.trim(),
      location: location.trim(),
      price: Math.floor(Number(price)),
      petsAllowed: Array.isArray(petsAllowed)
        ? petsAllowed
        : petsAllowed.split(',').map((pet) => pet.trim()),
      features: features
        ? Array.isArray(features)
          ? features
          : features.split(',').map((f) => f.trim())
        : [],
      ownerEmail: ownerEmail,
      createdAt: new Date().toISOString(),
      
    };

    // Document作成
    const newProperty = await databases.createDocument(
      '6751bd2800009a139bb8',
      '67e6439800093f765fd9',
      ID.unique(),
      propertyData
    );

    return res.status(201).json(newProperty);
  } catch (error) {
    console.error('物件登録中のエラー:', error);
    return res.status(500).json({
      message: '物件登録に失敗しました',
      error: error.message,
    });
  }
}