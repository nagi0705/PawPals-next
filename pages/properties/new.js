import { useState } from 'react';
import { useRouter } from 'next/router'; // useRouter をインポート

const AddProperty = () => {
  const [housename, setHousename] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(''); // 文字列として管理
  const [petsAllowed, setPetsAllowed] = useState('');
  const [features, setFeatures] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // useRouter フックを使用してルーティング

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 必須フィールドの検証
      if (!housename || !location || !price || !petsAllowed) {
        throw new Error('すべての必須フィールドを入力してください');
      }

      const propertyData = {
        housename: housename.trim(),
        location: location.trim(),
        price: Math.floor(Number(price) * 10000), // 万円から円に変換
        petsAllowed: petsAllowed.split(',').map(pet => pet.trim()),
        features: features ? features.split(',').map(feature => feature.trim()) : []
      };

      const response = await fetch('/api/properties/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '物件の追加に失敗しました');
      }

      // 成功時の処理
      setHousename('');
      setLocation('');
      setPrice('');
      setPetsAllowed('');
      setFeatures('');
      alert('物件が追加されました！');
      router.push('/properties');
    } catch (err) {
      setError(err.message);
      console.error('エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/properties'); // 物件一覧ページに戻る
  };

  return (
    <div className="container">
      <h1>🏠 新しい物件を追加 🏠</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>物件名(例:マンションA)</label>
          <input
            type="text"
            value={housename}
            onChange={(e) => setHousename(e.target.value)}
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
          <label>所在地(例:東京都千代田区永田町1-7-1)</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
          <label>家賃(万円単位で入力。例: 10.5 = 10万5千円)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            style={{
              border: '1px solid black',
              borderRadius: '8px',
              padding: '8px',
              marginBottom: '10px',
              width: '100%',
            }}
          />
        </div>
        <div>
          <label>ペット許可(例:犬、猫、鳥 2匹までなど)</label>
          <input
            type="text"
            value={petsAllowed}
            onChange={(e) => setPetsAllowed(e.target.value)}
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
          <label>物件の広さ、特徴(例:2ldk、駅徒歩10分、ドッグランありなど)</label>
          <input
            type="text"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
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
          {loading ? '登録中...' : '物件を追加'}
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
        物件一覧に戻る
      </button>
    </div>
  );
};

export default AddProperty;