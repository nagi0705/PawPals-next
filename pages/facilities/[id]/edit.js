// /pages/facilities/[id]/edit.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function EditFacility() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    name: '',
    location: '',
    type: '',
    petsAllowed: '',
    features: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // データ取得
  useEffect(() => {
    if (!id) return;

    const fetchFacility = async () => {
      try {
        const response = await fetch(`/api/facilities/${id}`);
        const data = await response.json();

        setForm({
          name: data.name || '',
          location: data.location || '',
          type: data.type || '',
          petsAllowed: data.petsAllowed || '',
          features: data.features || ''
        });
      } catch (err) {
        setError('データ取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/facilities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '更新に失敗しました');
      }

      router.push(`/facilities/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container">
      <h1>施設を編集</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>施設名</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>所在地</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>施設タイプ（例: カフェ、公園など）</label>
          <input
            type="text"
            name="type"
            value={form.type}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>ペット種類（例: 犬、猫）</label>
          <input
            type="text"
            name="petsAllowed"
            value={form.petsAllowed}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>特徴・設備</label>
          <textarea
            name="features"
            value={form.features}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#f68fe1',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              marginRight: '10px'
            }}
          >
            更新する
          </button>
          <Link href={`/facilities/${id}`}>
            <button
              type="button"
              style={{
                backgroundColor: '#aaa',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
              }}
            >
              キャンセル
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}