import { Client, Databases, ID } from "appwrite";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: '認証が必要です' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('675183a100255c6c9a3f');

  const databases = new Databases(client);

  try {
    const { name, description, members } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'グループ名は必須です' });
    }

    // グループの作成
    const newGroup = await databases.createDocument(
      '6751bd2800009a139bb8',  // Database ID
      '676a4f28000b6cb814d6',  // Groups Collection ID
      ID.unique(),
      {
        name,
        description: description || '',
        memberEmails: '',
        ownerEmail: session.user.email,
        userEmail: session.user.email,
        createdAt: new Date().toISOString()
      }
    );

    // メンバー情報を別コレクションに保存
    if (members && members.length > 0) {
      try {
        for (const memberEmail of members) {
          await databases.createDocument(
            '6751bd2800009a139bb8',  // Database ID
            '676a4f6d000e914d3cdc',  // Group Members Collection ID
            ID.unique(),
            {
              groupId: newGroup.$id,
              userEmail: memberEmail,
              senderEmail: session.user.email,
              content: '参加しました',
              createdAt: new Date().toISOString()  // createdAtを追加
            }
          );
        }
      } catch (memberError) {
        console.error("Error adding members:", memberError);
        // グループは作成されているので、エラーは無視して続行
      }
    }

    return res.status(201).json({
      ...newGroup,
      members: members || []
    });

  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({ 
      message: 'グループの作成に失敗しました',
      error: error.message 
    });
  }
}