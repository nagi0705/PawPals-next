// /pages/facilities/index.js
import { useState, useEffect } from 'react';
import { Client, Databases } from 'appwrite';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function FacilitiesList() {
  const [facilities, setFacilities] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const client = new Client()
          .setEndpoint('https://cloud.appwrite.io/v1')
          .setProject('675183a100255c6c9a3f');

        const databases = new Databases(client);

        const response = await databases.listDocuments(
          '6751bd2800009a139bb8',
          '67e8e07100164c327c35'
        );

        setFacilities(response.documents);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFacilities();
  }, []);

  const filtered = facilities.filter((facility) => {
    const query = searchQuery.toLowerCase();
    return (
      String(facility.name || '').toLowerCase().includes(query) ||
      String(facility.location || '').toLowerCase().includes(query) ||
      String(facility.type || '').toLowerCase().includes(query) ||
      String(facility.petsAllowed || '').toLowerCase().includes(query) ||
      String(facility.features || '').toLowerCase().includes(query)
    );
  });

  return (
    <div style={{
      backgroundColor: "#e2ffe2",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "2rem",
      margin: "2rem auto",
      maxWidth: "800px",
    }}>
      <h1 style={{ color: "#f68fe1", textAlign: "center", marginBottom: "2rem" }}>🐶 ペットと行ける施設一覧</h1>

      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="施設名、場所、タイプなどで検索"
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid black',
            width: '100%',
          }}
        />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Link href="/facilities/new">
          <button style={{
            backgroundColor: "#f68fe1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            marginRight: "1rem"
          }}>施設を追加する</button>
        </Link>
        <Link href="/top">
          <button style={{
            backgroundColor: "#f68fe1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            cursor: "pointer"
          }}>トップページに戻る</button>
        </Link>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>エラー: {error}</p>}

      {facilities.length === 0 && !error && (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          まだ施設が登録されていません。新しい施設を追加してみましょう！
        </p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filtered.map((facility) => (
          <li
            key={facility.$id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ color: '#f68fe1', marginBottom: '0.5rem' }}>{facility.name}</h2>
            <p style={{ marginBottom: '0.5rem' }}>{facility.location}</p>
            <p style={{ marginBottom: '1rem', color: '#666' }}>{facility.type}</p>
            <Link href={`/facilities/${facility.$id}`}>
              <button style={{
                backgroundColor: "#f68fe1",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0.5rem 1rem",
                cursor: "pointer"
              }}>詳細を見る</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}