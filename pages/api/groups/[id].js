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

  if (req.method === "GET") {
    try {
      const group = await databases.getDocument(
        "6751bd2800009a139bb8",
        "676a4f28000b6cb814d6",
        id
      );

      const memberEmails = group.memberEmails
        ? group.memberEmails.split(",")
        : [];

      const users = await databases.listDocuments(
        "6751bd2800009a139bb8",
        "6751bf630013fb0750e9",
        [Query.equal("email", memberEmails)]
      );

      const membersWithNames = memberEmails.map((email) => {
        const user = users.documents.find((u) => u.email === email);
        return {
          email,
          name: user ? user.name : email,
        };
      });

      return res.status(200).json({
        ...group,
        members: membersWithNames,
      });
    } catch (error) {
      console.error("Error fetching group:", error);
      return res.status(500).json({
        message: "グループ情報の取得に失敗しました",
        error: error.message,
      });
    }
  } else if (req.method === "DELETE") {
    try {
      const group = await databases.getDocument(
        "6751bd2800009a139bb8",
        "676a4f28000b6cb814d6",
        id
      );

      if (!group.memberEmails.split(",").includes(session.user.email)) {
        return res.status(403).json({
          message: "グループの削除権限がありません。",
        });
      }

      await databases.deleteDocument(
        "6751bd2800009a139bb8",
        "676a4f28000b6cb814d6",
        id
      );

      return res.status(200).json({ message: "グループを削除しました" });
    } catch (error) {
      console.error("Error deleting group:", error);
      return res.status(500).json({
        message: "グループの削除に失敗しました",
        error: error.message,
      });
    }
  } else {
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }
}