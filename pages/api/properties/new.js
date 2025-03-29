import { Client, Databases, ID } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    // 認証の確認
    if (!session) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    // POST メソッドの確認
    if (req.method !== 'POST') {
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { housename, location, price, petsAllowed, features } = req.body;

    // 必須フィールドの確認
    if (!housename || !location || price === undefined || !petsAllowed) {
      return res.status(400).json({ message: '必須フィールドが不足しています' });
    }

    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('675183a100255c6c9a3f');

    const databases = new Databases(client);

    // データの整形
    const propertyData = {
      housename: housename.trim(),
      location: location.trim(),
      price: Math.floor(Number(price)),
      petsAllowed: Array.isArray(petsAllowed) ? petsAllowed : petsAllowed.split(',').map(pet => pet.trim()),
      features: features ? (Array.isArray(features) ? features : features.split(',').map(feature => feature.trim())) : [],
      ownerEmail: session.user.email,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };

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
      error: error.message
    });
  }
}