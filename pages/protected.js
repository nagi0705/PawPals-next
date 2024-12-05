// pages/protected.js
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    // ログインしていない場合、ログインページにリダイレクト
    router.push('/auth/signin');
    return null;
  }

  return (
    <div>
      <h1>保護されたページ</h1>
      <p>ようこそ、{session.user.name}さん！</p>
    </div>
  );
}