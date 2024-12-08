import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const PetsPage = () => {
  const { data: session } = useSession(); // ログイン情報を取得
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      // ログインしているユーザーのペットを取得
      const fetchPets = async () => {
        try {
          const response = await fetch(`/api/pets`);
          const data = await response.json();

          // ログインしたユーザーのペットのみ表示
          const userPets = data.filter((pet) => pet.ownerId === session.user.id);
          setPets(userPets);
        } catch (error) {
          console.error("ペットの取得エラー:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPets();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("本当に削除しますか？");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/pets/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
        alert("ペットを削除しました！");
      } else {
        alert("削除に失敗しました。");
      }
    } catch (error) {
      console.error("ペット削除エラー:", error);
      alert("削除中にエラーが発生しました。");
    }
  };

  if (!session) {
    return <p>ログインが必要です。</p>;
  }

  if (loading) {
    return <p>読み込み中...</p>;
  }

  return (
    <div>
      <h1>あなたのペット</h1>
      {pets.length > 0 ? (
        <ul>
          {pets.map((pet) => (
            <li key={pet.id}>
              <strong>{pet.name}</strong> ({pet.species}, {pet.breed}, {pet.age}歳)
              <button
                onClick={() => handleDelete(pet.id)}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>ペットが登録されていません。</p>
      )}
    </div>
  );
};

export default PetsPage;