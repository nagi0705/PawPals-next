import { useState, useEffect } from 'react';
import { Client, Databases } from 'appwrite';
import { useRouter } from 'next/router'; // useRouter をインポート

const PetsList = () => {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter(); // useRouter フックを使用してルーティング

  useEffect(() => {
    const fetchPets = async () => {
      try {
        // Appwriteクライアントを初期化
        const client = new Client()
          .setEndpoint('https://cloud.appwrite.io/v1') // Appwriteのエンドポイント
          .setProject('675183a100255c6c9a3f'); // ここにプロジェクトIDを設定

        const databases = new Databases(client);

        // ペットデータを取得
        const response = await databases.listDocuments(
          '6751bd2800009a139bb8', // データベースID
          '67679a6600013eb8b9ed' // コレクションID
        );

        if (response) {
          setPets(response.documents); // ペットデータをセット
        } else {
          throw new Error('ペットデータの取得に失敗しました');
        }
      } catch (err) {
        setError(err.message);
        console.error('エラー:', err);
      }
    };

    fetchPets();
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>エラー: {error}</p>;
  }

  const handleAddPet = () => {
    router.push('/pets/new'); // 新規登録ページに遷移
  };

  const handleGoHome = () => {
    router.push('/top'); // トップページに遷移
  };

  return (
    <div>
      <h1>ペット一覧</h1>
      <button onClick={handleAddPet} style={{ marginBottom: '20px' }}>
        新しいペットを登録
      </button>
      <button onClick={handleGoHome} style={{ marginBottom: '20px', marginLeft: '10px' }}>
        トップページに戻る
      </button>
      <ul>
        {pets.map((pet) => (
          <li key={pet.$id}>
            <h2>{pet.name}</h2>
            <p>種別: {pet.species}</p>
            <p>年齢: {pet.age}</p>
            <a href={`/pets/${pet.$id}`}>詳細を見る</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PetsList;