import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const UserDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/users/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        })
        .catch((error) => console.error('Error fetching user:', error));
    }
  }, [id]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{user.name}の詳細情報</h1>
      <p>Email: {user.email}</p>
      <img src={user.profileImage} alt={`${user.name}のプロフィール画像`} />

      <h2>所属グループ</h2>
      <ul>
        {user.groups && user.groups.length > 0 ? (
          user.groups.map((group, index) => <li key={index}>{group}</li>)
        ) : (
          <p>グループ情報がありません。</p>
        )}
      </ul>

      <h2>投稿</h2>
      <ul>
        {user.posts && user.posts.length > 0 ? (
          user.posts.map((post, index) => <li key={index}>{post}</li>)
        ) : (
          <p>投稿がありません。</p>
        )}
      </ul>

      <h2>登録ペット</h2>
      <ul>
        {user.pets && user.pets.length > 0 ? (
          user.pets.map((pet, index) => (
            <li key={index}>
              <strong>{pet.name}</strong> ({pet.species}, {pet.breed}, {pet.age}歳)
            </li>
          ))
        ) : (
          <p>ペットが登録されていません。</p>
        )}
      </ul>
    </div>
  );
};

export default UserDetail;