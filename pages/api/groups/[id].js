import { Client, Databases, Query } from "appwrite";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("675183a100255c6c9a3f");

const databases = new Databases(client);

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "認証が必要です" });
  }

  const { id } = req.query;

  // GETとDELETEメソッドの処理
  if (req.method === 'GET') {
    try {
      // グループ情報の取得
      const group = await databases.getDocument(
        '6751bd2800009a139bb8',
        '676a4f28000b6cb814d6',
        id
      );

      // メンバー情報の取得
      const groupMembers = await databases.listDocuments(
        '6751bd2800009a139bb8',
        '676a4f6d000e914d3cdc',
        [Query.equal('groupId', id)]
      );

      // ユーザー情報の取得
      const users = await databases.listDocuments(
        '6751bd2800009a139bb8',
        '6751bf630013fb0750e9',
        [Query.equal('email', groupMembers.documents.map(m => m.userEmail))]
      );

      // メンバー情報とユーザー名を結合
      const membersWithNames = groupMembers.documents.map(member => {
        const user = users.documents.find(u => u.email === member.userEmail);
        return {
          ...member,
          name: user ? user.name : member.userEmail
        };
      });

      return res.status(200).json({
        ...group,
        members: membersWithNames
      });

    } catch (error) {
      console.error('Error fetching group:', error);
      return res.status(500).json({ 
        message: 'グループ情報の取得に失敗しました',
        error: error.message 
      });
    }
  } 
  else if (req.method === 'DELETE') {
    try {
      // まずグループメンバーを取得（Group Membersコレクションから）
      const groupMembers = await databases.listDocuments(
        '6751bd2800009a139bb8',  // Database ID
        '676a4f6d000e914d3cdc',  // Group Members Collection ID
        [
          Query.equal('groupId', id),
          Query.equal('userEmail', session.user.email)
        ]
      );

      // 現在のユーザーがメンバーかどうかチェック
      if (groupMembers.documents.length === 0) {
        return res.status(403).json({ 
          message: 'グループの削除権限がありません。グループメンバーのみが削除できます。',
          userEmail: session.user.email
        });
      }

      // グループの削除
      await databases.deleteDocument(
        '6751bd2800009a139bb8',
        '676a4f28000b6cb814d6',
        id
      );

      // 関連する全メンバー情報を取得して削除
      const allGroupMembers = await databases.listDocuments(
        '6751bd2800009a139bb8',
        '676a4f6d000e914d3cdc',
        [Query.equal('groupId', id)]
      );

      await Promise.all(
        allGroupMembers.documents.map(member =>
          databases.deleteDocument(
            '6751bd2800009a139bb8',
            '676a4f6d000e914d3cdc',
            member.$id
          )
        )
      );

      return res.status(200).json({ message: 'グループを削除しました' });

    } catch (error) {
      console.error('Error deleting group:', error);
      return res.status(500).json({ 
        message: 'グループの削除に失敗しました',
        error: error.message 
      });
    }
  }
  else {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}