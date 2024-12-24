import { Client, Databases } from "appwrite";

const client = new Client();
const databases = new Databases(client);

// Appwrite設定（環境変数を直接記述）
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Appwriteのエンドポイント
  .setProject("675183a100255c6c9a3f") // プロジェクトID
  .setKey("standard_a140d7d79991c5dca6069a16a33865c1b12492dcf47503408cd0f1880d0c3e51d9cc8719bbc170350604d23f26edf68f836a82d48ae8482b86b1ad86db0f366ef9419d7f24f4ce3e743caf2fa9502c035d7c312849c241ce8fd453b92a1d5990409ba345049de90b6c7468f0842040a23ccd320446a8e314d3d7e24ea40f1ac3"); // APIキー

export default async function handler(req, res) {
  const { id, messageId } = req.query; // グループIDとメッセージIDを取得

  if (req.method === "PATCH") {
    const { content } = req.body; // 更新するメッセージ内容
    const currentUserEmail = req.headers["x-user-email"]; // ユーザーのメールアドレスをヘッダーから取得

    try {
      // 編集対象のメッセージを取得
      const message = await databases.getDocument(
        "6751bd2800009a139bb8", // データベースID
        "676a4f6d000e914d3cdc", // MessagesコレクションID
        messageId
      );

      // メッセージの送信者か確認
      if (message.senderEmail !== currentUserEmail) {
        return res.status(403).json({ error: "Access denied: You can only edit your own messages" });
      }

      // メッセージを更新
      const updatedMessage = await databases.updateDocument(
        "6751bd2800009a139bb8", // データベースID
        "676a4f6d000e914d3cdc", // MessagesコレクションID
        messageId,
        {
          ...(content && { content }), // 更新する内容を適用
          updatedAt: new Date().toISOString(), // 更新日時を記録
        }
      );

      res.status(200).json(updatedMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "DELETE") {
    const currentUserEmail = req.headers["x-user-email"]; // ユーザーのメールアドレスをヘッダーから取得

    try {
      // 削除対象のメッセージを取得
      const message = await databases.getDocument(
        "6751bd2800009a139bb8", // データベースID
        "676a4f6d000e914d3cdc", // MessagesコレクションID
        messageId
      );

      // メッセージの送信者か確認
      if (message.senderEmail !== currentUserEmail) {
        return res.status(403).json({ error: "Access denied: You can only delete your own messages" });
      }

      // メッセージを削除
      await databases.deleteDocument(
        "6751bd2800009a139bb8", // データベースID
        "676a4f6d000e914d3cdc", // MessagesコレクションID
        messageId
      );

      res.status(204).end(); // 成功時には204 No Contentを返す
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["PATCH", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}