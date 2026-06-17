import { useState, useRef, useEffect } from "react";
import "./App.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

const suggestedQuestions = [
  "What can you help me with?",
  "Who are you?",
  "What is NLA?",
  "Tell me something interesting",
];

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello, I'm Erika — your personal assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="page">
      <div className="glow-top" />
      <div className="glow-bottom" />

      <div className="card">
        {/* Header */}
        <div className="header">
          <div className="avatar-ring">
            <div className="avatar">E</div>
          </div>
          <div>
            <div className="name">Erika</div>
            <div className="status">
              <span className="dot" />
              Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`message-row ${m.role}`}>
              {m.role === "assistant" && <div className="small-avatar">E</div>}
              <div className={`bubble ${m.role}`}>{m.content}</div>
            </div>
          ))}

          {loading && (
            <div className="message-row assistant">
              <div className="small-avatar">E</div>
              <div className="bubble assistant">
                <div className="typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <div className="suggestions">
            {suggestedQuestions.map((q, i) => (
              <button key={i} className="suggestion-btn" onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="input-row">
          <textarea
            className="textarea"
            placeholder="Ask Erika anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <button
            className={`send-btn ${input.trim() && !loading ? "active" : "disabled"}`}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            ➤
          </button>
        </div>

        <div className="footer">Powered by NLA</div>
      </div>
    </div>
  );
}
