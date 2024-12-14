import { Client, Databases, Query } from 'appwrite';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // セッションを取得してユーザー認証を確認
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "認証が必要です" });
  }

  const { id } = req.query;
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  const databases = new Databases(client);

  try {
    // ペット情報を取得
    const pet = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_PETS_COLLECTION_ID,
      id
    );

    // GET リクエスト（特定のペットの取得）
    if (req.method === 'GET') {
      return res.status(200).json(pet);
    }

    // PATCH/PUT リクエスト（ペット情報の更新）
    if (req.method === 'PATCH' || req.method === 'PUT') {
      // 自分のペットかチェック
      if (pet.userId !== session.user.id) {
        return res.status(403).json({ message: "他のユーザーのペットは編集できません" });
      }

      const { name, species, breed, age } = req.body;

      // 必須フィールドの検証
      if (!name || !species || !breed || !age) {
        return res.status(400).json({ message: "必須項目が不足しています" });
      }

      const response = await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_PETS_COLLECTION_ID,
        id,
        {
          name,
          species,
          breed,
          age: parseInt(age)
        }
      );
      return res.status(200).json(response);
    }

    // DELETE リクエスト（ペットの削除）
    if (req.method === 'DELETE') {
      // 自分のペットかチェック
      if (pet.userId !== session.user.id) {
        return res.status(403).json({ message: "他のユーザーのペットは削除できません" });
      }

      await databases.deleteDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_PETS_COLLECTION_ID,
        id
      );
      return res.status(200).json({ message: "削除しました" });
    }

    // POST リクエスト（フォロー/アンフォロー）
    if (req.method === 'POST' && req.body.action === 'follow') {
      // 自分のペットはフォローできない
      if (pet.userId === session.user.id) {
        return res.status(400).json({ message: "自分のペットはフォローできません" });
      }

      // すでにフォローしているか確認
      const existingFollow = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_FOLLOWERS_COLLECTION_ID,
        [
          Query.equal('userId', session.user.id),
          Query.equal('petId', id)
        ]
      );

      if (existingFollow.total > 0) {
        // フォロー解除
        await databases.deleteDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_FOLLOWERS_COLLECTION_ID,
          existingFollow.documents[0].$id
        );
        return res.status(200).json({ message: "フォロー解除しました" });
      } else {
        // フォロー
        const response = await databases.createDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_FOLLOWERS_COLLECTION_ID,
          'unique()',
          {
            userId: session.user.id,
            petId: id,
            createdAt: new Date().toISOString()
          }
        );
        return res.status(201).json(response);
      }
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    if (error.code === 404) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}