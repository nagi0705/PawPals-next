import { Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT) // Appwriteエンドポイント
  .setProject(process.env.APPWRITE_PROJECT_ID); // プロジェクトID

const databases = new Databases(client);

export default async function handler(req, res) {
  const { id } = req.query; // ペットIDを取得

  if (req.method === 'PATCH') {
    try {
      const { currentUserId } = req.body; // フォローするユーザーのID

      if (!currentUserId) {
        return res.status(400).json({ error: 'ユーザーIDは必須です' });
      }

      // ペット情報を取得
      const pet = await databases.getDocument(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_PETS_COLLECTION_ID,
        id
      );

      if (!pet) {
        return res.status(404).json({ error: 'ペットが見つかりません' });
      }

      // フォロワーリストに現在のユーザーIDがなければ追加
      const updatedFollowers = pet.followers || [];
      if (!updatedFollowers.includes(currentUserId)) {
        updatedFollowers.push(currentUserId);

        // フォロワーリストを更新
        const updatedPet = await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_PETS_COLLECTION_ID,
          id,
          { followers: updatedFollowers }
        );

        return res.status(200).json({ message: 'ペットをフォローしました', data: updatedPet });
      }

      res.status(400).json({ error: '既にフォローしています' });
    } catch (error) {
      console.error('ペットフォローエラー:', error);
      res.status(500).json({ error: 'ペットをフォロー中にエラーが発生しました' });
    }
  } else {
    res.status(405).json({ error: 'メソッドが許可されていません' });
  }
}