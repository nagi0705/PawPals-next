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
    <div
      style={{
        backgroundColor: "#e2ffe2",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "400px",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#f68fe1" }}>ログイン</h1>
      <form onSubmit={handleSignin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          required
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "2px solid black",
            marginBottom: "10px",
            width: "100%",
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          required
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "2px solid black",
            marginBottom: "10px",
            width: "100%",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#f68fe1",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#007bff")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#f68fe1")}
        >
          ログイン
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Signin;