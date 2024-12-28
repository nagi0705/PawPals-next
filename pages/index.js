import Link from "next/link";
import { useSession } from "next-auth/react"; // クライアントサイドでセッション管理

export default function Home() {
  const { data: session } = useSession();

  // ログインしている場合は/topページにリダイレクト
  if (session) {
    window.location.href = "/top";
  }

  return (
    <div
      style={{
        backgroundColor: "#e2ffe2",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "800px",
        textAlign: "center",
      }}
      className="flex justify-center items-center h-screen"
    >
      <div>
        <h1
          style={{ color: "black", fontWeight: "bold", marginBottom: "2rem" }}
          className="text-3xl"
        >
          PawPalsへようこそ！
        </h1>
        <div>
          <Link href="/auth/signup">
            <button
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
          </Link>
        </div>
        <div style={{ marginTop: "20px" }}>
          <Link href="/auth/signin">
            <button
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
          </Link>
        </div>
        <div style={{ marginTop: "20px" }}>
          <Link href="/about">
            <button
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
              アプリについて
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}