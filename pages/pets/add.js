import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const AddPet = () => {
  const { data: session } = useSession(); // ログインセッション
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      setError("ログインが必要です。");
      return;
    }

    try {
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ownerId: session.user.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "ペットの登録に失敗しました。");
      } else {
        alert("ペットを登録しました！");
        router.push("/pets"); // ペット一覧ページへリダイレクト
      }
    } catch (err) {
      setError("サーバーエラーが発生しました。");
    }
  };

  return (
    <div>
      <h1>新しいペットを登録</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ペットの名前:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>種類:</label>
          <input
            type="text"
            name="species"
            value={form.species}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>品種:</label>
          <input
            type="text"
            name="breed"
            value={form.breed}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>年齢:</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <button type="submit">登録</button>
      </form>
    </div>
  );
};

export default AddPet;