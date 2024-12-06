// pages/auth/signup.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const { data: session } = useSession(); // セッション情報を取得

  // ログイン状態でアクセスしている場合、/top にリダイレクト
  useEffect(() => {
    if (session) {
      router.push('/top'); // 既にサインインしていれば、トップページにリダイレクト
    }
  }, [session]);

  const handleSignup = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (res.ok) {
      router.push('/top'); // サインアップ成功後にトップページにリダイレクト
    } else {
      const errorData = await res.json();
      setError(errorData.error || 'サインアップに失敗しました');
    }
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前"
          required
        />
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
        <button type="submit">サインアップ</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Signup;