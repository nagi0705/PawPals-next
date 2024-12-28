import { useState, useEffect } from "react";
import { Client, Databases } from "appwrite";
import { useRouter } from "next/router";

const PetsList = () => {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // 検索クエリを保持
  const router = useRouter();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        // Appwriteクライアントを初期化
        const client = new Client()
          .setEndpoint("https://cloud.appwrite.io/v1") // Appwriteのエンドポイント
          .setProject("675183a100255c6c9a3f"); // プロジェクトID

        const databases = new Databases(client);

        // ペットデータを取得
        const response = await databases.listDocuments(
          "6751bd2800009a139bb8", // データベースID
          "67679a6600013eb8b9ed" // コレクションID
        );

        if (response) {
          setPets(response.documents); // ペットデータをセット
        } else {
          throw new Error("ペットデータの取得に失敗しました");
        }
      } catch (err) {
        setError(err.message);
        console.error("エラー:", err);
      }
    };

    fetchPets();
  }, []);

  // 検索クエリに基づいてペットをフィルタリング
  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPet = () => {
    router.push("/pets/new"); // 新規登録ページに遷移
  };

  const handleGoHome = () => {
    router.push("/top"); // トップページに遷移
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // 検索入力を更新
  };

  return (
    <div
      style={{
        padding: "2rem",
        margin: "2rem auto",
        maxWidth: "800px",
        lineHeight: "1.6",
      }}
    >
      {/* タイトルセクション */}
      <div
        style={{
          backgroundColor: "#e2ffe2", // グリーンの背景色
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ color: "#f68fe1", textAlign: "center" }}>ペット一覧</h1>
      </div>

      {/* ボタンセクション */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={handleAddPet}
          style={{
            backgroundColor: "#f68fe1",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          新しいペットを登録
        </button>
        <button
          onClick={handleGoHome}
          style={{
            backgroundColor: "#f68fe1",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          トップページに戻る
        </button>
      </div>

      {/* 検索セクション */}
      <div
        style={{
          backgroundColor: "#e2ffe2",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="検索..."
          style={{
            display: "block",
            margin: "0 auto",
            padding: "8px",
            width: "100%",
            border: "2px solid black", // 黒い縁を追加
            borderRadius: "8px",
          }}
        />
      </div>

      {/* エラー表示 */}
      {error && <p style={{ color: "red", textAlign: "center" }}>エラー: {error}</p>}

      {/* ペット一覧セクション */}
<div>
  <ul style={{ textAlign: "center", listStyle: "none", padding: 0 }}>
    {filteredPets.map((pet) => (
      <li
        key={pet.$id}
        style={{
          backgroundColor: "#e2ffe2",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ color: "#f68fe1" }}>{pet.name}</h2>
        <button
          onClick={() => router.push(`/pets/${pet.$id}`)} // ページ遷移をボタンで実現
          style={{
            backgroundColor: "#f68fe1",
            color: "white",
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          詳細を見る
        </button>
      </li>
    ))}
  </ul>
</div>
    </div>
  );
};

export default PetsList;