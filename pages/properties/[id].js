import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Client, Databases } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '/pages/api/auth/[...nextauth].js'; // 修正後のパス

const PropertyDetail = ({ property, isOwner }) => {
  const [error, setError] = useState(null);
  const router = useRouter();

  // 編集用のハンドラ
  const handleEdit = () => {
    router.push(`/properties/${property.$id}/edit`); // 編集ページに遷移
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
          '6751bd2800009a139bb8',
          '67e6439800093f765fd9',
          property.$id
        );

        alert('物件が削除されました');
        router.push('/properties');
      } catch (err) {
        setError('削除に失敗しました: ' + err.message);
        console.error('削除エラー:', err);
      }
    }
  };

  // 戻るボタンのハンドラ
  const handleBack = () => {
    router.push('/properties'); // 物件一覧ページに戻る
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
      <h1 style={{ color: "#f68fe1", marginBottom: "1rem" }}>{property.housename}の詳細</h1>
      <p style={{ fontWeight: "bold" }}>所在地: {property.location}</p>
      <p style={{ fontWeight: "bold" }}>家賃: {(property.price / 10000).toFixed(1)}万円</p>
      <p style={{ fontWeight: "bold" }}>ペット許可: {property.petsAllowed.join(', ')}</p>
      <p style={{ fontWeight: "bold" }}>物件の特徴: {property.features.join(', ')}</p>
                
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
        物件一覧に戻る
      </button>

    </div>
  );
};

// サーバーサイドで物件データとオーナーかどうかを取得
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
      '67e6439800093f765fd9', // コレクションID
      id // 物件ID
    );

    const property = response;
    const isOwner = property.ownerEmail === session.user.email; // オーナーかどうかの判定

    return {
      props: { property, isOwner },
    };
  } catch (error) {
    console.error(error);
    return {
    notFound: true, // 物件が見つからない場合は404
    };
  }
}

export default PropertyDetail;