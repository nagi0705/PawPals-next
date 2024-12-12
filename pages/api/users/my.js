import { Client, Databases, Account, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT) // Appwriteエンドポイント
  .setProject(process.env.APPWRITE_PROJECT_ID); // プロジェクトID

const databases = new Databases(client);
const account = new Account(client);

export default async function handler(req, res) {
  try {
    // 認証されているユーザーを取得
    const jwt = req.headers.authorization?.split(' ')[1]; // JWTを取得
    if (!jwt) {
      return res.status(401).json({ error: '認証トークンが見つかりません' });
    }

    client.setJWT(jwt);

    const user = await account.get(); // 現在のユーザー情報を取得
    if (!user) {
      return res.status(401).json({ error: 'ログインが必要です' });
    }

    if (req.method === 'GET') {
      // 自分のプロフィールを取得
      const result = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID, // データベースID
        process.env.APPWRITE_USER_COLLECTION_ID, // コレクションID
        [Query.equal('userId', user.$id)] // 自分のドキュメントを取得
      );

      if (result.documents.length === 0) {
        return res.status(404).json({ error: 'プロフィールが見つかりません' });
      }

      res.status(200).json(result.documents[0]); // 自分のプロフィールを返す
    } else if (req.method === 'PATCH') {
      // プロフィールを編集
      const { name, email } = req.body;
      if (!name && !email) {
        return res.status(400).json({ error: '編集内容を指定してください' });
      }

      const documentId = (await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_USER_COLLECTION_ID,
        [Query.equal('userId', user.$id)]
      )).documents[0].$id;

      const result = await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_USER_COLLECTION_ID,
        documentId, // ドキュメントIDとして取得したIDを使用
        { ...(name && { name }), ...(email && { email }) } // 更新内容を指定
      );

      res.status(200).json({ message: 'プロフィールを更新しました', profile: result });
    } else if (req.method === 'DELETE') {
      // Usersコレクションから削除
      const documentId = (await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_USER_COLLECTION_ID,
        [Query.equal('userId', user.$id)]
      )).documents[0].$id;

      await databases.deleteDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_USER_COLLECTION_ID,
        documentId // ドキュメントIDとして取得したIDを使用
      );

      // ユーザーアカウント削除
      await account.delete();

      // 削除成功後にリダイレクト先を返す
      res.status(200).json({
        message: 'アカウントが正常に削除されました',
        redirectTo: '/', // フロントエンドでリダイレクトさせるためのURL
      });
    } else {
      res.status(405).json({ error: 'メソッドが許可されていません' });
    }
  } catch (error) {
    console.error('エラー:', error);
    res.status(500).json({ error: '処理中にエラーが発生しました' });
  }
}