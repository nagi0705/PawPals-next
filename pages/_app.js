// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css'; // BootstrapのCSSをインポート
import '../styles/globals.css'; // 他のスタイルもインポート
import { SessionProvider } from "next-auth/react"; // SessionProviderをインポート

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}