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
    <div>
      <h1>{pet.name}の詳細</h1>
      <p>種別: {pet.species}</p>
      <p>年齢: {pet.age}</p>
      <p>種類: {pet.breed}</p>

      {isOwner && (
        <div>
          <button onClick={handleEdit}>編集</button> {/* 編集ボタン */}
          <button onClick={handleDelete}>削除</button>
        </div>
      )}

      <button onClick={handleBack} style={{ marginTop: '20px' }}>
        ペット一覧に戻る
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

export default PetDetail;