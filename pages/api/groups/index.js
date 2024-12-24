import { Client, Databases } from "appwrite";

const client = new Client();
const databases = new Databases(client);

// Appwrite設定（環境変数を直接記述）
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Appwriteのエンドポイント
  .setProject("675183a100255c6c9a3f") // プロジェクトID
  .setKey("standard_a140d7d79991c5dca6069a16a33865c1b12492dcf47503408cd0f1880d0c3e51d9cc8719bbc170350604d23f26edf68f836a82d48ae8482b86b1ad86db0f366ef9419d7f24f4ce3e743caf2fa9502c035d7c312849c241ce8fd453b92a1d5990409ba345049de90b6c7468f0842040a23ccd320446a8e314d3d7e24ea40f1ac3"); // APIキー

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const groups = await databases.listDocuments(
        "6751bd2800009a139bb8", // データベースID
        "676a4f28000b6cb814d6"  // Groups コレクションID
      );
      res.status(200).json(groups);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "POST") {
    const { name, description, ownerEmail, memberEmails } = req.body;

    try {
      const newGroup = await databases.createDocument(
        "6751bd2800009a139bb8", // データベースID
        "676a4f28000b6cb814d6", // GroupsコレクションID
        "unique()", // 自動生成されたID
        {
          name,
          description,
          ownerEmail,
          memberEmails,
          createdAt: new Date().toISOString(),
        }
      );
      res.status(201).json(newGroup);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}