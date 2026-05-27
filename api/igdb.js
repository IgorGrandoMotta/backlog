// api/igdb.js — Vercel Serverless Function
// Faz proxy para a IGDB API, ocultando o client_secret do lado do servidor.
//
// Variáveis de ambiente necessárias no Vercel:
//   IGDB_CLIENT_ID     — Client ID do seu app no Twitch Dev
//   IGDB_CLIENT_SECRET — Client Secret do seu app no Twitch Dev

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  );
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

export default async function handler(req, res) {
  // CORS para o seu frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const token = await getAccessToken();
    const { endpoint = 'games', body } = req.body;

    const igdbRes = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body,
    });

    const igdbData = await igdbRes.json();
    return res.status(200).json(igdbData);
  } catch (err) {
    console.error('IGDB proxy error:', err);
    return res.status(500).json({ error: 'Falha ao conectar com a IGDB' });
  }
}
