import { Client, Databases } from "appwrite";

const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Appwriteのエンドポイント
  .setProject("675183a100255c6c9a3f"); // プロジェクトID

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // グループ一覧を取得
      const groups = await databases.listDocuments(
        "6751bd2800009a139bb8", // データベースID
        "676a4f28000b6cb814d6" // GroupsコレクションID
      );

      if (!groups.documents || groups.documents.length === 0) {
        // グループが空の場合のレスポンス
        return res.status(200).json({ message: "No groups available." });
      }

      res.status(200).json(groups); // グループ一覧を返す
    } catch (error) {
      console.error("Error fetching groups:", error.message);
      res.status(500).json({ error: "Failed to fetch groups." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}