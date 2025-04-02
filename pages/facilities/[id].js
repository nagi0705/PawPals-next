// /pages/facilities/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Client, Databases } from 'appwrite';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function FacilityDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [facility, setFacility] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchFacility = async () => {
      try {
        const client = new Client()
          .setEndpoint('https://cloud.appwrite.io/v1')
          .setProject('675183a100255c6c9a3f');

        const databases = new Databases(client);

        const response = await databases.getDocument(
          '6751bd2800009a139bb8',
          '67e8e07100164c327c35',
          id
        );

        setFacility(response);
      } catch (err) {
        setError('施設の取得に失敗しました');
      }
    };

    fetchFacility();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = confirm('この施設を削除してもよろしいですか？');
    if (!confirmDelete) return;

    try {
      const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('675183a100255c6c9a3f');

      const databases = new Databases(client);

      await databases.deleteDocument(
        '6751bd2800009a139bb8',
        '67e8e07100164c327c35',
        id
      );

      alert('施設を削除しました');
      router.push('/facilities');
    } catch (err) {
      alert('削除に失敗しました');
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!facility) return <p>読み込み中...</p>;

  const isOwner = session?.user?.email === facility.ownerEmail;

  return (
    <div style={{
      backgroundColor: "#e2ffe2",
      borderRadius: "12px",
      padding: "2rem",
      margin: "2rem auto",
      maxWidth: "800px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ color: "#f68fe1", textAlign: "center" }}>{facility.name}</h1>
      <p>📍 所在地: {facility.location}</p>
      <p>🏷️ タイプ: {facility.type || '未設定'}</p>
      <p>🐾 対応ペット: {facility.petsAllowed}</p>
      <p>✨ 特徴: {facility.features || 'なし'}</p>

      {isOwner && (
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link href={`/facilities/${id}/edit`}>
            <button style={{
              marginRight: "10px",
              backgroundColor: "#f68fe1",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer"
            }}>
              編集
            </button>
          </Link>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "#f68fe1",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            削除
          </button>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link href="/facilities">
          <button style={{
            backgroundColor: "#f68fe1",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}>
            一覧に戻る
          </button>
        </Link>
      </div>
    </div>
  );
}