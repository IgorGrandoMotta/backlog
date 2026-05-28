// src/lib/rawg.js
// RAWG.io — API gratuita, +500k jogos, cobre PC/console/mobile
// Cadastre-se em https://rawg.io/apidocs para obter sua chave gratuita
// Depois adicione no .env.local: VITE_RAWG_KEY=sua_chave_aqui

const KEY = import.meta.env.VITE_RAWG_KEY || '';
const BASE = 'https://api.rawg.io/api';

export async function searchGames(query) {
  if (!query || query.length < 2) return [];
  try {
    const url = `${BASE}/games?search=${encodeURIComponent(query)}&key=${KEY}&page_size=8&search_precise=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('RAWG error');
    const data = await res.json();
    return (data.results || []).map(normalizeGame);
  } catch (err) {
    console.error('RAWG search error:', err);
    return [];
  }
}

export async function getGameDetails(rawgId) {
  try {
    const res = await fetch(`${BASE}/games/${rawgId}?key=${KEY}`);
    if (!res.ok) throw new Error('RAWG error');
    const data = await res.json();
    return normalizeGame(data);
  } catch {
    return null;
  }
}

// Normaliza a resposta da RAWG para o formato interno do site
function normalizeGame(g) {
  // Extrai sigla da plataforma principal
  const platformMap = {
    'pc': 'PC', 'playstation4': 'PS4', 'playstation5': 'PS5',
    'playstation3': 'PS3', 'playstation2': 'PS2',
    'xbox-one': 'XOne', 'xbox-series-x': 'XSX', 'xbox360': 'X360',
    'nintendo-switch': 'Switch', 'ios': 'iOS', 'android': 'Android',
    'nintendo-3ds': '3DS', 'wii-u': 'Wii U', 'wii': 'Wii',
  };

  const platforms = (g.platforms || []).map(p => {
    const slug = p.platform?.slug || '';
    return platformMap[slug] || p.platform?.name || slug;
  });

  const genres = (g.genres || []).map(gn => gn.name);

  // RAWG usa background_image como capa
  const cover = g.background_image || null;

  return {
    // campos internos do site
    id:           g.id,
    name:         g.name,
    coverUrl:     cover,
    genres,
    platforms,
    platformAbbr: platforms[0] || '',
    summary:      g.description_raw?.slice(0, 400) || '',
    // rating normalizado de 0-5
    aggregated_rating: g.rating ? (g.rating / 5) * 100 : null,
    metacritic:   g.metacritic || null,
    released:     g.released || null,
    rawgId:       g.id,
    // mantém compatibilidade com código que usa cover.url (IGDB)
    cover: cover ? { url: cover } : null,
    first_release_date: g.released ? new Date(g.released).getTime() / 1000 : null,
  };
}

// coverUrl mantido para compatibilidade — RAWG já retorna URL direto
export function coverUrl(url) {
  return url || null;
}
