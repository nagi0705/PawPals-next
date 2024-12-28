import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push('/top');
    }
  }, [session, router]);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // 1. まずサインアップ
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!signupRes.ok) {
        const errorData = await signupRes.json();
        throw new Error(errorData.error || 'サインアップに失敗しました');
      }

      // 2. サインアップ成功後、自動的にログイン
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result.error) {
        setError('ログインに失敗しました');
      } else {
        router.push('/top');
      }
    } catch (error) {
      setError(error.message);
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
      <h1 style={{ color: "#f68fe1" }}>サインアップ</h1>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前"
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
          サインアップ
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Signup;