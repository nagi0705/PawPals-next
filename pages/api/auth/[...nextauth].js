import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          const user = await res.json();

          if (res.ok && user) {
            // Appwriteのセッション情報からユーザー情報を返す
            return {
              id: user.$id,
              email: credentials.email,
              // 必要に応じて他のユーザー情報を追加
            };
          }
          return null;
        } catch (error) {
          console.error('認証エラー:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId;
      }
      return session;
    },
    async signOut() {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
        });
        return true;
      } catch (error) {
        console.error('ログアウトエラー:', error);
        return false;
      }
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  }
};

export default NextAuth(authOptions);