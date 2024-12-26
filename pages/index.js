import Link from 'next/link';  
import { useSession } from 'next-auth/react'; // クライアントサイドでセッション管理

export default function Home() {
  const { data: session } = useSession();

  // ログインしている場合は/topページにリダイレクト
  if (session) {
    window.location.href = '/top';
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6">PawPalsへようこそ！</h1>
        <div>
          <Link
            href="/auth/signup"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            サインアップ
          </Link>
        </div>
        <div className="mt-4">
          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            ログイン
          </Link>
        </div>
        <div className="mt-4">
          <Link
            href="/about"
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            アプリについて
          </Link>
        </div>
      </div>
    </div>
  );
}