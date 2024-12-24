import { Client, Databases, Query } from "appwrite";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("675183a100255c6c9a3f");

const databases = new Databases(client);

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "認証が必要です" });
  }

  const { id } = req.query;
  const { name, description } = req.body;

  try {
    // メンバーシップの確認
    const groupMembers = await databases.listDocuments(
      '6751bd2800009a139bb8',  // Database ID
      '676a4f6d000e914d3cdc',  // Group Members Collection ID
      [
        Query.equal('groupId', id),
        Query.equal('userEmail', session.user.email)
      ]
    );

    if (groupMembers.documents.length === 0) {
      return res.status(403).json({ 
        message: 'グループの編集権限がありません。グループメンバーのみが編集できます。'
      });
    }

    // グループの更新
    const updatedGroup = await databases.updateDocument(
      '6751bd2800009a139bb8',  // Database ID
      '676a4f28000b6cb814d6',  // Groups Collection ID
      id,
      {
        name,
        description
      }
    );

    return res.status(200).json(updatedGroup);
  } catch (error) {
    console.error('Error updating group:', error);
    return res.status(500).json({ 
      message: 'グループの更新に失敗しました',
      error: error.message 
    });
  }
}