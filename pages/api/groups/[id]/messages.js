import { Client, Databases, Query, ID } from "appwrite";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("675183a100255c6c9a3f");

const databases = new Databases(client);

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "認証が必要です" });
  }

  const { id } = req.query; // グループID
  const userEmail = session.user.email;

  try {
    // グループメンバーであるかを確認
    const group = await databases.getDocument(
      "6751bd2800009a139bb8", // Database ID
      "676a4f28000b6cb814d6", // Groups Collection ID
      id
    );

    const memberEmails = group.memberEmails ? group.memberEmails.split(",") : [];
    if (!memberEmails.includes(userEmail)) {
      return res.status(403).json({ message: "グループメンバーのみがアクセスできます。" });
    }

    if (req.method === "GET") {
      // メッセージ一覧の取得
      const messages = await databases.listDocuments(
        "6751bd2800009a139bb8",
        "676a4f6d000e914d3cdc",
        [Query.equal("groupId", id)]
      );

      if (messages.documents.length === 0) {
        return res.status(200).json([]); // メッセージがない場合、空の配列を返す
      }

      const userEmails = messages.documents.map((msg) => msg.senderEmail);
      if (userEmails.length === 0) {
        return res.status(200).json(messages.documents); // ユーザー情報が空の場合、そのまま返す
      }

      const users = await databases.listDocuments(
        "6751bd2800009a139bb8",
        "6751bf630013fb0750e9",
        [Query.equal("email", userEmails)]
      );

      const messagesWithNames = messages.documents.map((msg) => {
        const user = users.documents.find((u) => u.email === msg.senderEmail);
        return {
          ...msg,
          senderName: user ? user.name : msg.senderEmail,
        };
      });

      return res.status(200).json(messagesWithNames);
    }

    if (req.method === "POST") {
      const { content } = req.body;

      if (!content || content.trim() === "") {
        return res.status(400).json({ message: "メッセージ内容を入力してください。" });
      }

      try {
        // メッセージの作成
        const newMessage = await databases.createDocument(
          "6751bd2800009a139bb8", // Database ID
          "676a4f6d000e914d3cdc", // Messages Collection ID
          ID.unique(), // 自動生成のID
          {
            groupId: id,
            senderEmail: userEmail, // 必須フィールド: メッセージ送信者のメールアドレス
            userEmail, // 必須フィールド: メッセージ送信者のメールアドレス
            content,
            createdAt: new Date().toISOString(),
          }
        );

        return res.status(201).json(newMessage);
      } catch (error) {
        console.error("Error creating message:", error);
        return res.status(500).json({ message: "メッセージの作成に失敗しました。" });
      }
    }

    if (req.method === "PATCH") {
      const { messageId, content } = req.body;

      if (!content || content.trim() === "") {
        return res.status(400).json({ message: "編集内容を入力してください。" });
      }

      // 編集対象のメッセージを取得
      const message = await databases.getDocument(
        "6751bd2800009a139bb8",
        "676a4f6d000e914d3cdc",
        messageId
      );

      // 自分が送信したメッセージであることを確認
      if (message.senderEmail !== userEmail) {
        return res.status(403).json({ message: "このメッセージを編集する権限がありません。" });
      }

      // メッセージの更新
      const updatedMessage = await databases.updateDocument(
        "6751bd2800009a139bb8",
        "676a4f6d000e914d3cdc",
        messageId,
        { content }
      );

      return res.status(200).json(updatedMessage);
    }

    if (req.method === "DELETE") {
      const { messageId } = req.body;

      const message = await databases.getDocument(
        "6751bd2800009a139bb8",
        "676a4f6d000e914d3cdc",
        messageId
      );

      // 自分が送信したメッセージであることを確認
      if (message.senderEmail !== userEmail) {
        return res.status(403).json({ message: "このメッセージを削除する権限がありません。" });
      }

      await databases.deleteDocument(
        "6751bd2800009a139bb8",
        "676a4f6d000e914d3cdc",
        messageId
      );

      return res.status(200).json({ message: "メッセージを削除しました。" });
    }

    res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error("Error handling messages:", error);
    return res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
}