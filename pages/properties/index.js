// /pages/properties/index.js
import { useState, useEffect } from 'react';
import { Client, Databases } from 'appwrite';
import Link from 'next/link'; // 追加

export default function PropertiesList() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Appwrite クライアントの初期化
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1") // Appwriteのエンドポイント
      .setProject("675183a100255c6c9a3f");         // プロジェクトID

    const databases = new Databases(client);

    async function fetchProperties() {
      try {
        // データベースID と コレクションID を直書き
        const response = await databases.listDocuments(
          "6751bd2800009a139bb8", // データベースID
          "67e6439800093f765fd9"  // コレクションID
        );
        setProperties(response.documents);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchProperties();
  }, []);

  // 検索フィルター処理
  // 家賃、所在地、可能なペット、設備などにもマッチさせる
  const filteredProperties = properties.filter(property => {
    // housename (文字列)
    const nameMatch = property.housename
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase()) || false;

    // location (文字列)
    const locationMatch = property.location
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase()) || false;

    // price (数値を文字列に変換)
    const priceMatch = String(property.price || '')
      .includes(searchQuery);

    // petsAllowed (配列) → joinして文字列化
    const petsAllowedMatch = Array.isArray(property.petsAllowed)
      ? property.petsAllowed.join(',').toLowerCase().includes(searchQuery.toLowerCase())
      : false;

    // features (配列) → joinして文字列化
    const featuresMatch = Array.isArray(property.features)
      ? property.features.join(',').toLowerCase().includes(searchQuery.toLowerCase())
      : false;

    return (
      nameMatch ||
      locationMatch ||
      priceMatch ||
      petsAllowedMatch ||
      featuresMatch
    );
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">物件一覧</h1>

      {/* 物件登録ボタンを追加 */}
      <Link href="/properties/new">
        <button className="bg-pink-500 text-white p-2 rounded mb-4">
          物件登録
        </button>
      </Link>

      <input
        type="text"
        placeholder="物件情報で検索(例: 家賃, 所在地, ペットなど)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      {error && <p className="text-red-500">Error: {error}</p>}
      <ul>
        {filteredProperties.map(property => (
          <li key={property.$id} className="border-b py-2">
            <strong>{property.housename}</strong> - {property.location} - {property.price}円
          </li>
        ))}
      </ul>
    </div>
  );
}