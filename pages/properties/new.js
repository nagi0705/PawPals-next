// /pages/properties/new.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Client, Databases } from 'appwrite';

export default function NewProperty() {
  const router = useRouter();
  const [housename, setHousename] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [petsAllowed, setPetsAllowed] = useState('');
  const [features, setFeatures] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 入力された値をオブジェクトにまとめる
      const data = {
        housename,
        location,
        price: parseFloat(price), // 数値に変換
        // カンマ区切りの文字列を配列に変換（例: "犬, 猫" -> ["犬", "猫"]）
        petsAllowed: petsAllowed ? petsAllowed.split(',').map(item => item.trim()) : [],
        features: features ? features.split(',').map(item => item.trim()) : [],
        ownerEmail: 'example@example.com', // 本来は認証情報から取得
        favoritesCount: 0,
        createdAt: new Date().toISOString() // ← 追加
      };

      // Appwrite クライアントの初期化（直打ちの場合）
      const client = new Client()
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject("675183a100255c6c9a3f");
      const databases = new Databases(client);

      // 新規ドキュメント作成
      await databases.createDocument(
        "6751bd2800009a139bb8", // データベースID
        "67e6439800093f765fd9", // コレクションID (housename が必須になっているほう)
        "unique()",
        data
        );

      // 登録完了後、一覧ページへリダイレクト
      router.push('/properties');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">新規物件登録</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="物件名(例: ○○マンションなど)"
          value={housename}
          onChange={(e) => setHousename(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="所在地(例: 東京都千代田区永田町1-7-1など。。。)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="家賃(半角数字で入力してください)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="可能なペットと頭数(例: 犬・猫合わせて2頭まで, 猫NGなど。。。)"
          value={petsAllowed}
          onChange={(e) => setPetsAllowed(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          placeholder="設備 (例: 中庭ドックラン付き, 防臭床,など。。。なしの場合は「なし」と入力してください)"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
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
            width: '100%',
          }}
        >
          {loading ? '登録中...' : '登録'}
        </button>
      </form>

      {/* 戻るボタン */}
      <button
        type="button"
        onClick={() => router.push('/properties')}
        style={{
          backgroundColor: '#6c757d',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          width: '100%',
          marginTop: '1rem',
        }}
      >
        戻る
      </button>
    </div>
  );
}