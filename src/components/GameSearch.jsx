// src/components/GameSearch.jsx
import { useState, useRef, useEffect } from 'react';
import { searchGames, coverUrl } from '../lib/igdb';

export function GameSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const search = (val) => {
    setQuery(val);
    clearTimeout(timer.current);
    if (val.length < 2) { setResults([]); setOpen(false); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchGames(val);
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch { setResults([]); }
      setLoading(false);
    }, 400);
  };

  const pick = (game) => {
    onSelect(game);
    setQuery(game.name);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          value={query}
          onChange={(e) => search(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Buscar jogo na IGDB..."
          autoComplete="off"
        />
        {loading && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', animation:'spin 1s linear infinite' }}>
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      {open && results.length > 0 && (
        <div style={{
          position:'absolute', top:'calc(100% + 6px)', left:0, right:0,
          background:'var(--bg3)', border:'1px solid var(--border2)',
          borderRadius:'var(--radius)', zIndex:100, maxHeight:340, overflowY:'auto',
          boxShadow:'var(--shadow)'
        }}>
          {results.map((g) => (
            <div
              key={g.id}
              onClick={() => pick(g)}
              style={{
                display:'flex', alignItems:'center', gap:12, padding:'10px 14px',
                cursor:'pointer', borderBottom:'1px solid var(--border)',
                transition:'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg4)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {g.cover?.url
                ? <img src={coverUrl(g.cover.url, 'cover_small')} alt="" width={32} height={42}
                    style={{ borderRadius:4, objectFit:'cover', flexShrink:0 }} />
                : <div style={{ width:32, height:42, background:'var(--bg4)', borderRadius:4, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🎮</div>
              }
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:500, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{g.name}</div>
                <div style={{ fontSize:12, color:'var(--text2)' }}>
                  {g.first_release_date
                    ? new Date(g.first_release_date * 1000).getFullYear()
                    : ''}
                  {g.platforms?.length ? ' · ' + g.platforms.slice(0,3).map(p=>p.abbreviation).join(', ') : ''}
                  {g.genres?.length ? ' · ' + g.genres[0].name : ''}
                </div>
              </div>
              {g.aggregated_rating && (
                <div style={{
                  marginLeft:'auto', flexShrink:0, fontSize:12, fontWeight:600,
                  color:'var(--amber)', background:'var(--amber-bg)',
                  padding:'2px 8px', borderRadius:6
                }}>
                  {Math.round(g.aggregated_rating)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
