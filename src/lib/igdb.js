// src/lib/igdb.js — Chama o proxy Vercel que criamos em /api/igdb.js

const PROXY = '/api/igdb';

export async function searchGames(query) {
  const res = await fetch(PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint: 'games',
      body: `search "${query}"; fields id,name,cover.url,first_release_date,genres.name,platforms.abbreviation,summary,rating,aggregated_rating; where version_parent = null; limit 8;`,
    }),
  });
  return res.json();
}

export async function getGameDetails(igdbId) {
  const res = await fetch(PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint: 'games',
      body: `fields id,name,cover.url,first_release_date,genres.name,platforms.abbreviation,summary,rating,aggregated_rating,screenshots.url,videos.video_id; where id = ${igdbId};`,
    }),
  });
  const data = await res.json();
  return data[0] || null;
}

export function coverUrl(url, size = 'cover_big') {
  if (!url) return null;
  return url.replace('t_thumb', `t_${size}`).replace('http://', 'https://');
}
