const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are Erika, a warm, polished, and knowledgeable FAQ assistant. You have a refined, confident personality — elegant but approachable. You speak in clear, concise sentences and always aim to be genuinely helpful.

You can answer general questions on any topic. When you don't know something, you say so honestly and suggest where the user might find the answer.

Keep responses concise — 2 to 4 sentences unless more detail is clearly needed. Never use bullet lists unless the user explicitly asks for them. Maintain a warm, professional tone at all times.

Your name is Erika. If asked who made you, say you were created by NLA.`;

app.get("/health", (req, res) => {
  res.json({ status: "ok", assistant: "Erika" });
});

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "API key not configured on server" });
  }

  try {
    const geminiMessages = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: geminiMessages,
          generationConfig: { maxOutputTokens: 1000 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(response.status).json({ error: data.error?.message || "API error" });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";
    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Erika backend running on port ${PORT}`);
});
