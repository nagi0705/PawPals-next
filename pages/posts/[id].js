import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const PostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // コメントを保存
  const [newComment, setNewComment] = useState(''); // 新しいコメント
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

  // メールアドレスを伏せ字に変換する関数
  const maskEmail = (email) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) {
      return `${localPart[0]}*****@${domain}`;
    }
    return `${localPart.slice(0, 3)}*****@${domain}`;
  };

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (response.ok) {
          const data = await response.json();
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

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${id}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data); // コメントを保存
        } else {
          console.error('コメントの取得に失敗しました');
        }
      } catch (err) {
        console.error('コメントの取得エラー:', err);
      }
    };

    fetchPost();
    fetchComments(); // コメントの取得
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    setCommentError(null);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: id,
          content: newComment,
          ownerEmail: session.user.email,
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setComments((prevComments) => [...prevComments, newCommentData.comment]);
        setNewComment(''); // フォームをリセット
      } else {
        setCommentError('コメント投稿に失敗しました');
      }
    } catch (err) {
      setCommentError('コメント投稿中にエラーが発生しました');
    } finally {
      setCommentLoading(false);
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
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <img
            src={post.image}
            alt={post.title}
            style={{
              maxWidth: '500px',
              maxHeight: '300px',
              width: 'auto',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
        </div>
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
      <p>※画像は任意投稿なので、変更したい場合は新しく投稿し直してください😣</p>

      <h2>コメント一覧</h2>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.$id}>
              <strong>{maskEmail(comment.ownerEmail)}:</strong> {comment.content}
            </li>
          ))}
        </ul>
      ) : (
        <p>コメントはまだありません</p>
      )}

      <h2>コメントを投稿</h2>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="3"
          placeholder="コメントを入力"
          style={{
            width: '100%',
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
          }}
        />
        <button
          type="submit"
          disabled={commentLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {commentLoading ? '送信中...' : 'コメントを投稿'}
        </button>
      </form>
      {commentError && <p style={{ color: 'red' }}>{commentError}</p>}

      <button
        onClick={() => router.push('/posts')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        一覧に戻る
      </button>
    </div>
  );
};

export default PostDetail;