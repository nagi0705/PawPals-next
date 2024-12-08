import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const EditPet = () => {
  const { data: session } = useSession(); // ログインセッション
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // ペット情報を取得
      fetch(`/api/pets/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setForm(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError("ペット情報の取得に失敗しました。");
          setLoading(false);
        });
    }
  }, [id]);

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
      const response = await fetch(`/api/pets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        router.push("/pets"); // ペット一覧ページへリダイレクト
      } else {
        const data = await response.json();
        setError(data.error || "ペット情報の更新に失敗しました。");
      }
    } catch (err) {
      setError("サーバーエラーが発生しました。");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>ペット情報を編集</h1>
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
        <button type="submit">更新</button>
      </form>
    </div>
  );
};

export default EditPet;