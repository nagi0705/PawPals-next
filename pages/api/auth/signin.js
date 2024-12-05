// pages/api/auth/signin.js
import { compare } from 'bcryptjs'; // パスワードの比較
import { prisma } from '../../../lib/prisma'; // Prismaを使ってDBに接続

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // ここでログを追加
    console.log('Received email:', email);
    console.log('Received password:', password);

    try {
      // ユーザー情報をデータベースから取得
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ error: 'ユーザーが見つかりません' });
      }

      // パスワードの照合
      const isValid = await compare(password, user.password);
      if (!isValid) {
        return res.status(400).json({ error: 'パスワードが違います' });
      }

      // サインイン成功
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'サインインに失敗しました' });
    }
  } else {
    // 他のメソッド（GETなど）が来たときは405を返す
    res.status(405).json({ error: 'Method not allowed' });
  }
}