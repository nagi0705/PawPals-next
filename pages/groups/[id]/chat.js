import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ChatPage() {
  const router = useRouter();
  const { id } = router.query;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/groups/${id}/messages`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("メッセージの取得に失敗しました。");
        }

        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMessages();
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      alert("メッセージを入力してください。");
      return;
    }

    try {
      const response = await fetch(`/api/groups/${id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) {
        throw new Error("メッセージの送信に失敗しました。");
      }

      const message = await response.json();
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage("");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>グループチャット</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.$id} style={{ marginBottom: "10px" }}>
              <p>
                <strong>{message.senderEmail}</strong>: {message.content}
              </p>
            </div>
          ))
        ) : (
          <p>まだメッセージはありません。</p>
        )}
      </div>
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="メッセージを入力"
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleSendMessage}>送信</button>
      </div>
    </div>
  );
}