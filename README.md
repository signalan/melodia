# MelodIA 🎵

Um gerador de playlists inteligente que transforma ideias em música usando IA.

## Funcionalidades

- 🎯 Gera playlists personalizadas baseadas em descrições textuais
- 🎵 Integração com Spotify para criação automática de playlists
- 🤖 Powered by OpenAI GPT para sugestões inteligentes
- 🔐 Autenticação segura com Spotify

## Tecnologias

**Frontend:**
- React + Vite
- CSS moderno com animações
- Integração com Spotify Web API

**Backend:**
- Node.js + Express
- OpenAI API
- Spotify Web API
- CORS habilitado

## Como Executar

### Pré-requisitos

1. Node.js instalado
2. Contas no Spotify e OpenAI
3. Credenciais das APIs

### Configuração

1. Clone o repositório
2. Configure as variáveis de ambiente e instale as dependências:

#### Backend
```bash
cd backend
cp .env.example .env
npm install
```

Edite o arquivo `backend/.env` com suas credenciais:
```
SPOTIFY_CLIENT_ID=sua_client_id_aqui
SPOTIFY_CLIENT_SECRET=sua_client_secret_aqui
REDIRECT_URI=http://localhost
OPENAI_API_KEY=sua_api_key_aqui
PORT=80
```

#### Frontend
```bash
cd frontend
cp .env.example .env
npm install
```

Edite o arquivo `frontend/.env` apontando para a URL do backend:
```
VITE_API_URL=http://localhost:80
```

### Executar o projeto

1. **Backend** (Terminal 1):
```bash
cd backend
npm start
```

2. **Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

### Como obter as credenciais

#### Spotify API
1. Acesse o [Spotify for Developers](https://developer.spotify.com/)
2. Crie um novo app
3. Copie o Client ID e Client Secret
4. Configure o Redirect URI: `http://localhost`

#### OpenAI API
1. Acesse o [OpenAI Platform](https://platform.openai.com/)
2. Gere uma nova API Key
3. Copie a chave para o `.env`

## Como Usar

1. Acesse o aplicativo no navegador
2. Faça login com sua conta Spotify
3. Descreva o que você quer ouvir (humor, gênero, situação, etc.)
4. Clique em "Gerar Playlist"
5. Sua playlist será criada automaticamente no Spotify!

## Exemplos de Prompts

- "Músicas para estudar, calmas e instrumentais"
- "Rock dos anos 80 para malhar"
- "Músicas românticas para jantar"
- "Jazz suave para relaxar"
- "Pop brasileiro animado"

## Estrutura do Projeto

```
MelodIA/
├── frontend/           # React app
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── public/
│   ├── .env.example
│   ├── index.html
│   └── package.json
├── backend/            # Node.js API
│   ├── src/
│   │   ├── services/
│   │   │   ├── openai.js
│   │   │   └── spotify.js
│   │   ├── routes.js
│   │   └── app.js
│   ├── .env.example
│   ├── index.js
│   └── package.json
├── .gitignore
└── README.md
```

## Licença

Este é um projeto de estudo. Sinta-se livre para usar e modificar.
