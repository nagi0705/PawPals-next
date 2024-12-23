import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const PostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log('取得した投稿データ:', data);
          setPost(data);

          if (data.likedBy?.includes(session?.user?.email)) {
            setLiked(true);
          }
        } else {
          setError('投稿の取得に失敗しました');
        }
      } catch (err) {
        setError('投稿の取得に失敗しました');
      }
    };

    fetchPost();
  }, [id, session]);

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPost(updatedPost);
        setLiked(!liked);
      } else {
        alert('いいね操作に失敗しました');
      }
    } catch (err) {
      alert('いいね操作に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm('この投稿を削除してもよろしいですか？');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('投稿を削除しました');
        router.push('/posts');
      } else {
        alert('投稿の削除に失敗しました');
      }
    } catch (err) {
      alert('投稿の削除中にエラーが発生しました');
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!post) {
    return <p>読み込み中...</p>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {post.image ? (
        <img src={post.image} alt={post.title} style={{ maxWidth: '100%' }} />
      ) : (
        <p>画像はありません</p>
      )}
      <p>いいね: {post.likes || 0}</p>
      <button onClick={toggleLike} disabled={loading}>
        {liked ? '❤️' : '🤍'}
      </button>
      {post.ownerEmail === session?.user?.email && (
        <div>
          <button onClick={() => router.push(`/posts/${id}/edit`)}>編集</button>
          <button onClick={handleDelete}>削除</button>
        </div>
      )}
    </div>
  );
};

export default PostDetail;