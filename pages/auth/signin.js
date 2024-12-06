// pages/auth/signin.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';  // セッション情報を取得

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();  // セッション情報を取得

  // ログイン状態でアクセスしている場合、/top にリダイレクト
  useEffect(() => {
    if (session) {
      router.push('/top');  // 既にサインインしていれば、トップページにリダイレクト
    }
  }, [session]);

  const handleSignin = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),  // メールとパスワードを送信
    });

    if (res.ok) {
      // サインイン成功後、トップページにリダイレクト
      router.push('/top');
    } else {
      // サインインエラー
      const errorData = await res.json();
      setError(errorData.error || 'サインインに失敗しました');
    }
  };

  return (
    <div>
      <h1>サインイン</h1>
      <form onSubmit={handleSignin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          required
        />
        <button type="submit">サインイン</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Signin;