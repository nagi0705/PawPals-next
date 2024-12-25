import { Client, Databases, ID } from "appwrite";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "認証が必要です" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  const databases = new Databases(client);

  try {
    const { name, description, members } = req.body;

    if (!name) {
      return res.status(400).json({ message: "グループ名は必須です" });
    }

    // 作成者を含めたメンバーリストを作成（カンマ区切りの文字列）
    const memberEmails = [session.user.email, ...(members || [])].join(",");

    // メンバーリストの長さチェック（100文字上限）
    if (memberEmails.length > 100) {
      return res.status(400).json({ message: "メンバーリストが長すぎます。" });
    }

    // グループの作成
    const newGroup = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID, // Database ID
      process.env.APPWRITE_GROUPS_COLLECTION_ID, // Groups Collection ID
      ID.unique(),
      {
        name, // グループ名
        description: description || "", // 説明
        ownerEmail: session.user.email, // グループ作成者
        memberEmails, // メンバーリスト
        createdAt: new Date().toISOString(), // 作成日時
        userEmail: session.user.email, // 必須フィールド
      }
    );

    return res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({
      message: "グループの作成に失敗しました",
      error: error.message,
    });
  }
}