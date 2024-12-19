import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import CommentForm from '../../components/CommentForm';

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [likes, setLikes] = useState([]); // 投稿のいいねリスト
  const [comments, setComments] = useState([]); // コメント一覧
  const router = useRouter();
  const { id } = router.query;

  const handleLikePost = async () => {
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

  const handleLikeComment = async (commentId, isLiked) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ like: !isLiked, userId: session?.user?.id }),
      });

      if (!res.ok) {
        throw new Error('コメントへのいいね操作に失敗しました');
      }

      const updatedComment = await res.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.$id === updatedComment.$id ? updatedComment : comment
        )
      );
    } catch (error) {
      console.error('コメントいいねエラー:', error.message);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const userSession = await getSession();
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

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?postId=${id}`);
        if (!res.ok) throw new Error('コメントの取得に失敗しました');

        const data = await res.json();
        setComments(data.comments || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id, router]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>読み込み中...</p>;

  const isPostLiked = likes.includes(session?.user.id);

  return (
    <div>
      <h1>投稿詳細</h1>
      <h2>{post.content}</h2>
      <p>作成日: {new Date(post.createdAt).toLocaleString()}</p>
      <p>いいね数: {likes.length}</p>

      <button
        onClick={handleLikePost}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: isPostLiked ? 'red' : 'gray',
        }}
      >
        {isPostLiked ? '❤️' : '🤍'}
      </button>

      <CommentForm
        postId={post?.$id}
        onCommentAdded={(newComment) =>
          setComments((prev) => [...prev, newComment])
        }
        authorId={session?.user?.id}
      />

      <div style={{ marginTop: '20px' }}>
        <h3>コメント一覧</h3>
        {comments.length > 0 ? (
          comments.map((comment) => {
            const isLiked = comment.likes?.includes(session?.user?.id);

            return (
              <div key={comment.$id}>
                <p>{comment.content}</p>
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
                <div>
                  <button
                    onClick={() => handleLikeComment(comment.$id, isLiked)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      color: isLiked ? 'red' : 'gray',
                    }}
                  >
                    {isLiked ? '❤️' : '🤍'}
                  </button>
                  <span>{comment.likes?.length || 0} いいね</span>
                </div>
              </div>
            );
          })
        ) : (
          <p>コメントはまだありません。</p>
        )}
      </div>
    </div>
  );
}