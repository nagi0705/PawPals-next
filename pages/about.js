import React from "react";

export default function About() {
  return (
    <div style={{ padding: "2rem", lineHeight: "1.6" }}>
      <h1>About PawPals</h1>
      <p>
        PawPalsは、ペット愛好家のためのソーシャルプラットフォームです。
        ユーザーはペットを登録し、ペットに関する投稿を共有し、他のペット愛好家とつながることができます。
      </p>
      <h2>主な特徴</h2>
      <ul>
        <li>ペットのプロフィールを作成・管理</li>
        <li>他のユーザーの投稿を見る・いいねする・コメントする</li>
        <li>グループチャットを通じてコミュニケーション</li>
      </ul>
      <h2>開発の背景</h2>
      <p>
        PawPalsは、ペット愛好家が楽しく交流できる場を提供するために開発されました。
        ユーザーは自身のペットの日常を共有し、他のユーザーのペットについて知ることができます。
      </p>
    </div>
  );
}