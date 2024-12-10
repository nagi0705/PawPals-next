// pages/auth/signin.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';  // signInを追加

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push('/top');
    }
  }, [session, router]);

  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      // NextAuthのsignIn関数を使用
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result.error) {
        setError('ログインに失敗しました');
      } else {
        router.push('/top');
      }
    } catch (error) {
      setError('ログイン処理中にエラーが発生しました');
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