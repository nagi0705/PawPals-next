import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Client, Databases } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '/pages/api/auth/[...nextauth].js'; // 修正後のパス

const PetDetail = ({ pet, isOwner }) => {
  const [error, setError] = useState(null);
  const router = useRouter();

  // 編集用のハンドラ
  const handleEdit = () => {
    router.push(`/pets/${pet.$id}/edit`); // 編集ページに遷移
  };

  // 削除用のハンドラ
  const handleDelete = async () => {
    if (confirm('本当に削除しますか？')) {
      try {
        const client = new Client()
          .setEndpoint('https://cloud.appwrite.io/v1')
          .setProject('675183a100255c6c9a3f');
        const databases = new Databases(client);

        await databases.deleteDocument(
          '6751bd2800009a139bb8', // データベースID
          '67679a6600013eb8b9ed', // コレクションID
          pet.$id // ペットID
        );

        alert('ペットが削除されました');
        router.push('/pets'); // ペット一覧ページに遷移
      } catch (err) {
        setError('削除に失敗しました');
        console.error(err);
      }
    }
  };

  // 戻るボタンのハンドラ
  const handleBack = () => {
    router.push('/pets'); // ペット一覧ページに戻る
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div
      style={{
        backgroundColor: "#e2ffe2", // グリーンの背景色
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "800px",
        textAlign: "center", // 中央揃え
      }}
    >
      <h1 style={{ color: "#f68fe1", marginBottom: "1rem" }}>{pet.name}の詳細</h1>
      <p style={{ fontWeight: "bold" }}>種別: {pet.species}</p>
      <p style={{ fontWeight: "bold" }}>年齢: {pet.age}</p>
      <p style={{ fontWeight: "bold" }}>種類: {pet.breed}</p>

      {isOwner && (
        <div style={{ margin: "1rem 0" }}>
          <button
            onClick={handleEdit}
            style={{
              backgroundColor: "#f68fe1",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              border: "none",
              cursor: "pointer",
              marginRight: "1rem",
              color: "#fff",
            }}
          >
            編集
          </button>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "#f68fe1",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              border: "none",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            削除
          </button>
        </div>
      )}

      <button
        onClick={handleBack}
        style={{
          backgroundColor: "#f68fe1",
          borderRadius: "8px",
          padding: "0.5rem 1rem",
          border: "none",
          cursor: "pointer",
          color: "#fff",
          marginTop: "1rem",
        }}
      >
        ペット一覧に戻る
      </button>

      {/* 画像の追加 */}
      <div style={{ marginTop: "1.5rem" }}>
        <img
          src="/images/pawpals2.jpg" // 画像のパス
          alt="PawPalsのイメージ"
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "auto",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
};

// サーバーサイドでペットデータとオーナーかどうかを取得
export async function getServerSideProps(context) {
  const { id } = context.params;

  // セッション情報の取得
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('675183a100255c6c9a3f');
  const databases = new Databases(client);

  try {
    // ペットデータの取得
    const response = await databases.getDocument(
      '6751bd2800009a139bb8', // データベースID
      '67679a6600013eb8b9ed', // コレクションID
      id // ペットID
    );

    const pet = response;
    const isOwner = pet.ownerEmail === session.user.email; // オーナーかどうかの判定

    return {
      props: { pet, isOwner },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true, // ペットが見つからない場合は404
    };
  }
}

export default PetDetail;