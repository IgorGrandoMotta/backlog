// src/pages/Dashboard.jsx
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useGames } from '../hooks/useGames';
import { useTheme, THEMES } from '../hooks/useTheme';
import { GameCard } from '../components/GameCard';
import { GameModal } from '../components/GameModal';

// ─── Constantes ───────────────────────────────────────────────────────────────
const STATUS_FILTERS = [
  { key: 'todos',      label: 'Todos' },
  { key: 'pendente',   label: 'Pendente' },
  { key: 'jogando',    label: 'Jogando' },
  { key: 'zerado',     label: 'Zerado' },
  { key: 'abandonado', label: 'Abandonado' },
  { key: 'wishlist',   label: 'Wishlist' },
];

const SORTS = [
  { key: 'recent', label: 'Mais recente' },
  { key: 'title',  label: 'Nome A–Z' },
  { key: 'rating', label: 'Melhor nota' },
  { key: 'hours',  label: 'Mais horas' },
];

const NAV_ITEMS = [
  { key: 'lista',       label: 'Minha Lista',  icon: '▤' },
  { key: 'plataformas', label: 'Plataformas',  icon: '⊞' },
  { key: 'generos',     label: 'Gêneros',      icon: '◈' },
  { key: 'wishlist',    label: 'Wishlist',      icon: '♡' },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
function SavedToast({ visible }) {
  return (
    <div style={{
      position:'fixed', bottom:28, right:28, zIndex:9999, pointerEvents:'none',
      transition:'opacity 0.3s, transform 0.3s',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)',
    }}>
      <div style={{
        background:'var(--bg2)', border:'1px solid var(--border2)', borderLeft:'4px solid var(--green)',
        borderRadius:'var(--radius)', padding:'10px 18px',
        display:'flex', alignItems:'center', gap:10, boxShadow:'var(--shadow)', minWidth:180,
      }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--green)' }}>✓ Salvo!</div>
        <div style={{ fontSize:11, color:'var(--text3)' }}>Alterações salvas.</div>
      </div>
    </div>
  );
}

// ─── Modais compartilhados ────────────────────────────────────────────────────
function Modals({ modal, handleSave, setModal, confirmDel, setConfirmDel, handleDelete }) {
  return (
    <>
      {modal && (
        <GameModal
          game={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {confirmDel && (
        <div
          onClick={() => setConfirmDel(null)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
        >
          <div onClick={e => e.stopPropagation()} style={{
            background:'var(--bg2)', border:'1px solid var(--border2)',
            borderRadius:'var(--radius-lg)', padding:28, maxWidth:360, width:'100%',
            textAlign:'center', boxShadow:'var(--shadow)',
          }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🗑️</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:18, marginBottom:8 }}>Remover jogo?</h3>
            <p style={{ fontSize:14, color:'var(--text2)', marginBottom:24 }}>Essa ação não pode ser desfeita.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={() => setConfirmDel(null)} style={{ background:'none', border:'1px solid var(--border2)', color:'var(--text2)', borderRadius:'var(--radius-btn)', padding:'9px 20px', fontSize:14, fontFamily:'var(--font-body)', cursor:'pointer' }}>
                Cancelar
              </button>
              <button onClick={() => handleDelete(confirmDel)} style={{ background:'var(--red-bg)', border:'1px solid rgba(248,113,113,0.3)', color:'var(--red)', borderRadius:'var(--radius-btn)', padding:'9px 20px', fontSize:14, fontWeight:600, fontFamily:'var(--font-body)', cursor:'pointer' }}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── ThemeSelector ────────────────────────────────────────────────────────────
function ThemeSelector({ theme, setTheme, themeOpen, setThemeOpen, light }) {
  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => setThemeOpen(o => !o)} style={{
        background: light ? 'rgba(255,255,255,0.2)' : 'var(--bg2)',
        border: `1px solid ${light ? 'rgba(255,255,255,0.3)' : themeOpen ? 'var(--border-primary)' : 'var(--border2)'}`,
        color: light ? '#fff' : 'var(--text2)',
        borderRadius:'var(--radius-btn)', padding:'5px 12px', fontSize:12,
        fontFamily:'var(--font-body)', cursor:'pointer', display:'flex', alignItems:'center', gap:6,
      }}>
        ◐ Tema
      </button>
      {themeOpen && (
        <>
          <div onClick={() => setThemeOpen(false)} style={{ position:'fixed', inset:0, zIndex:100 }} />
          <div style={{
            position:'absolute', right:0, top:'calc(100% + 6px)',
            background:'var(--bg2)', border:'1px solid var(--border2)',
            borderRadius:'var(--radius)', overflow:'hidden', zIndex:200,
            minWidth:160, boxShadow:'var(--shadow)', animation:'fadeIn 0.15s ease',
          }}>
            {THEMES.map(t => (
              <button key={t.key} onClick={() => { setTheme(t.key); setThemeOpen(false); }} style={{
                display:'block', width:'100%', textAlign:'left', padding:'10px 16px', fontSize:13,
                background: theme === t.key ? 'var(--accent-bg)' : 'transparent',
                border:'none', borderBottom:'1px solid var(--border)',
                color: theme === t.key ? 'var(--accent2)' : 'var(--text2)',
                fontFamily:'var(--font-body)', fontWeight: theme === t.key ? 600 : 400, cursor:'pointer',
              }}
                onMouseEnter={e => { if (theme !== t.key) e.currentTarget.style.background = 'var(--bg3)'; }}
                onMouseLeave={e => { if (theme !== t.key) e.currentTarget.style.background = 'transparent'; }}
              >{t.label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Aba: Plataformas ─────────────────────────────────────────────────────────
function PlatformsTab({ games, onPlatformFilter, setNav }) {
  const platforms = useMemo(() => {
    const map = {};
    games.forEach(g => {
      const p = (g.platform || 'Sem plataforma').trim();
      if (!map[p]) map[p] = [];
      map[p].push(g);
    });
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  }, [games]);

  const platformIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('pc') || n.includes('windows')) return '🖥';
    if (n.includes('ps5')) return '🎮';
    if (n.includes('ps4')) return '🎮';
    if (n.includes('ps3') || n.includes('ps2') || n.includes('ps1')) return '🕹';
    if (n.includes('xbox')) return '🎮';
    if (n.includes('switch') || n.includes('nintendo')) return '🕹';
    if (n.includes('mobile') || n.includes('ios') || n.includes('android')) return '📱';
    return '🎮';
  };

  const statusColor = (games) => {
    const zerados = games.filter(g => g.status === 'zerado').length;
    const pct = zerados / games.length;
    if (pct >= 0.7) return 'var(--green)';
    if (pct >= 0.3) return 'var(--amber)';
    return 'var(--text3)';
  };

  if (platforms.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text3)' }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🖥</div>
        <p>Adicione jogos para ver suas plataformas aqui.</p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize:13, color:'var(--text3)', marginBottom:16 }}>
        {platforms.length} plataforma{platforms.length !== 1 ? 's' : ''} · clique para filtrar
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:12 }}>
        {platforms.map(([name, platformGames]) => {
          const zerados  = platformGames.filter(g => g.status === 'zerado').length;
          const jogando  = platformGames.filter(g => g.status === 'jogando').length;
          const pendente = platformGames.filter(g => g.status === 'pendente').length;
          const avgRating = (() => {
            const vals = platformGames.flatMap(g => Object.values(g.ratings || {}).filter(v => v > 0));
            return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
          })();

          return (
            <div key={name}
              onClick={() => { onPlatformFilter(name); setNav('lista'); }}
              style={{
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:'var(--radius-lg)', padding:'16px',
                cursor:'pointer', transition:'all 0.2s',
                display:'flex', flexDirection:'column', gap:8,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:28 }}>{platformIcon(name)}</span>
                {avgRating && (
                  <span style={{ fontSize:12, fontWeight:600, color:'var(--amber)', background:'var(--amber-bg)', padding:'2px 8px', borderRadius:20 }}>
                    ★ {avgRating}
                  </span>
                )}
              </div>
              <div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, color:'var(--text)', letterSpacing:0.5 }}>{name}</div>
                <div style={{ fontSize:13, color:'var(--text3)', marginTop:2 }}>
                  {platformGames.length} jogo{platformGames.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div>
                <div style={{ display:'flex', gap:6, fontSize:11, color:'var(--text3)', marginBottom:4, flexWrap:'wrap' }}>
                  {zerados  > 0 && <span style={{ color:'var(--green)' }}>✓ {zerados} zerado{zerados !== 1 ? 's' : ''}</span>}
                  {jogando  > 0 && <span style={{ color:'var(--blue)' }}>▶ {jogando} jogando</span>}
                  {pendente > 0 && <span>⏸ {pendente} pendente{pendente !== 1 ? 's' : ''}</span>}
                </div>
                <div style={{ height:3, background:'var(--bg4)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${(zerados / platformGames.length) * 100}%`, background: statusColor(platformGames), borderRadius:2, transition:'width 0.4s ease' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Aba: Gêneros ─────────────────────────────────────────────────────────────
function GenresTab({ games, onGenreFilter, setNav }) {
  const genres = useMemo(() => {
    const map = {};
    games.forEach(g => {
      (g.genres || []).forEach(genre => {
        if (!map[genre]) map[genre] = [];
        map[genre].push(g);
      });
    });
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  }, [games]);

  const genreColor = (i) => {
    const colors = [
      'var(--accent)', 'var(--green)', 'var(--blue)', 'var(--amber)',
      'var(--red)', '#a78bfa', '#34d399', '#60a5fa',
    ];
    return colors[i % colors.length];
  };

  const genreIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('action')) return '⚔';
    if (n.includes('rpg') || n.includes('role')) return '🧙';
    if (n.includes('adventure')) return '🗺';
    if (n.includes('sport')) return '⚽';
    if (n.includes('racing')) return '🏎';
    if (n.includes('puzzle')) return '🧩';
    if (n.includes('horror')) return '👻';
    if (n.includes('shooter')) return '🔫';
    if (n.includes('strategy')) return '♟';
    if (n.includes('simulation')) return '🌐';
    if (n.includes('platform')) return '🦘';
    if (n.includes('fighting')) return '🥊';
    if (n.includes('music') || n.includes('rhythm')) return '🎵';
    return '🎮';
  };

  if (genres.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text3)' }}>
        <div style={{ fontSize:48, marginBottom:12 }}>◈</div>
        <p>Adicione jogos com gêneros via busca para ver aqui.</p>
        <p style={{ fontSize:13, marginTop:8 }}>Os gêneros são preenchidos automaticamente ao buscar um jogo.</p>
      </div>
    );
  }

  const maxCount = genres[0][1].length;

  return (
    <div>
      <p style={{ fontSize:13, color:'var(--text3)', marginBottom:16 }}>
        {genres.length} gênero{genres.length !== 1 ? 's' : ''} · clique para filtrar
      </p>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {genres.map(([genre, genreGames], i) => {
          const zerados = genreGames.filter(g => g.status === 'zerado').length;
          const color   = genreColor(i);

          return (
            <div key={genre}
              onClick={() => { onGenreFilter(genre); setNav('lista'); }}
              style={{
                background:'var(--bg2)', border:'1px solid var(--border)',
                borderRadius:'var(--radius)', padding:'12px 16px',
                cursor:'pointer', transition:'all 0.15s',
                display:'flex', alignItems:'center', gap:14,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--bg3)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)'; }}
            >
              <span style={{ fontSize:22, flexShrink:0 }}>{genreIcon(genre)}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
                  <span style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>{genre}</span>
                  <span style={{ fontSize:12, color:'var(--text3)' }}>
                    {genreGames.length} jogo{genreGames.length !== 1 ? 's' : ''}
                    {zerados > 0 && <span style={{ color:'var(--green)', marginLeft:6 }}>· {zerados} zerado{zerados !== 1 ? 's' : ''}</span>}
                  </span>
                </div>
                <div style={{ height:4, background:'var(--bg4)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${(genreGames.length / maxCount) * 100}%`, background: color, borderRadius:2, transition:'width 0.4s ease' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Aba: Wishlist ────────────────────────────────────────────────────────────
function WishlistTab({ games, onEdit, onDelete, onStatusChange }) {
  const wishlist = games.filter(g => g.status === 'wishlist');
  if (wishlist.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text3)' }}>
        <div style={{ fontSize:48, marginBottom:12 }}>♡</div>
        <p>Sua wishlist está vazia.</p>
        <p style={{ fontSize:13, marginTop:8 }}>Adicione jogos com status "Wishlist" para listá-los aqui.</p>
      </div>
    );
  }
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {wishlist.map(g => (
        <GameCard key={g.id} game={g} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT PADRÃO — dark, light, nordic
// ═══════════════════════════════════════════════════════════════════════════════
function DefaultLayout({
  user, onLogout, theme, setTheme, games, filtered, stats,
  filter, setFilter, sort, setSort, search, setSearch,
  setModal, setConfirmDel, handleStatusChange,
  themeOpen, setThemeOpen, modal, handleSave, confirmDel, handleDelete,
  toastVisible, nav, setNav, platformFilter, setPlatformFilter,
  genreFilter, setGenreFilter,
}) {
  const handlePlatformFilter = (platform) => {
    setPlatformFilter(platform);
    setFilter('todos');
    setSearch('');
  };
  const handleGenreFilter = (genre) => {
    setGenreFilter(genre);
    setFilter('todos');
    setSearch('');
  };
  const clearFilters = () => { setPlatformFilter(''); setGenreFilter(''); };

  const isNordic = theme === 'nordic';

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      <SavedToast visible={toastVisible} />

      {/* ── Sidebar ── */}
      <aside style={{
        width:220, flexShrink:0, background:'var(--bg2)',
        borderRight:'1px solid var(--border)',
        display:'flex', flexDirection:'column',
        position:'sticky', top:0, height:'100vh', overflowY:'auto',
      }}>
        {/* Logo */}
        <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:22 }}>🎮</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, letterSpacing: isNordic ? 0 : 1, color:'var(--text)' }}>
              {isNordic ? 'My Game List' : 'MY GAME LIST'}
            </span>
          </div>
        </div>

        {/* Navegação principal */}
        <nav style={{ padding:'12px 0', flex:1 }}>
          <div style={{ padding:'4px 16px 8px', fontSize:10, color:'var(--text3)', letterSpacing:0.8, textTransform:'uppercase' }}>
            Coleção
          </div>
          {NAV_ITEMS.map(item => (
            <button key={item.key} onClick={() => setNav(item.key)} style={{
              display:'flex', alignItems:'center', gap:10, width:'100%',
              padding:'9px 16px', background:'none', border:'none',
              borderLeft: nav === item.key ? '2px solid var(--accent)' : '2px solid transparent',
              color: nav === item.key ? 'var(--accent2)' : 'var(--text2)',
              fontSize:13, fontFamily:'var(--font-body)', fontWeight: nav === item.key ? 600 : 400,
              cursor:'pointer', transition:'all 0.15s', textAlign:'left',
            }}>
              <span style={{ fontSize:15, opacity:0.8 }}>{item.icon}</span>
              {item.label}
              {item.key === 'wishlist' && stats.wishlist > 0 && (
                <span style={{ marginLeft:'auto', background:'var(--amber-bg)', color:'var(--amber)', fontSize:10, padding:'1px 7px', borderRadius:20 }}>
                  {stats.wishlist}
                </span>
              )}
              {item.key === 'lista' && (
                <span style={{ marginLeft:'auto', background:'var(--bg3)', color:'var(--text3)', fontSize:10, padding:'1px 7px', borderRadius:20 }}>
                  {stats.total}
                </span>
              )}
            </button>
          ))}

          {nav === 'lista' && (
            <>
              <div style={{ padding:'16px 16px 8px', fontSize:10, color:'var(--text3)', letterSpacing:0.8, textTransform:'uppercase' }}>
                Status
              </div>
              {STATUS_FILTERS.slice(1).map(f => {
                const count = games.filter(g => g.status === f.key).length;
                if (count === 0) return null;
                return (
                  <button key={f.key} onClick={() => { setFilter(f.key); clearFilters(); }} style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    width:'100%', padding:'7px 16px', background:'none', border:'none',
                    color: filter === f.key ? 'var(--text)' : 'var(--text3)',
                    fontSize:13, fontFamily:'var(--font-body)',
                    fontWeight: filter === f.key ? 500 : 400,
                    cursor:'pointer', transition:'color 0.15s', textAlign:'left',
                  }}>
                    {f.label}
                    <span style={{
                      fontSize:10, padding:'1px 7px', borderRadius:20,
                      background: filter === f.key ? 'var(--accent-bg)' : 'var(--bg3)',
                      color: filter === f.key ? 'var(--accent2)' : 'var(--text3)',
                    }}>{count}</span>
                  </button>
                );
              })}
            </>
          )}
        </nav>

        {/* Usuário + tema */}
        <div style={{ padding:'12px 16px', borderTop:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:10 }}>
          <ThemeSelector theme={theme} setTheme={setTheme} themeOpen={themeOpen} setThemeOpen={setThemeOpen} />
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <img src={user.photoURL} alt="" width={28} height={28} style={{ borderRadius:'50%', border:'1px solid var(--border2)' }} />
            <span style={{ fontSize:13, color:'var(--text2)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {user.displayName?.split(' ')[0]}
            </span>
            <button onClick={onLogout} style={{ background:'none', border:'none', color:'var(--text3)', fontSize:12, cursor:'pointer', fontFamily:'var(--font-body)', padding:'2px 4px' }} title="Sair">
              ⏻
            </button>
          </div>
        </div>
      </aside>

      {/* ── Conteúdo principal ── */}
      <main style={{ flex:1, padding:'24px 28px', minWidth:0 }}>

        {nav === 'lista' && (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:24 }}>
              {[
                { n: stats.total,    l:'Total',    c:'var(--text)' },
                { n: stats.zerados,  l:'Zerados',  c:'var(--green)' },
                { n: stats.jogando,  l:'Jogando',  c:'var(--blue)' },
                { n: stats.horas,    l:'Horas',    c:'var(--accent2)' },
                { n: stats.wishlist, l:'Wishlist', c:'var(--amber)' },
              ].map(s => (
                <div key={s.l} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'12px 10px', textAlign:'center', boxShadow: isNordic ? 'var(--shadow)' : 'none' }}>
                  <div style={{ fontSize:22, fontWeight:700, color:s.c, fontFamily:'var(--font-display)', letterSpacing:1 }}>{s.n}</div>
                  <div style={{ fontSize:10, color:'var(--text3)', marginTop:2, letterSpacing:0.5, textTransform:'uppercase' }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14, flexWrap:'wrap' }}>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); clearFilters(); }}
                placeholder="🔍  Buscar na lista..."
                style={{ flex:1, minWidth:180 }}
              />
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ width:'auto', minWidth:140 }}>
                {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              <button onClick={() => setModal('new')} style={{
                background:'var(--accent)', border:'none', color:'#fff',
                borderRadius:'var(--radius-btn)', padding:'10px 20px',
                fontSize:14, fontWeight:600, cursor:'pointer',
                fontFamily:'var(--font-body)', letterSpacing:0.5, whiteSpace:'nowrap',
              }}>
                + Adicionar
              </button>
            </div>

            {(platformFilter || genreFilter) && (
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:14, flexWrap:'wrap' }}>
                <span style={{ fontSize:12, color:'var(--text3)' }}>Filtrado por:</span>
                {platformFilter && (
                  <span style={{ background:'var(--accent-bg)', color:'var(--accent2)', border:'1px solid var(--border-primary)', borderRadius:20, fontSize:12, padding:'3px 10px', display:'flex', alignItems:'center', gap:6 }}>
                    🖥 {platformFilter}
                    <button onClick={() => setPlatformFilter('')} style={{ background:'none', border:'none', color:'var(--accent2)', cursor:'pointer', fontSize:14, lineHeight:1, padding:0 }}>×</button>
                  </span>
                )}
                {genreFilter && (
                  <span style={{ background:'var(--accent-bg)', color:'var(--accent2)', border:'1px solid var(--border-primary)', borderRadius:20, fontSize:12, padding:'3px 10px', display:'flex', alignItems:'center', gap:6 }}>
                    ◈ {genreFilter}
                    <button onClick={() => setGenreFilter('')} style={{ background:'none', border:'none', color:'var(--accent2)', cursor:'pointer', fontSize:14, lineHeight:1, padding:0 }}>×</button>
                  </span>
                )}
                <button onClick={clearFilters} style={{ background:'none', border:'none', color:'var(--text3)', fontSize:12, cursor:'pointer', fontFamily:'var(--font-body)', textDecoration:'underline' }}>
                  Limpar
                </button>
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap: isNordic ? 12 : 10 }}>
              {filtered.length === 0
                ? (
                  <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text3)' }}>
                    <div style={{ fontSize:48, marginBottom:12 }}>😴</div>
                    <p>{search || platformFilter || genreFilter ? 'Nenhum jogo encontrado.' : 'Nada aqui ainda. Adicione um jogo!'}</p>
                  </div>
                )
                : filtered.map(g => (
                  <GameCard key={g.id} game={g} onEdit={setModal} onDelete={setConfirmDel} onStatusChange={handleStatusChange} />
                ))
              }
            </div>
          </>
        )}

        {nav === 'plataformas' && (
          <>
            <div style={{ marginBottom:20 }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, letterSpacing: isNordic ? 0 : 1, color:'var(--text)' }}>
                {isNordic ? 'Plataformas' : 'PLATAFORMAS'}
              </h2>
            </div>
            <PlatformsTab games={games} onPlatformFilter={handlePlatformFilter} setNav={setNav} />
          </>
        )}

        {nav === 'generos' && (
          <>
            <div style={{ marginBottom:20 }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, letterSpacing: isNordic ? 0 : 1, color:'var(--text)' }}>
                {isNordic ? 'Gêneros' : 'GÊNEROS'}
              </h2>
            </div>
            <GenresTab games={games} onGenreFilter={handleGenreFilter} setNav={setNav} />
          </>
        )}

        {nav === 'wishlist' && (
          <>
            <div style={{ marginBottom:20 }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, letterSpacing: isNordic ? 0 : 1, color:'var(--text)' }}>
                {isNordic ? 'Wishlist' : 'WISHLIST'}
              </h2>
            </div>
            <WishlistTab games={games} onEdit={setModal} onDelete={setConfirmDel} onStatusChange={handleStatusChange} />
          </>
        )}
      </main>

      <Modals modal={modal} handleSave={handleSave} setModal={setModal}
        confirmDel={confirmDel} setConfirmDel={setConfirmDel} handleDelete={handleDelete} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT: TERMINAL
// ═══════════════════════════════════════════════════════════════════════════════
function TerminalLayout({ user, onLogout, theme, setTheme, games, filtered, stats,
  filter, setFilter, sort, setSort, search, setSearch, setModal, setConfirmDel,
  handleStatusChange, themeOpen, setThemeOpen, modal, handleSave, confirmDel, handleDelete, toastVisible }) {
  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'0 16px 80px', fontFamily:'var(--font-body)' }}>
      <SavedToast visible={toastVisible} />
      <div style={{ borderBottom:'1px solid var(--border2)', padding:'18px 0 14px', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
          <div>
            <span style={{ color:'var(--text3)', fontSize:12 }}>root@backlog:~$ </span>
            <span style={{ color:'var(--accent)', fontSize:14, fontWeight:600 }}>my_game_list</span>
            <span style={{ color:'var(--accent)', animation:'blink 1s step-end infinite', marginLeft:3 }}>_</span>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <ThemeSelector theme={theme} setTheme={setTheme} themeOpen={themeOpen} setThemeOpen={setThemeOpen} />
            <span style={{ fontSize:12, color:'var(--text3)' }}>[{user.displayName?.split(' ')[0].toLowerCase()}]</span>
            <button onClick={onLogout} style={termBtn}>logout</button>
          </div>
        </div>
        <div style={{ display:'flex', gap:16, fontSize:12, color:'var(--text3)', flexWrap:'wrap' }}>
          {[['total',stats.total,'var(--text)'],['zerados',stats.zerados,'var(--green)'],
            ['jogando',stats.jogando,'var(--blue)'],['horas',stats.horas,'var(--accent2)'],['wishlist',stats.wishlist,'var(--amber)']
          ].map(([k,v,c])=>(
            <span key={k}>{k}=<span style={{color:c,fontWeight:600}}>{v}</span></span>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:12, alignItems:'center', flexWrap:'wrap' }}>
        <span style={{ color:'var(--text3)', fontSize:12, flexShrink:0 }}>$</span>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="grep -i 'jogo'..." style={{ flex:1, minWidth:140, background:'transparent', border:'none', borderBottom:'1px solid var(--border2)', borderRadius:0, color:'var(--text)', fontSize:13, padding:'6px 0' }} />
        <select value={sort} onChange={e=>setSort(e.target.value)}
          style={{ width:'auto', minWidth:130, background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:0, fontSize:12, letterSpacing:0.5 }}>
          {SORTS.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <button onClick={()=>setModal('new')} style={termBtn}>+ add_game</button>
      </div>
      <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
        {STATUS_FILTERS.map(f=>(
          <button key={f.key} onClick={()=>setFilter(f.key)} style={{
            background:'transparent', border:`1px solid ${filter===f.key?'var(--accent)':'var(--border)'}`,
            color: filter===f.key?'var(--accent)':'var(--text3)',
            borderRadius:0, padding:'3px 10px', fontSize:11, fontFamily:'var(--font-body)',
            letterSpacing:1, textTransform:'uppercase', cursor:'pointer',
          }}>--{f.key}{f.key!=='todos'&&games.filter(g=>g.status===f.key).length>0?` (${games.filter(g=>g.status===f.key).length})`:''}</button>
        ))}
      </div>
      <div>
        {filtered.length===0
          ? <div style={{color:'var(--text3)',fontSize:13,padding:'40px 0'}}>&gt; {search?'nenhum resultado.':'lista vazia. execute: add_game'}</div>
          : filtered.map(g=><GameCard key={g.id} game={g} onEdit={setModal} onDelete={setConfirmDel} onStatusChange={handleStatusChange}/>)
        }
      </div>
      <Modals modal={modal} handleSave={handleSave} setModal={setModal} confirmDel={confirmDel} setConfirmDel={setConfirmDel} handleDelete={handleDelete} />
    </div>
  );
}
const termBtn = { background:'transparent', border:'1px solid var(--border2)', color:'var(--text2)', borderRadius:0, padding:'4px 10px', fontSize:11, fontFamily:'var(--font-body)', letterSpacing:1, textTransform:'uppercase', cursor:'pointer' };

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT: CYBERPUNK
// ═══════════════════════════════════════════════════════════════════════════════
function CyberpunkLayout({ user, onLogout, theme, setTheme, games, filtered, stats,
  filter, setFilter, sort, setSort, search, setSearch, setModal, setConfirmDel,
  handleStatusChange, themeOpen, setThemeOpen, modal, handleSave, confirmDel, handleDelete, toastVisible }) {
  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'0 16px 80px' }}>
      <SavedToast visible={toastVisible} />
      <div style={{ background:'linear-gradient(180deg, rgba(255,0,200,0.07) 0%, transparent 100%)', borderBottom:'1px solid var(--border2)', padding:'20px 0 16px', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <div style={{ fontSize:11, color:'var(--text3)', letterSpacing:3, textTransform:'uppercase', marginBottom:2 }}>// sistema inicializado</div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:700, letterSpacing:4, textTransform:'uppercase', color:'var(--accent2)', textShadow:'0 0 20px var(--accent2), 0 0 40px rgba(200,0,255,0.3)', lineHeight:1 }}>MY_GAME_LIST</h1>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <ThemeSelector theme={theme} setTheme={setTheme} themeOpen={themeOpen} setThemeOpen={setThemeOpen} />
            <img src={user.photoURL} alt="" width={30} height={30} style={{ borderRadius:2, border:'1px solid var(--accent)', boxShadow:'0 0 8px var(--accent)' }} />
            <button onClick={onLogout} style={{ background:'transparent', border:'1px solid var(--border2)', color:'var(--text2)', borderRadius:2, padding:'5px 12px', fontSize:11, fontFamily:'var(--font-body)', letterSpacing:1.5, textTransform:'uppercase', cursor:'pointer' }}>EXIT</button>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
          {[{n:stats.total,l:'TOTAL',c:'var(--text)'},{n:stats.zerados,l:'ZERADOS',c:'var(--green)'},{n:stats.jogando,l:'JOGANDO',c:'var(--blue)'},{n:stats.horas,l:'HORAS',c:'var(--accent2)'},{n:stats.wishlist,l:'WISHLIST',c:'var(--amber)'}].map(s=>(
            <div key={s.l} style={{ background:'var(--bg2)', border:`1px solid ${s.c}22`, borderBottom:`2px solid ${s.c}`, borderRadius:2, padding:'10px 8px', textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:700, color:s.c, fontFamily:'var(--font-display)', textShadow:`0 0 10px ${s.c}` }}>{s.n}</div>
              <div style={{ fontSize:9, color:'var(--text3)', letterSpacing:2, textTransform:'uppercase', marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap', alignItems:'center' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="⟩⟩ SCAN..." style={{ flex:1, minWidth:140, background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:2, fontSize:12, letterSpacing:1 }} />
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ width:'auto', minWidth:130, background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:2, fontSize:12, letterSpacing:1 }}>
          {SORTS.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <button onClick={()=>setModal('new')} style={{ background:'transparent', border:'1px solid var(--accent)', color:'var(--accent)', borderRadius:2, padding:'8px 18px', fontSize:12, fontWeight:700, letterSpacing:2, textTransform:'uppercase', cursor:'pointer', fontFamily:'var(--font-body)' }}>+ ADD</button>
      </div>
      <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
        {STATUS_FILTERS.map(f=>(
          <button key={f.key} onClick={()=>setFilter(f.key)} style={{ background: filter===f.key?'rgba(255,0,200,0.08)':'transparent', border:`1px solid ${filter===f.key?'var(--accent)':'var(--border)'}`, color: filter===f.key?'var(--accent)':'var(--text3)', borderRadius:2, padding:'4px 12px', fontSize:11, fontFamily:'var(--font-body)', letterSpacing:1.5, textTransform:'uppercase', cursor:'pointer', boxShadow: filter===f.key?'0 0 8px rgba(255,0,200,0.2)':'none' }}>
            {f.label}{f.key!=='todos'&&games.filter(g=>g.status===f.key).length>0?` ·${games.filter(g=>g.status===f.key).length}`:''}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.length===0
          ? <div style={{color:'var(--text3)',fontSize:13,padding:'40px 0',textAlign:'center'}}>⟩⟩ NENHUM REGISTRO ENCONTRADO</div>
          : filtered.map(g=><GameCard key={g.id} game={g} onEdit={setModal} onDelete={setConfirmDel} onStatusChange={handleStatusChange}/>)
        }
      </div>
      <Modals modal={modal} handleSave={handleSave} setModal={setModal} confirmDel={confirmDel} setConfirmDel={setConfirmDel} handleDelete={handleDelete} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT: NINTENDO
// ═══════════════════════════════════════════════════════════════════════════════
function NintendoLayout({ user, onLogout, theme, setTheme, games, filtered, stats,
  filter, setFilter, sort, setSort, search, setSearch, setModal, setConfirmDel,
  handleStatusChange, themeOpen, setThemeOpen, modal, handleSave, confirmDel, handleDelete, toastVisible }) {
  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'0 16px 80px' }}>
      <SavedToast visible={toastVisible} />
      <div style={{ background:'linear-gradient(135deg, var(--accent) 0%, #ff6688 100%)', borderRadius:'0 0 24px 24px', padding:'20px 24px 22px', marginBottom:24, boxShadow:'0 6px 0 rgba(0,0,0,0.15), 0 10px 24px rgba(220,0,40,0.2)', marginLeft:-16, marginRight:-16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:36 }}>🎮</span>
            <div>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:900, color:'#fff', letterSpacing:0, lineHeight:1, textShadow:'0 2px 0 rgba(0,0,0,0.2)' }}>My Game List!</h1>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.8)', marginTop:2 }}>{user.displayName?.split(' ')[0]}&#39;s backlog</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <ThemeSelector theme={theme} setTheme={setTheme} themeOpen={themeOpen} setThemeOpen={setThemeOpen} light />
            <img src={user.photoURL} alt="" width={34} height={34} style={{ borderRadius:'50%', border:'2px solid rgba(255,255,255,0.6)' }} />
            <button onClick={onLogout} style={{ background:'rgba(255,255,255,0.2)', border:'none', color:'#fff', borderRadius:50, padding:'5px 14px', fontSize:12, fontWeight:700, cursor:'pointer' }}>Sair</button>
          </div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:20 }}>
        {[{n:stats.total,l:'Total',c:'var(--text)',bg:'var(--bg2)'},{n:stats.zerados,l:'Zerados',c:'var(--green)',bg:'var(--green-bg)'},{n:stats.jogando,l:'Jogando',c:'var(--blue)',bg:'var(--blue-bg)'},{n:stats.horas,l:'Horas',c:'var(--accent)',bg:'var(--accent-bg)'},{n:stats.wishlist,l:'Wishlist',c:'var(--amber)',bg:'var(--amber-bg)'}].map(s=>(
          <div key={s.l} style={{ background:s.bg, border:`2px solid ${s.c}33`, borderRadius:'var(--radius-lg)', padding:'12px 8px', textAlign:'center', boxShadow:'0 3px 0 rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize:22, fontWeight:900, color:s.c, fontFamily:'var(--font-display)' }}>{s.n}</div>
            <div style={{ fontSize:11, color:'var(--text3)', marginTop:2, fontWeight:700 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:12, alignItems:'center', flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Buscar jogo..." style={{ flex:1, minWidth:150, borderRadius:'var(--radius-btn)' }} />
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ width:'auto', minWidth:130, borderRadius:'var(--radius-btn)' }}>
          {SORTS.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <button onClick={()=>setModal('new')} style={{ background:'var(--accent)', border:'none', color:'#fff', borderRadius:'var(--radius-btn)', padding:'10px 20px', fontSize:13, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 0 rgba(0,0,0,0.2)', fontFamily:'var(--font-body)' }}>+ Adicionar!</button>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {STATUS_FILTERS.map(f=>(
          <button key={f.key} onClick={()=>setFilter(f.key)} style={{ background: filter===f.key?'var(--accent)':'var(--bg2)', border:`2px solid ${filter===f.key?'var(--accent)':'var(--border2)'}`, color: filter===f.key?'#fff':'var(--text2)', borderRadius:'var(--radius-btn)', padding:'5px 14px', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'var(--font-body)', boxShadow: filter===f.key?'0 3px 0 rgba(0,0,0,0.15)':'none', transition:'all 0.15s' }}>
            {f.label}{f.key!=='todos'&&games.filter(g=>g.status===f.key).length>0?` (${games.filter(g=>g.status===f.key).length})`:''}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.length===0
          ? <div style={{color:'var(--text3)',fontSize:14,padding:'60px 0',textAlign:'center',fontStyle:'italic'}}>— Nenhum registro encontrado —</div>
          : filtered.map(g=><GameCard key={g.id} game={g} onEdit={setModal} onDelete={setConfirmDel} onStatusChange={handleStatusChange}/>)
        }
      </div>
      <Modals modal={modal} handleSave={handleSave} setModal={setModal} confirmDel={confirmDel} setConfirmDel={setConfirmDel} handleDelete={handleDelete} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT: VINTAGE
// ═══════════════════════════════════════════════════════════════════════════════
function VintageLayout({ user, onLogout, theme, setTheme, games, filtered, stats,
  filter, setFilter, sort, setSort, search, setSearch, setModal, setConfirmDel,
  handleStatusChange, themeOpen, setThemeOpen, modal, handleSave, confirmDel, handleDelete, toastVisible }) {
  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'40px 24px 80px' }}>
      <SavedToast visible={toastVisible} />
      <div style={{ textAlign:'center', borderBottom:'2px solid var(--border2)', paddingBottom:20, marginBottom:24 }}>
        <div style={{ fontSize:10, letterSpacing:5, color:'var(--text3)', textTransform:'uppercase', marginBottom:8 }}>— Registro Pessoal —</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:700, color:'var(--text)', marginBottom:4 }}>My Game List</h1>
        <div style={{ fontSize:13, color:'var(--text2)', fontStyle:'italic' }}>A coleção de {user.displayName?.split(' ')[0]}</div>
        <div style={{ position:'absolute', top:20, right:24, display:'flex', gap:8, alignItems:'center' }}>
          <ThemeSelector theme={theme} setTheme={setTheme} themeOpen={themeOpen} setThemeOpen={setThemeOpen} />
          <button onClick={onLogout} style={{ background:'none', border:'1px solid var(--border2)', color:'var(--text2)', borderRadius:'var(--radius-btn)', padding:'5px 12px', fontSize:12, cursor:'pointer', fontFamily:'var(--font-body)' }}>Sair</button>
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:0, marginBottom:24, borderBottom:'1px solid var(--border)' }}>
        {[{n:stats.total,l:'Títulos'},{n:stats.zerados,l:'Zerados'},{n:stats.jogando,l:'Em andamento'},{n:stats.horas,l:'Horas totais'},{n:stats.wishlist,l:'Lista de desejos'}].map((s,i)=>(
          <div key={s.l} style={{ textAlign:'center', padding:'0 12px', borderRight:i<4?'1px solid var(--border)':'none' }}>
            <div style={{ fontSize:20, fontWeight:700, color:'var(--accent)', fontFamily:'var(--font-display)' }}>{s.n}</div>
            <div style={{ fontSize:11, color:'var(--text3)', fontStyle:'italic', marginTop:1 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:12, alignItems:'center', flexWrap:'wrap' }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar na coleção..." style={{ flex:1, minWidth:150 }} />
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ width:'auto', minWidth:140 }}>
          {SORTS.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <button onClick={()=>setModal('new')} style={{ background:'var(--accent-bg)', border:'1px solid var(--accent)', color:'var(--accent2)', borderRadius:'var(--radius-btn)', padding:'9px 20px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)' }}>+ Registrar jogo</button>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {STATUS_FILTERS.map(f=>(
          <button key={f.key} onClick={()=>setFilter(f.key)} style={{ background:'transparent', border:`1px solid ${filter===f.key?'var(--accent)':'var(--border2)'}`, color: filter===f.key?'var(--accent2)':'var(--text2)', borderRadius:'var(--radius-btn)', padding:'5px 14px', fontSize:13, fontWeight: filter===f.key?600:400, fontStyle:'italic', cursor:'pointer', fontFamily:'var(--font-body)' }}>
            {f.label}{f.key!=='todos'&&games.filter(g=>g.status===f.key).length>0?` (${games.filter(g=>g.status===f.key).length})`:''}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.length===0
          ? <div style={{color:'var(--text3)',fontSize:14,padding:'60px 0',textAlign:'center',fontStyle:'italic'}}>— Nenhum registro encontrado —</div>
          : filtered.map(g=><GameCard key={g.id} game={g} onEdit={setModal} onDelete={setConfirmDel} onStatusChange={handleStatusChange}/>)
        }
      </div>
      <Modals modal={modal} handleSave={handleSave} setModal={setModal} confirmDel={confirmDel} setConfirmDel={setConfirmDel} handleDelete={handleDelete} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
export function Dashboard({ user, onLogout }) {
  const { games, loading, addGame, updateGame, deleteGame } = useGames(user.uid);
  const { theme, setTheme } = useTheme();
  const [nav,            setNav]            = useState('lista');
  const [filter,         setFilter]         = useState('todos');
  const [sort,           setSort]           = useState('recent');
  const [search,         setSearch]         = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [genreFilter,    setGenreFilter]    = useState('');
  const [modal,          setModal]          = useState(null);
  const [confirmDel,     setConfirmDel]     = useState(null);
  const [themeOpen,      setThemeOpen]      = useState(false);
  const [toastVisible,   setToastVisible]   = useState(false);
  const [toastTimer,     setToastTimer]     = useState(null);

  const showToast = useCallback(() => {
    setToastVisible(true);
    if (toastTimer) clearTimeout(toastTimer);
    const t = setTimeout(() => setToastVisible(false), 2500);
    setToastTimer(t);
  }, [toastTimer]);

  useEffect(() => () => { if (toastTimer) clearTimeout(toastTimer); }, [toastTimer]);

  const stats = useMemo(() => ({
    total:    games.length,
    zerados:  games.filter(g => g.status === 'zerado').length,
    jogando:  games.filter(g => g.status === 'jogando').length,
    horas:    games.reduce((a, b) => a + (Number(b.hoursPlayed) || 0), 0),
    wishlist: games.filter(g => g.status === 'wishlist').length,
  }), [games]);

  const avgR = g => {
    const v = Object.values(g.ratings || {}).filter(v => v > 0);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
  };

  const filtered = useMemo(() => {
    let list = filter === 'todos' ? games : games.filter(g => g.status === filter);
    if (search)         list = list.filter(g => g.title.toLowerCase().includes(search.toLowerCase()));
    if (platformFilter) list = list.filter(g => (g.platform || '').toLowerCase() === platformFilter.toLowerCase());
    if (genreFilter)    list = list.filter(g => (g.genres || []).includes(genreFilter));
    switch (sort) {
      case 'title':  list = [...list].sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'rating': list = [...list].sort((a, b) => avgR(b) - avgR(a)); break;
      case 'hours':  list = [...list].sort((a, b) => (Number(b.hoursPlayed) || 0) - (Number(a.hoursPlayed) || 0)); break;
    }
    return list;
  }, [games, filter, sort, search, platformFilter, genreFilter]);

  const handleSave = async (form) => {
    if (modal?.id) await updateGame(modal.id, form);
    else await addGame(form);
    setModal(null);
    showToast();
  };

  const handleDelete = async (id) => { await deleteGame(id); setConfirmDel(null); };

  const handleStatusChange = async (id, status) => {
    const extra = status === 'zerado' ? { endDate: new Date().toISOString().slice(0, 10) } : {};
    await updateGame(id, { status, ...extra });
    showToast();
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
      <div style={{ width:28, height:28, border:'2px solid var(--border2)', borderTopColor:'var(--accent)', borderRadius: theme === 'terminal' ? 0 : '50%', animation:'spin 1s linear infinite' }} />
    </div>
  );

  const props = {
    user, onLogout, theme, setTheme, games, filtered, stats,
    filter, setFilter, sort, setSort, search, setSearch,
    setModal, setConfirmDel, handleStatusChange,
    themeOpen, setThemeOpen, modal, handleSave, confirmDel, handleDelete,
    toastVisible, nav, setNav, platformFilter, setPlatformFilter,
    genreFilter, setGenreFilter,
  };

  if (theme === 'terminal')  return <TerminalLayout  {...props} />;
  if (theme === 'cyberpunk') return <CyberpunkLayout {...props} />;
  if (theme === 'nintendo')  return <NintendoLayout  {...props} />;
  if (theme === 'vintage')   return <VintageLayout   {...props} />;
  return <DefaultLayout {...props} />;
}
