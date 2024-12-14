import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function PetsList() {
  const { data: session } = useSession();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/pets');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'ペットの取得に失敗しました');
        }

        setPets(data);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('ペットの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-gray-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      ) : null}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ペット一覧</h1>
        {session && (
          <Link
            href="/pets/new"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            新規登録
          </Link>
        )}
      </div>

      {!error && pets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">登録されているペットはいません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.$id}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h2 className="text-xl font-bold mb-3">{pet.name}</h2>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium text-gray-700">種類:</span> {pet.species}</p>
                <p><span className="font-medium text-gray-700">品種:</span> {pet.breed}</p>
                <p><span className="font-medium text-gray-700">年齢:</span> {pet.age}歳</p>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link
                  href={`/pets/${pet.$id}`}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  詳細を見る
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}