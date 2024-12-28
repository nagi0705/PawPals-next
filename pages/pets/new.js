import { useState } from 'react';
import { useRouter } from 'next/router'; // useRouter をインポート

const AddPet = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // useRouter フックを使用してルーティング

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const petData = { name, age, species, breed };

    try {
      const response = await fetch('/api/pets/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'ペットの追加に失敗しました');
      }

      setName('');
      setAge('');
      setSpecies('');
      setBreed('');
      alert('ペットが追加されました！');
    } catch (err) {
      setError(err.message);
      console.error('エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/pets'); // ペット一覧ページに戻る
  };

  return (
    <div className="container">
      <h1>🐾 新しいペットを追加 🐾</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              border: '1px solid black', // 黒い縁
              borderRadius: '8px', // 角を丸く
              padding: '8px',
              marginBottom: '10px',
              width: '100%',
            }}
          />
        </div>
        <div>
          <label>年齢</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            style={{
              border: '1px solid black', // 黒い縁
              borderRadius: '8px', // 角を丸く
              padding: '8px',
              marginBottom: '10px',
              width: '100%',
            }}
          />
        </div>
        <div>
          <label>動物(犬、猫、鳥など)</label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            required
            style={{
              border: '1px solid black', // 黒い縁
              borderRadius: '8px', // 角を丸く
              padding: '8px',
              marginBottom: '10px',
              width: '100%',
            }}
          />
        </div>
        <div>
          <label>種類(チワワ、ロシアンブルーなど)</label>
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
            style={{
              border: '1px solid black', // 黒い縁
              borderRadius: '8px', // 角を丸く
              padding: '8px',
              marginBottom: '10px',
              width: '100%',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#ff69b4',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          {loading ? '登録中...' : 'ペットを追加'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <button
        onClick={handleGoBack}
        style={{
          backgroundColor: '#6c757d',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        ペット一覧に戻る
      </button>
    </div>
  );
};

export default AddPet;