import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ChatPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notMember, setNotMember] = useState(false);

  useEffect(() => {
    if (!id || !session) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/groups/${id}/messages`);
        if (response.status === 403) {
          setNotMember(true);
          return;
        }

        if (!response.ok) {
          throw new Error("メッセージの取得に失敗しました");
        }

        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id, session]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      alert("メッセージを入力してください。");
      return;
    }

    try {
      const response = await fetch(`/api/groups/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) {
        throw new Error("メッセージの送信に失敗しました");
      }

      const message = await response.json();
      setMessages([...messages, message]);
      setNewMessage("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditMessage = async (messageId, updatedContent) => {
    if (!updatedContent || !updatedContent.trim()) { // 修正部分
      alert("編集内容を入力してください。");
      return;
    }

    try {
      const response = await fetch(`/api/groups/${id}/messages`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, content: updatedContent }),
      });

      if (!response.ok) {
        throw new Error("メッセージの編集に失敗しました");
      }

      const updatedMessage = await response.json();
      setMessages(
        messages.map((msg) => (msg.$id === messageId ? updatedMessage : msg))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm("このメッセージを削除してもよろしいですか？")) return;

    try {
      const response = await fetch(`/api/groups/${id}/messages`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });

      if (!response.ok) {
        throw new Error("メッセージの削除に失敗しました");
      }

      setMessages(messages.filter((msg) => msg.$id !== messageId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (notMember) return <p>メンバー以外は閲覧できません。</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>グループチャット</h1>
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "5px",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
          marginBottom: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.$id}
              style={{
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "5px",
                backgroundColor: "#b4f2a397",
              }}
            >
              <p>
                <strong>{message.senderName}</strong>: {message.content}
              </p>
              {message.senderEmail === session.user.email && (
                <div style={{ marginTop: "5px" }}>
                  <button
                    style={{ marginRight: "5px" }}
                    onClick={() =>
                      handleEditMessage(message.$id, prompt("編集内容を入力してください", message.content))
                    }
                  >
                    編集
                  </button>
                  <button
                    style={{ color: "white" }}
                    onClick={() => handleDeleteMessage(message.$id)}
                  >
                    削除
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>まだメッセージはありません。</p>
        )}
      </div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="メッセージを入力..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "10px 20px",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          送信
        </button>
      </div>
      <div>
        <Link href={`/groups/${id}`}>
          <button
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            グループ詳細に戻る
          </button>
        </Link>
      </div>
    </div>
  );
}