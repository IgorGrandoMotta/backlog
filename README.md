# 🎮 Backlog — Sua lista de jogos para zerar

Site pessoal para gerenciar sua backlog de jogos, com integração com a IGDB para buscar informações e capas automaticamente.

---

## ✨ Funcionalidades

- Busca de jogos via IGDB (capas, gêneros, plataformas, sinopse)
- Status: Pendente, Jogando, Zerado, Abandonado, Wishlist
- Notas por categoria: Gráfico, Jogabilidade, História, Som, Duração
- Registro de horas jogadas, datas de início e fim
- Campo de observações / review pessoal
- Avaliação de dificuldade
- Login com Google (Firebase Auth)
- Dados salvos na nuvem (Firestore) por conta de usuário
- Dark mode

---

## 🚀 Deploy no Vercel (passo a passo)

### 1. Pré-requisitos
- Conta no [GitHub](https://github.com)
- Conta no [Vercel](https://vercel.com) (gratuita)
- Conta no [Firebase](https://console.firebase.google.com) (gratuita)
- Conta no [Twitch Dev](https://dev.twitch.tv/console) (para IGDB — gratuita)

---

### 2. Configurar o Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e crie um projeto.
2. Em **Authentication → Sign-in method**, ative o provedor **Google**.
3. Em **Firestore Database**, crie um banco em modo **produção**.
4. Cole as regras de segurança abaixo em **Firestore → Regras**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

5. Em **Configurações do projeto → Seus apps**, crie um app Web e copie as credenciais.

---

### 3. Configurar a IGDB

1. Acesse [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps).
2. Clique em **Register Your Application**.
3. Preencha:
   - Name: qualquer nome
   - OAuth Redirect URLs: `http://localhost`
   - Category: Application Integration
4. Copie o **Client ID** e gere um **Client Secret**.

---

### 4. Subir para o GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create meu-backlog --public --push
# ou crie o repositório manualmente em github.com e faça o push
```

---

### 5. Deploy no Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório do GitHub.
2. Em **Environment Variables**, adicione todas as variáveis do arquivo `.env.example`:

| Variável | Onde encontrar |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase → Config do app |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase → Config do app |
| `VITE_FIREBASE_PROJECT_ID` | Firebase → Config do app |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase → Config do app |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase → Config do app |
| `VITE_FIREBASE_APP_ID` | Firebase → Config do app |
| `IGDB_CLIENT_ID` | Twitch Dev Console |
| `IGDB_CLIENT_SECRET` | Twitch Dev Console |

3. Clique em **Deploy**. O Vercel detecta o Vite automaticamente.

---

### 6. Autorizar o domínio no Firebase

Depois do deploy, o Vercel te dará uma URL (ex: `meu-backlog.vercel.app`).

1. No Firebase → **Authentication → Settings → Authorized domains**
2. Adicione a URL do Vercel.

---

## 💻 Desenvolvimento local

```bash
npm install

# Crie o arquivo de variáveis locais
cp .env.example .env.local
# Preencha .env.local com suas credenciais

npm run dev
```

Acesse `http://localhost:5173`.

---

## 🗂 Estrutura do projeto

```
backlog/
├── api/
│   └── igdb.js          # Serverless function (proxy IGDB)
├── src/
│   ├── components/
│   │   ├── GameCard.jsx      # Card de cada jogo na lista
│   │   ├── GameModal.jsx     # Modal de adicionar/editar
│   │   ├── GameSearch.jsx    # Busca IGDB com autocomplete
│   │   └── StarRating.jsx    # Componente de estrelas
│   ├── hooks/
│   │   ├── useAuth.js        # Hook de autenticação Firebase
│   │   └── useGames.js       # Hook CRUD Firestore
│   ├── lib/
│   │   ├── firebase.js       # Inicialização Firebase
│   │   └── igdb.js           # Client IGDB (chama o proxy)
│   ├── pages/
│   │   ├── Dashboard.jsx     # Página principal
│   │   └── Login.jsx         # Tela de login
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```
