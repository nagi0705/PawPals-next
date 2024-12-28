import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const PostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

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
          setComments(data);
        } else {
          console.error('コメントの取得に失敗しました');
        }
      } catch (err) {
        console.error('コメントの取得エラー:', err);
      }
    };

    fetchPost();
    fetchComments();
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

  const handleDeletePost = async () => {
    if (!confirm('この投稿を削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('投稿が削除されました');
        router.push('/posts'); // 投稿一覧に戻る
      } else {
        alert('投稿の削除に失敗しました');
      }
    } catch (err) {
      console.error('投稿削除エラー:', err);
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
        setNewComment('');
      } else {
        setCommentError('コメント投稿に失敗しました');
      }
    } catch (err) {
      setCommentError('コメント投稿中にエラーが発生しました');
    } finally {
      setCommentLoading(false);
    }
  };

  const toggleCommentLike = async (commentId) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.$id === commentId ? updatedComment : comment
          )
        );
      } else {
        alert('コメントのいいね操作に失敗しました');
      }
    } catch (err) {
      console.error('コメントのいいねエラー:', err);
      alert('コメントのいいね操作に失敗しました');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('このコメントを削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment.$id !== commentId));
      } else {
        alert('コメントの削除に失敗しました');
      }
    } catch (err) {
      console.error('コメント削除エラー:', err);
      alert('コメントの削除に失敗しました');
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!post) {
    return <p>読み込み中...</p>;
  }

  return (
    <div className="text-center">
      <br />
      <button
        onClick={() => router.push('/posts')}
        style={{
          marginLeft: '27rem',
          marginBottom: '20px',
          padding: '8px 16px',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        ← 投稿一覧に戻る
      </button>

      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {post.image ? (
        <div style={{ textAlign: 'center', margin: '20px 0'}}>
          <img
            src={post.image}
            alt={post.title}
            style={{
              marginLeft: '27rem',
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
        <p className="text-center">画像はありません</p>
      )}
      <p>いいね: {post.likes || 0}</p>
      <button onClick={toggleLike} disabled={loading}>
        {liked ? '❤️' : '🤍'}
      </button>
      {post.ownerEmail === session?.user?.email && (
        <div>
          <button onClick={() => router.push(`/posts/${id}/edit`)}>編集</button>
          <button onClick={handleDeletePost}>削除</button>
        </div>
      )}
      <br />
      <h2>コメント一覧</h2>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.$id}>
              <strong>{maskEmail(comment.ownerEmail)}:</strong> {comment.content}{' '}
              <button
                onClick={() => toggleCommentLike(comment.$id)}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#ff6347',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                {comment.likedBy?.includes(session?.user?.email) ? '❤️' : '🤍'}{' '}
                {comment.likes || 0}
              </button>
              {comment.ownerEmail === session?.user?.email && (
                <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                  <button
                    onClick={() => router.push(`/comments/${comment.$id}/edit`)}
                    style={{
                      marginRight: '5px',
                      padding: '5px 10px',
                      backgroundColor: '#0070f3',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.$id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    削除
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>コメントはまだありません</p>
      )}
      <br />
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
            padding: '0.5rem 1rem',
            backgroundColor: '#f68fe1',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0070f3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#f68fe1')}
        >
          {commentLoading ? '送信中...' : 'コメントを投稿'}
        </button>
      </form>
      {commentError && <p style={{ color: 'red' }}>{commentError}</p>}
    </div>
  );
};

export default PostDetail;