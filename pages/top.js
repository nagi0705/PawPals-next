// pages/top.js
import Link from 'next/link';
import { getSession, signOut } from 'next-auth/react'; // signOutを追加

const Top = ({ session }) => {
  // ログインしていない場合は、indexページにリダイレクト
  if (!session) {
    return <p>ログインしてください...</p>; // サーバーサイドでリダイレクトさせます
  }

  // ログアウト処理を追加
  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

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

      {/* ログアウトボタンを追加 */}
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        ログアウト
      </button>
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