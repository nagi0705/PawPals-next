import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    // 必要に応じて他のプロバイダーも追加
  ],
  secret: process.env.NEXTAUTH_SECRET, // セッション暗号化のためのシークレット

  callbacks: {
    async session(session, user) {
      // セッションデータをカスタマイズする場合、ここで処理できます
      session.user.id = user.id;
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",  // ログインページのカスタマイズ
    error: "/auth/error",    // エラーページのカスタマイズ
  },
};

export default NextAuth(authOptions);