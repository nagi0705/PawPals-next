import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Client, Databases } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]'; // 修正後のパス

const EditProperty = ({ property, isOwner }) => {
  const [housename, setHousename] = useState(property.housename || '');
  const [location, setLocation] = useState(property.location || '');
  const [price, setPrice] = useState(((property.price || 0) / 10000).toFixed(1));  // 万円単位で表示、小数点1桁まで
  const [petsAllowed, setPetsAllowed] = useState(Array.isArray(property.petsAllowed) ? property.petsAllowed.join(', ') : '');
  const [features, setFeatures] = useState(Array.isArray(property.features) ? property.features.join(', ') : '');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isOwner) {
      alert('この物件を編集する権限がありません');
      router.push(`/properties/${property.$id}`); // 編集権限がない場合は詳細ページにリダイレクト
    }
  }, [isOwner, router, property.$id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const propertyData = {
      housename,
      location,
      price: Math.floor(Number(price) * 10000),
      petsAllowed: Array.isArray(petsAllowed) ? petsAllowed : petsAllowed.split(',').map(pet => pet.trim()),
      features: features ? (Array.isArray(features) ? features : features.split(',').map(feature => feature.trim())) : []
    };

    try {
      const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite エンドポイント
        .setProject('675183a100255c6c9a3f'); // プロジェクトID

      const databases = new Databases(client);

      const response = await databases.updateDocument(
        '6751bd2800009a139bb8', // データベースID
        '67e6439800093f765fd9', // コレクションID
        property.$id, // 物件ID
        propertyData // 更新するデータ
      );

      alert('物件が更新されました！');
      router.push(`/properties/${property.$id}`); // 物件詳細ページにリダイレクト
    } catch (err) {
      setError(err.message);
      console.error('エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`/properties/${property.$id}`); // 編集前の物件詳細ページに戻る
  };

  if (!isOwner) {
    return <p>権限がありません</p>;
  }

  return (
    <div
      style={{
        backgroundColor: "#e2ffe2", // 緑の背景
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "600px",
      }}
    >
      <h1 style={{ color: "#f68fe1", textAlign: "center" }}>{property.housename}の情報を編集</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>物件名(例:マンションA)</label>
          <input
            type="text"
            value={housename}
            onChange={(e) => setHousename(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              border: "2px solid black",
              borderRadius: "8px",
              marginTop: "5px",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>所在地(例:東京都千代田区永田町1-7-1)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              border: "2px solid black",
              borderRadius: "8px",
              marginTop: "5px",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>家賃（万円単位で入力：例 10.5）</label>
          <input
            type="number"
            step="0.1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              border: "2px solid black",
              borderRadius: "8px",
              marginTop: "5px",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>ペット許可(例:犬、猫、鳥 2匹までなど)</label>
          <input
            type="text"
            value={petsAllowed}
            onChange={(e) => setPetsAllowed(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              border: "2px solid black",
              borderRadius: "8px",
              marginTop: "5px",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>物件の広さ、特徴(例:2LDK、駅徒歩10分、ドッグランありなど)</label>
          <input
            type="text"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              border: "2px solid black",
              borderRadius: "8px",
              marginTop: "5px",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#f68fe1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            marginRight: "1rem",
          }}
        >
          {loading ? "更新中..." : "物件情報を更新"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <button
        onClick={handleBack}
        style={{
          backgroundColor: "#f68fe1",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        物件詳細に戻る
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
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("675183a100255c6c9a3f");
  const databases = new Databases(client);

  try {
    const response = await databases.getDocument(
      "6751bd2800009a139bb8",
      "67e6439800093f765fd9",
      id
    );

    const property = response;
    const isOwner = property.ownerEmail === session.user.email;

    return {
      props: { property , isOwner },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}

export default EditProperty;