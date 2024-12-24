import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function EditGroup() {
  const router = useRouter();
  const { id } = router.query;
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (!id) return;

    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/groups/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch group');
        }
        const data = await response.json();
        setGroup(data);
        setFormData({
          name: data.name,
          description: data.description
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/groups/${id}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('メンバー以外は編集できません');
      }

      router.push(`/groups/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!group) return <p>グループが見つかりません</p>;

  return (
    <div>
      <h1>グループを編集</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="name">グループ名:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="description">説明:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div>
          <button type="submit">更新</button>
          <Link href={`/groups/${id}`}>
            <button type="button" style={{ marginLeft: '10px' }}>キャンセル</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
