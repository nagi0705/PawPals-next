// pages/top.js
import Link from "next/link";
import { getSession, signOut } from "next-auth/react"; // signOutを追加

const Top = ({ session }) => {
  // ログインしていない場合は、indexページにリダイレクト
  if (!session) {
    return <p>ログインしてください...</p>; // サーバーサイドでリダイレクトさせます
  }

  // ログアウト処理を追加
  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/" });
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  return (
    <div className="container bg-green-100 p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-primary-color mb-4">
        PawPalsで遊ぼう 🐾
      </h1>
      <p className="text-center text-gray-600 mb-6">ここはトップページです。</p>

      <div className="space-y-4">
        <div>
          <Link href="/groups" className="link-button">
            💬 仲間とグループでチャットしよう！
          </Link>
        </div>
        <div>
          <Link href="/pets/new" className="link-button">
            🐾 ペットを登録しよう！
          </Link>
        </div>
        <div>
          <Link href="/pets" className="link-button">
            📸 ペット自慢&他のペットも見てみよう！
          </Link>
        </div>
        <div>
          <button
            className="link-button bg-red-500 hover:bg-red-600 text-white"
            onClick={handleLogout}
          >
            🐕‍🦺 ログアウト
          </button>
        </div>
      </div>

      {/* 画像を追加 */}
      <div className="mt-6 text-center">
        <img
          src="/images/pawpals.jpg" // 画像へのパス
          alt="PawPalsのイメージ"
          className="w-64 h-auto mx-auto rounded-lg shadow-lg"
        />
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
        destination: "/", // ログインしていない場合は、indexページにリダイレクト
        permanent: false,
      },
    };
  }

  return {
    props: { session }, // ログインしている場合は、トップページを表示
  };
}

export default Top;