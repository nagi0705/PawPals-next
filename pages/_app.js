import { SessionProvider } from 'next-auth/react';  // next-authからSessionProviderをインポート
//import '../styles/globals.css';  // 必要に応じてスタイルをインポート

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>  {/* SessionProviderでラップ */}
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;