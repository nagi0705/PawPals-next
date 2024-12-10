// pages/top.js
import Link from 'next/link';
import { getSession } from 'next-auth/react'; // セッション情報を取得

const Top = ({ session }) => {
  // ログインしていない場合は、indexページにリダイレクト
  if (!session) {
    return <p>ログインしてください...</p>; // サーバーサイドでリダイレクトさせます
  }

  return (
    <div>
      <h1>ようこそ、{session.user.name}さん！</h1>
      <p>ここはトップページです。</p>

      {/* ユーザー一覧ページへのリンク */}
      <div>
        <h2>ナビゲーション</h2>
        <ul>
          <li>
            <Link href="/users">他の仲間を見てみよう！</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  // セッション情報を取得
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/', // ログインしていない場合は、indexページにリダイレクト
        permanent: false,
      },
    };
  }

  return {
    props: { session }, // ログインしている場合は、トップページを表示
  };
}

export default Top;