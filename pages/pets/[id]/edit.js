import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Client, Databases } from 'appwrite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]'; // 修正後のパス

const EditPet = ({ pet, isOwner }) => {
  const [name, setName] = useState(pet.name || '');
  const [age, setAge] = useState(pet.age || '');
  const [species, setSpecies] = useState(pet.species || '');
  const [breed, setBreed] = useState(pet.breed || '');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isOwner) {
      alert('このペットを編集する権限がありません');
      router.push(`/pets/${pet.$id}`); // 編集権限がない場合は詳細ページにリダイレクト
    }
  }, [isOwner, router, pet.$id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const petData = { name, age, species, breed };

    try {
      const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite エンドポイント
        .setProject('675183a100255c6c9a3f'); // プロジェクトID

      const databases = new Databases(client);

      const response = await databases.updateDocument(
        '6751bd2800009a139bb8', // データベースID
        '67679a6600013eb8b9ed', // コレクションID
        pet.$id, // ペットID
        petData // 更新するデータ
      );

      alert('ペットが更新されました！');
      router.push(`/pets/${pet.$id}`); // ペット詳細ページにリダイレクト
    } catch (err) {
      setError(err.message);
      console.error('エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`/pets/${pet.$id}`); // 編集前のペット詳細ページに戻る
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
      <h1 style={{ color: "#f68fe1", textAlign: "center" }}>{pet.name}の情報を編集</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <label>年齢</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
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
          <label>動物(犬、猫、鳥など)</label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
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
          <label>種類(チワワ、ロシアンブルーなど)</label>
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
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
          {loading ? "更新中..." : "ペット情報を更新"}
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
        ペット詳細に戻る
      </button>
    </div>
  );
};

// サーバーサイドでペットデータとオーナーかどうかを取得
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
      "67679a6600013eb8b9ed",
      id
    );

    const pet = response;
    const isOwner = pet.ownerEmail === session.user.email;

    return {
      props: { pet, isOwner },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}

export default EditPet;