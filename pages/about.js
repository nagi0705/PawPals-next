import React from "react";
import Link from "next/link"; // Linkをインポート

export default function About() {
  return (
    <div
      style={{
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "800px",
        lineHeight: "1.6",
      }}
    >
      {/* タイトルセクション */}
      <div
        style={{
          backgroundColor: "#e2ffe2", // グリーンの背景色
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ color: "#ff69b4", textAlign: "center" }}>PawPalsについて</h1>
        <p style={{ textAlign: "center", color: "#2d3748" }}>
          PawPalsは、ペット愛好家のためのソーシャルプラットフォームです。<br />
          ユーザーはペットを登録し、ペットに関する投稿を共有し、<br />
          他のペット愛好家とつながることができます。
        </p>
      </div>

      {/* 主な特徴セクション */}
      <div
        style={{
          backgroundColor: "#e2ffe2", // グリーンの背景色
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ color: "#ff69b4", textAlign: "center" }}>主な特徴</h2>
        <ul style={{ textAlign: "center", color: "#2d3748" }}>
          <li>ペットのプロフィールを作成・管理</li>
          <li>他のユーザーの投稿を見る・いいねする・コメントする</li>
          <li>グループチャットを通じてコミュニケーション</li>
        </ul>
      </div>

      {/* 開発の背景セクション */}
      <div
        style={{
          backgroundColor: "#e2ffe2", // グリーンの背景色
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ color: "#ff69b4", textAlign: "center" }}>開発の背景</h2>
        <p style={{ textAlign: "center", color: "#2d3748" }}>
          PawPalsは、ペット愛好家が楽しく交流できる場を提供するために開発されました。<br />
          ユーザーは自身のペットの日常を共有し、他のユーザーのペットについて知ることができます。
        </p>
      </div>

      {/* トップページに戻るボタン */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link href="/" passHref>
          <span
            style={{
              display: "inline-block",
              backgroundColor: "#ff69b4",
              color: "#ffffff",
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
              cursor: "pointer",
            }}
          >
            トップページに戻る
          </span>
        </Link>
      </div>
    </div>
  );
}