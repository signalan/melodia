# MelodIA

Gera playlists no Spotify a partir de uma descrição em texto, usando a OpenAI para sugerir as músicas.

## Stack

- Frontend: React + Vite
- Backend: Node + Express
- APIs: Spotify Web API, OpenAI

## Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Variáveis em `backend/.env`:

```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
REDIRECT_URI=http://localhost
OPENAI_API_KEY=
PORT=80
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Em `frontend/.env`:

```
VITE_API_URL=http://localhost:80
```

## Credenciais

- Spotify: https://developer.spotify.com/ (criar app, copiar client id/secret, setar Redirect URI igual ao `REDIRECT_URI` do backend)
- OpenAI: https://platform.openai.com/

## Uso

1. Login com Spotify
2. Descreva a vibe / gênero / situação
3. Gerar — a playlist é criada na sua conta
