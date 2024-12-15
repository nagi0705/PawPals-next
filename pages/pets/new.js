import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function NewPet() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [petCount, setPetCount] = useState(0);

  useEffect(() => {
    const fetchPetCount = async () => {
      if (session) {
        try {
          const response = await fetch('/api/pets');
          const data = await response.json();
          if (!Array.isArray(data)) {
            setPetCount(0);
            return;
          }
          const userPets = data.filter(pet => pet.userId === session.user.id);
          setPetCount(userPets.length);
        } catch (error) {
          console.error('Error fetching pet count:', error);
        }
      }
    };

    fetchPetCount();
  }, [session]);

  if (status === 'loading') {
    return <div className="p-4">読み込み中...</div>;
  }

  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>この機能を使用するにはログインが必要です。</p>
        </div>
      </div>
    );
  }

  if (petCount >= 10) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>ペットの登録数が上限（10匹）に達しています。</p>
          <Link href="/pets" className="text-blue-500 hover:underline mt-2 inline-block">
            ペット一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await fetch('/api/pets/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        userId: session.user.id,  // ここでユーザーIDを追加
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'ペットの登録に失敗しました');
    }

    router.push('/pets');
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">新規ペット登録</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            名前 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ペットの名前"
          />
        </div>

        <div>
          <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
            種類 *
          </label>
          <input
            type="text"
            id="species"
            name="species"
            required
            value={formData.species}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="犬、猫など"
          />
        </div>

        <div>
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
            品種 *
          </label>
          <input
            type="text"
            id="breed"
            name="breed"
            required
            value={formData.breed}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="柴犬、アメリカンショートヘアなど"
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            年齢 *
          </label>
          <input
            type="number"
            id="age"
            name="age"
            required
            min="0"
            max="100"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="年齢"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? '登録中...' : '登録する'}
          </button>
          <Link
            href="/pets"
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-center"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}