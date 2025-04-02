// /pages/facilities/new.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const AddFacility = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [petsAllowed, setPetsAllowed] = useState('');
  const [features, setFeatures] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!session) {
    return <div>ログインが必要です</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/facilities/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          type,
          petsAllowed,
          features,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '施設の登録に失敗しました');
      }

      alert('施設が登録されました！');
      router.push('/facilities');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🏠 新しい施設を追加</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>施設名（30文字以内）</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 30))}
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
          <label>所在地</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
          <label>施設タイプ（例: カフェ、公園、ホテルなど）</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
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
          <label>OKなペット（例: 犬, 猫）</label>
          <input
            type="text"
            value={petsAllowed}
            onChange={(e) => setPetsAllowed(e.target.value)}
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
          <label>特徴・設備（任意）</label>
          <input
            type="text"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            style={{
              border: '1px solid black',
              borderRadius: '8px',
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
            backgroundColor: '#f68fe1',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          {loading ? '登録中...' : '施設を追加'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </form>
      <button
        onClick={() => router.push('/facilities')}
        style={{
          marginTop: '20px',
          backgroundColor: '#6c757d',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        一覧に戻る
      </button>
    </div>
  );
};

export default AddFacility;