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
      // Appwrite クライアントの初期化
      const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite エンドポイント
        .setProject('675183a100255c6c9a3f'); // プロジェクトID

      const databases = new Databases(client);

      // ペット情報の更新
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
    <div>
      <h1>{pet.name}の情報を編集</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>年齢</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <label>動物(犬、猫、鳥など)</label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            required
          />
        </div>
        <div>
          <label>種類(チワワ、ロシアンブルーなど)</label>
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? '更新中...' : 'ペット情報を更新'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {/* 戻るボタン */}
      <button onClick={handleBack} style={{ marginTop: '20px' }}>
        ペット詳細に戻る
      </button>
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

export default EditPet;