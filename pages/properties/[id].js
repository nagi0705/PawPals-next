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
    router.push(`/properties/${property.$id}/edit`);
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

  const handleBack = () => {
    router.push('/properties');
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
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
    >
      <h1 style={{ color: "#f68fe1", marginBottom: "1rem" }}>{property.housename}の詳細</h1>
      <p style={{ fontWeight: "bold" }}>所在地: {property.location}</p>
      <p style={{ fontWeight: "bold" }}>家賃: {(property.price / 10000).toFixed(1)}万円</p>
      <p style={{ fontWeight: "bold" }}>ペット許可: {property.petsAllowed || '未登録'}</p>
      <p style={{ fontWeight: "bold" }}>物件の特徴: {property.features || '未登録'}</p>

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
    const response = await databases.getDocument(
      '6751bd2800009a139bb8',
      '67e6439800093f765fd9',
      id
    );

    const property = response;
    const isOwner = property.ownerEmail === session.user.email;

    return {
      props: { property, isOwner },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}

export default PropertyDetail;