// pages/auth/signup.js
import { useState } from 'react';
import { useRouter } from 'next/router';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);  // エラーメッセージ用のステート
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password); // デバッグ用ログ

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),  // 正しいパラメータ名
    });
    console.log('Request body:', JSON.stringify({ email, password }));

    if (res.ok) {
      // サインアップ成功後にホームページにリダイレクト
      router.push('/');  // ホームページにリダイレクト（必要に応じて変更）
      console.log('サインアップ成功');
    } else {
      // エラー処理
      const errorData = await res.json();
      setError(errorData.error || 'サインアップに失敗しました');
      console.error('サインアップエラー:', errorData.error);
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

      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* エラーメッセージの表示 */}
    </div>
  );
};

export default Signup;