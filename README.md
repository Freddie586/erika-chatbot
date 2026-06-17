# Erika — AI Assistant by NLA

A polished FAQ chatbot with a black & gold luxury aesthetic, powered by Claude AI.

---

## Project Structure

```
erika-chatbot/
├── backend/       ← Express proxy server (keeps your API key safe)
└── frontend/      ← React + Vite chat UI
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- An [Anthropic API key](https://console.anthropic.com/)
- Accounts on [Railway](https://railway.app) (backend) and [Vercel](https://vercel.com) (frontend) — both free tiers work

---

## Local Development

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Open .env and add your ANTHROPIC_API_KEY
npm run dev
```

Backend runs at: `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# VITE_BACKEND_URL is already set to http://localhost:3001
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Deploying to Production

### Step 1 — Deploy the Backend to Railway

1. Go to [railway.app](https://railway.app) and create a new project
2. Choose **Deploy from GitHub repo** and connect your `backend/` folder
   - Or use **Empty Project → Add Service → GitHub Repo** and set the root to `backend/`
3. In Railway, go to **Variables** and add:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ALLOWED_ORIGIN=https://your-vercel-frontend-url.vercel.app
   ```
4. Railway will give you a public URL like `https://erika-backend.up.railway.app`
   — copy this for the next step.

### Step 2 — Deploy the Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Set the **Root Directory** to `frontend/`
3. Under **Environment Variables**, add:
   ```
   VITE_BACKEND_URL=https://your-railway-backend-url.up.railway.app
   ```
4. Deploy — Vercel gives you a public URL to share instantly.

---

## Sharing with Others

Once deployed, share your Vercel URL — that's it. Anyone with the link can chat with Erika directly in their browser with no login required.

---

## Customising Erika

To change Erika's personality, knowledge, or name:

- **Backend:** Edit `SYSTEM_PROMPT` in `backend/server.js`
- **Frontend:** Edit suggested questions in `frontend/src/App.jsx`
- **Styling:** Edit `frontend/src/App.css`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| AI | Anthropic Claude (claude-sonnet-4-6) |
| Hosting (backend) | Railway (recommended) |
| Hosting (frontend) | Vercel (recommended) |
