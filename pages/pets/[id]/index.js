import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PetDetail() {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchPetDetails();
    }
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      const response = await fetch(`/api/pets/${id}`);
      const data = await response.json();
      setPet(data);
    } catch (error) {
      setError('ペット情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      const response = await fetch(`/api/pets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('削除に失敗しました');

      router.push('/pets');
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;
  if (!pet) return <div>ペットが見つかりません</div>;

  const isOwner = session?.user?.id === pet.userId;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{pet.name}</h1>
      
      <div className="mb-4">
        <p>種類: {pet.species}</p>
        <p>品種: {pet.breed}</p>
        <p>年齢: {pet.age}歳</p>
      </div>

      <div className="flex gap-4">
        {isOwner && (
          <>
            <Link
              href={`/pets/${id}/edit`}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              編集
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              削除
            </button>
          </>
        )}
        
        <Link
          href="/pets"
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          戻る
        </Link>
      </div>
    </div>
  );
}