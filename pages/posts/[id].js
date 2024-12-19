import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import CommentForm from '../../components/CommentForm';

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]); // コメント一覧
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
  const fetchPost = async () => {
    try {
      const userSession = await getSession();
      console.log('取得したセッション:', userSession); // デバッグ用ログ
      if (!userSession) {
        router.push('/api/auth/signin');
        return;
      }
      setSession(userSession);

      const res = await fetch(`/api/posts/${id}`);
      if (!res.ok) throw new Error('投稿データの取得に失敗しました');

      const data = await res.json();
      setPost(data);
      setLikes(data.likes || []);
    } catch (err) {
      setError(err.message);
    }
  };

  if (id) {
    fetchPost();
  }
}, [id, router]);

  const handleLike = async () => {
    try {
      const method = likes.includes(session.user.id) ? 'DELETE' : 'POST';
      const res = await fetch(`/api/posts/${id}/like`, { method });
      if (!res.ok) throw new Error('いいねの操作に失敗しました');

      const data = await res.json();
      setLikes(data.likes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = () => {
    router.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('本当にこの投稿を削除しますか？')) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('投稿の削除に失敗しました');

      alert('投稿を削除しました');
      router.push('/posts');
    } catch (err) {
      console.error(err);
      alert('エラーが発生しました');
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>読み込み中...</p>;

  const isOwner = session?.user.id === post.userId;
  const isLiked = likes.includes(session?.user.id);

  return (
    <div>
      <h1>投稿詳細</h1>
      <h2>{post.content}</h2>
      {isOwner && <p>ユーザー名: {post.userName}</p>}
      <p>作成日: {new Date(post.createdAt).toLocaleString()}</p>
      <p>いいね数: {likes.length}</p>

      <button
        onClick={handleLike}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: isLiked ? 'red' : 'gray',
        }}
      >
        {isLiked ? '❤️' : '🤍'}
      </button>

      {isOwner && (
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleEdit} style={{ marginRight: '10px' }}>
            編集
          </button>
          <button onClick={handleDelete} style={{ color: 'red' }}>
            削除
          </button>
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => router.push('/posts')} style={{ marginBottom: '20px' }}>
          投稿一覧に戻る
        </button>
      </div>

      {/* コメントフォーム */}
        <CommentForm 
          postId={post?.$id} 
          onCommentAdded={handleCommentAdded} 
          authorId={session?.user?.id} // authorId を渡す
        />
        {/* コメント一覧 */}
      <div style={{ marginTop: '20px' }}>
        <h3>コメント一覧</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.$id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p>{comment.content}</p>
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>コメントはまだありません。</p>
        )}
      </div>
    </div>
  );
}