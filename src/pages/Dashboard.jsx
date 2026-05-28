// src/pages/Dashboard.jsx
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useGames } from '../hooks/useGames';
import { useTheme, THEMES } from '../hooks/useTheme';
import { GameCard } from '../components/GameCard';
import { GameModal } from '../components/GameModal';

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
  { key: 'lista',       label: 'Minha Lista', icon: '▤' },
  { key: 'plataformas', label: 'Plataformas', icon: '⊞' },
  { key: 'generos',     label: 'Gêneros',     icon: '◈' },
  { key: 'wishlist',    label: 'Wishlist',     icon: '♡' },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
function SavedToast({ visible }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999, pointerEvents: 'none',
      transition: 'opacity 0.3s, transform 0.3s',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)',
    }}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)', borderLeft: '4px solid var(--green)',
        borderRadius: 'var(--radius)', padding: '10px 18px',
        display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--shadow)', minWidth: 180,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>✓ Salvo!</div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>Alterações salvas.</div>
      </div>
    </div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function ConfirmDeleteModal({ onConfirm, onCancel }) {
  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        borderRadius: 'var(--radius-lg)', padding: 28, maxWidth: 360, width: '100%',
        textAlign: 'center', boxShadow: 'var(--shadow)',
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 8 }}>Remover jogo?</h3>
        <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24 }}>Essa ação não pode ser desfeita.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={onCancel} style={{ background: 'none', border: '1px solid var(--border2)', color: 'var(--text2)', borderRadius: 'var(--radius-btn)', padding: '9px 20px', fontSize: 14, fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
            Cancelar
          </button>
          <button onClick={onConfirm} style={{ background: 'var(--red-bg)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--red)', borderRadius: 'var(--radius-btn)', padding: '9px 20px', fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer' }}>
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ThemeSelector ────────────────────────────────────────────────────────────
function ThemeSelector({ theme, setTheme, themeOpen, setThemeOpen }) {
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setThemeOpen(o => !o)}
        style={{
          background: themeOpen ? 'var(--accent-bg)' : 'var(--bg3)',
          border: `1px solid ${themeOpen ? 'var(--border-primary)' : 'var(--border2)'}`,
          color: themeOpen ? 'var(--accent2)' : 'var(--text3)',
          borderRadius: 'var(--radius-btn)', padding: '5px 12px', fontSize: 11,
          fontFamily: 'var(--font-body)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, width: '100%',
          letterSpacing: 0.5,
        }}
      >
        <span style={{ fontSize: 13 }}>◐</span>
        <span style={{ flex: 1, textAlign: 'left' }}>Tema</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>{THEMES.find(t => t.key === theme)?.label || ''}</span>
      </button>
      {themeOpen && (
        <>
          <div onClick={() => setThemeOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100 }} />
          <div style={{
            position: 'absolute', left: 0, top: 'calc(100% + 6px)',
            background: 'var(--bg2)', border: '1px solid var(--border2)',
            borderRadius: 'var(--radius)', overflow: 'hidden', zIndex: 200,
            minWidth: '100%', boxShadow: 'var(--shadow)',
          }}>
            {THEMES.map(t => (
              <button
                key={t.key}
                onClick={() => { setTheme(t.key); setThemeOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '9px 14px', fontSize: 12,
                  background: theme === t.key ? 'var(--accent-bg)' : 'transparent',
                  border: 'none', borderBottom: '1px solid var(--border)',
                  color: theme === t.key ? 'var(--accent2)' : 'var(--text2)',
                  fontFamily: 'var(--font-body)', fontWeight: theme === t.key ? 600 : 400,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { if (theme !== t.key) e.currentTarget.style.background = 'var(--bg3)'; }}
                onMouseLeave={e => { if (theme !== t.key) e.currentTarget.style.background = 'transparent'; }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Aba: Plataformas ─────────────────────────────────────────────────────────
function PlatformsTab({ games, onPlatformFilter }) {
  const platforms = useMemo(() => {
    const map = {};
    games.forEach(g => {
      const p = (g.platform || 'Sem plataforma').trim();
      if (!map[p]) map[p] = [];
      map[p].push(g);
    });
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  }, [games]);

  const platformIcon = name => {
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

  const barColor = gs => {
    const pct = gs.filter(g => g.status === 'zerado').length / gs.length;
    if (pct >= 0.7) return 'var(--green)';
    if (pct >= 0.3) return 'var(--amber)';
    return 'var(--text3)';
  };

  if (platforms.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text3)' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🖥</div>
      <p>Adicione jogos para ver suas plataformas aqui.</p>
    </div>
  );

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
        {platforms.length} plataforma{platforms.length !== 1 ? 's' : ''} · clique para filtrar
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {platforms.map(([name, pg]) => {
          const zerados  = pg.filter(g => g.status === 'zerado').length;
          const jogando  = pg.filter(g => g.status === 'jogando').length;
          const pendente = pg.filter(g => g.status === 'pendente').length;
          const vals = pg.flatMap(g => Object.values(g.ratings || {}).filter(v => v > 0));
          const avgRating = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
          return (
            <div
              key={name}
              onClick={() => onPlatformFilter(name)}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 8 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 28 }}>{platformIcon(name)}</span>
                {avgRating && <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber)', background: 'var(--amber-bg)', padding: '2px 8px', borderRadius: 20 }}>★ {avgRating}</span>}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{name}</div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{pg.length} jogo{pg.length !== 1 ? 's' : ''}</div>
              </div>
              <div>
                <div style={{ display: 'flex', gap: 6, fontSize: 11, color: 'var(--text3)', marginBottom: 4, flexWrap: 'wrap' }}>
                  {zerados  > 0 && <span style={{ color: 'var(--green)' }}>✓ {zerados}</span>}
                  {jogando  > 0 && <span style={{ color: 'var(--blue)' }}>▶ {jogando}</span>}
                  {pendente > 0 && <span>⏸ {pendente}</span>}
                </div>
                <div style={{ height: 3, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(zerados / pg.length) * 100}%`, background: barColor(pg), borderRadius: 2 }} />
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
function GenresTab({ games, onGenreFilter }) {
  const genres = useMemo(() => {
    const map = {};
    games.forEach(g => (g.genres || []).forEach(genre => {
      if (!map[genre]) map[genre] = [];
      map[genre].push(g);
    }));
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  }, [games]);

  const COLORS = ['var(--accent)', 'var(--green)', 'var(--blue)', 'var(--amber)', 'var(--red)', '#a78bfa', '#34d399', '#60a5fa'];

  const genreIcon = name => {
    const n = name.toLowerCase();
    if (n.includes('action'))               return '⚔';
    if (n.includes('rpg') || n.includes('role')) return '🧙';
    if (n.includes('adventure'))            return '🗺';
    if (n.includes('sport'))               return '⚽';
    if (n.includes('racing'))              return '🏎';
    if (n.includes('puzzle'))              return '🧩';
    if (n.includes('horror'))              return '👻';
    if (n.includes('shooter'))             return '🔫';
    if (n.includes('strategy'))            return '♟';
    if (n.includes('simulation'))          return '🌐';
    if (n.includes('platform'))            return '🦘';
    if (n.includes('fighting'))            return '🥊';
    if (n.includes('music') || n.includes('rhythm')) return '🎵';
    return '🎮';
  };

  if (genres.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text3)' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>◈</div>
      <p>Adicione jogos com gêneros via busca para ver aqui.</p>
      <p style={{ fontSize: 13, marginTop: 8 }}>Os gêneros são preenchidos automaticamente ao buscar um jogo.</p>
    </div>
  );

  const maxCount = genres[0][1].length;

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
        {genres.length} gênero{genres.length !== 1 ? 's' : ''} · clique para filtrar
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {genres.map(([genre, gg], i) => {
          const zerados = gg.filter(g => g.status === 'zerado').length;
          return (
            <div
              key={genre}
              onClick={() => onGenreFilter(genre)}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 16px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 14 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--bg3)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)'; }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{genreIcon(genre)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{genre}</span>
                  <span style={{ fontSize: 12, color: 'var(--text3)' }}>
                    {gg.length} jogo{gg.length !== 1 ? 's' : ''}
                    {zerados > 0 && <span style={{ color: 'var(--green)', marginLeft: 6 }}>· {zerados} zerado{zerados !== 1 ? 's' : ''}</span>}
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(gg.length / maxCount) * 100}%`, background: COLORS[i % COLORS.length], borderRadius: 2 }} />
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
  if (wishlist.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text3)' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>♡</div>
      <p>Sua wishlist está vazia.</p>
      <p style={{ fontSize: 13, marginTop: 8 }}>Adicione jogos com status "Wishlist" para listá-los aqui.</p>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {wishlist.map(g => <GameCard key={g.id} game={g} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT PRINCIPAL — sidebar unificada para todos os temas
// ═══════════════════════════════════════════════════════════════════════════════
function Layout({
  user, onLogout, theme, setTheme, games, filtered, stats,
  filter, setFilter, sort, setSort, search, setSearch,
  setModal, setConfirmDel, handleStatusChange,
  themeOpen, setThemeOpen, modal, handleSave, confirmDel, handleDelete,
  toastVisible, nav, setNav, platformFilter, setPlatformFilter, genreFilter, setGenreFilter,
}) {
  const clearFilters = () => { setPlatformFilter(''); setGenreFilter(''); };

  const handlePlatformFilter = p => { setPlatformFilter(p); setGenreFilter(''); setFilter('todos'); setSearch(''); setNav('lista'); };
  const handleGenreFilter    = g => { setGenreFilter(g);    setPlatformFilter(''); setFilter('todos'); setSearch(''); setNav('lista'); };

  // Personalização visual por tema — tudo dentro da mesma estrutura de sidebar
  const isTerminal  = theme === 'terminal';
  const isCyberpunk = theme === 'cyberpunk';
  const isNintendo  = theme === 'nintendo';
  const isVintage   = theme === 'vintage';
  const isNordic    = theme === 'nordic';
  const isSpecial   = isTerminal || isCyberpunk || isNintendo || isVintage;

  // Logo da sidebar varia por tema
  const sidebarLogo = () => {
    if (isTerminal)  return <><span style={{ color: 'var(--text3)', fontSize: 11 }}>root@</span><span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>BACKLOG</span></>;
    if (isCyberpunk) return <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, letterSpacing: 3, color: 'var(--accent2)', textShadow: '0 0 10px var(--accent2)' }}>MY_GAME_LIST</span>;
    if (isNintendo)  return <><span style={{ fontSize: 18 }}>🎮</span><span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 900, color: 'var(--accent)' }}>My Game List!</span></>;
    if (isVintage)   return <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, fontStyle: 'italic', color: 'var(--text)' }}>My Game List</span>;
    if (isNordic)    return <><span style={{ fontSize: 18 }}>🎮</span><span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>My Game List</span></>;
    // dark / light
    return <><span style={{ fontSize: 18 }}>🎮</span><span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, letterSpacing: 1, color: 'var(--text)' }}>MY GAME LIST</span></>;
  };

  // Título da seção principal
  const sectionTitle = label => {
    if (isTerminal)  return <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text3)', letterSpacing: 1 }}>$ {label.toLowerCase()}</span>;
    if (isCyberpunk) return <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: 3, color: 'var(--accent2)', textTransform: 'uppercase', textShadow: '0 0 10px var(--accent2)' }}>{label}</span>;
    if (isNintendo)  return <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: 'var(--accent)' }}>{label}!</span>;
    if (isVintage)   return <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontStyle: 'italic', color: 'var(--text)' }}>— {label} —</span>;
    if (isNordic)    return <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{label}</span>;
    return <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: 1, color: 'var(--text)', textTransform: 'uppercase' }}>{label}</span>;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg2)' }}>
      <SavedToast visible={toastVisible} />

      {/* ══ SIDEBAR ══ */}
      <aside style={{
        width: 210, flexShrink: 0,
        background: isCyberpunk ? 'rgba(10,0,20,0.95)' : 'var(--bg)',
        borderRight: `1px solid ${isCyberpunk ? 'rgba(200,0,255,0.2)' : 'var(--border)'}`,
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
      }}>

        {/* Logo */}
        <div style={{
          padding: '16px 14px 12px',
          borderBottom: `1px solid ${isCyberpunk ? 'rgba(200,0,255,0.2)' : 'var(--border)'}`,
          background: isNintendo ? 'linear-gradient(135deg, var(--accent) 0%, #ff6688 100%)' : 'transparent',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'nowrap' }}>
            {sidebarLogo()}
          </div>
          <ThemeSelector theme={theme} setTheme={setTheme} themeOpen={themeOpen} setThemeOpen={setThemeOpen} />
        </div>

        {/* Navegação */}
        <nav style={{ padding: '10px 0', flex: 1 }}>
          <div style={{ padding: '4px 14px 6px', fontSize: 10, color: 'var(--text3)', letterSpacing: 0.8, textTransform: 'uppercase' }}>
            {isTerminal ? '# coleção' : 'Coleção'}
          </div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => setNav(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '9px 14px', background: 'none', border: 'none',
                borderLeft: nav === item.key
                  ? `2px solid ${isCyberpunk ? 'var(--accent)' : isNintendo ? '#fff' : 'var(--accent)'}`
                  : '2px solid transparent',
                color: nav === item.key
                  ? (isNintendo ? '#fff' : 'var(--accent2)')
                  : 'var(--text2)',
                fontSize: 13, fontFamily: 'var(--font-body)',
                fontWeight: nav === item.key ? 600 : 400,
                cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                textShadow: nav === item.key && isCyberpunk ? '0 0 8px var(--accent)' : 'none',
              }}
            >
              <span style={{ fontSize: 14, opacity: 0.8 }}>{item.icon}</span>
              {item.label}
              {item.key === 'wishlist' && stats.wishlist > 0 && (
                <span style={{ marginLeft: 'auto', background: 'var(--amber-bg)', color: 'var(--amber)', fontSize: 10, padding: '1px 7px', borderRadius: 20 }}>
                  {stats.wishlist}
                </span>
              )}
              {item.key === 'lista' && (
                <span style={{ marginLeft: 'auto', background: 'var(--bg3)', color: 'var(--text3)', fontSize: 10, padding: '1px 7px', borderRadius: 20 }}>
                  {stats.total}
                </span>
              )}
            </button>
          ))}

          {nav === 'lista' && (
            <>
              <div style={{ padding: '14px 14px 6px', fontSize: 10, color: 'var(--text3)', letterSpacing: 0.8, textTransform: 'uppercase' }}>
                {isTerminal ? '# status' : 'Status'}
              </div>
              {STATUS_FILTERS.slice(1).map(f => {
                const count = games.filter(g => g.status === f.key).length;
                if (count === 0) return null;
                return (
                  <button
                    key={f.key}
                    onClick={() => { setFilter(f.key); clearFilters(); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '7px 14px', background: 'none', border: 'none',
                      color: filter === f.key ? 'var(--text)' : 'var(--text3)',
                      fontSize: 13, fontFamily: 'var(--font-body)',
                      fontWeight: filter === f.key ? 500 : 400,
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    {f.label}
                    <span style={{
                      fontSize: 10, padding: '1px 7px', borderRadius: 20,
                      background: filter === f.key ? 'var(--accent-bg)' : 'var(--bg3)',
                      color: filter === f.key ? 'var(--accent2)' : 'var(--text3)',
                    }}>{count}</span>
                  </button>
                );
              })}
            </>
          )}
        </nav>

        {/* Usuário */}
        <div style={{
          padding: '10px 14px 14px',
          borderTop: `1px solid ${isCyberpunk ? 'rgba(200,0,255,0.15)' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <img src={user.photoURL} alt="" width={26} height={26} style={{ borderRadius: '50%', border: '1px solid var(--border2)', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: 'var(--text2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.displayName?.split(' ')[0]}
          </span>
          <button onClick={onLogout} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 14, cursor: 'pointer', padding: '2px 4px', lineHeight: 1 }} title="Sair">⏻</button>
        </div>
      </aside>

      {/* ══ CONTEÚDO PRINCIPAL ══ */}
      <main style={{ flex: 1, padding: '24px 28px', minWidth: 0 }}>

        {/* ── LISTA ── */}
        {nav === 'lista' && (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginBottom: 24 }}>
              {[
                { n: stats.total,    l: 'Total',    c: 'var(--text)' },
                { n: stats.zerados,  l: 'Zerados',  c: 'var(--green)' },
                { n: stats.jogando,  l: 'Jogando',  c: 'var(--blue)' },
                { n: stats.horas,    l: 'Horas',    c: 'var(--accent2)' },
                { n: stats.wishlist, l: 'Wishlist', c: 'var(--amber)' },
              ].map(s => (
                <div key={s.l} style={{
                  background: 'var(--bg3)',
                  border: `1px solid ${isCyberpunk ? `${s.c}33` : 'var(--border)'}`,
                  borderBottom: isCyberpunk ? `2px solid ${s.c}` : undefined,
                  borderRadius: isNintendo ? 'var(--radius-lg)' : 'var(--radius)',
                  padding: '12px 10px', textAlign: 'center',
                  boxShadow: isNordic ? 'var(--shadow)' : isCyberpunk ? `0 0 12px ${s.c}11` : 'none',
                }}>
                  <div style={{
                    fontSize: 22, fontWeight: 700, color: s.c,
                    fontFamily: 'var(--font-display)', letterSpacing: 1,
                    textShadow: isCyberpunk ? `0 0 10px ${s.c}` : 'none',
                  }}>{s.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2, letterSpacing: 0.5, textTransform: 'uppercase' }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Busca + sort + botão */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); clearFilters(); }}
                placeholder={isTerminal ? "grep -i 'jogo'..." : isCyberpunk ? '⟩⟩ SCAN...' : '🔍  Buscar na lista...'}
                style={{ flex: 1, minWidth: 180 }}
              />
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ width: 'auto', minWidth: 140 }}>
                {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              <button onClick={() => setModal('new')} style={{
                background: 'var(--bg)', border: 'none', color: 'var(--text)',
                borderRadius: isNintendo ? 'var(--radius-btn)' : isCyberpunk ? 2 : 'var(--radius-btn)',
                padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
                letterSpacing: isCyberpunk ? 2 : 0.5,
                boxShadow: isCyberpunk ? '0 0 12px var(--accent)' : isNintendo ? '0 4px 0 rgba(0,0,0,0.2)' : 'none',
              }}>
                {isCyberpunk ? '+ ADD' : isNintendo ? '+ Adicionar!' : isVintage ? '+ Registrar' : '+ Adicionar'}
              </button>
            </div>

            {/* Chips de filtro ativo */}
            {(platformFilter || genreFilter) && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>Filtrado por:</span>
                {platformFilter && (
                  <span style={{ background: 'var(--accent-bg)', color: 'var(--accent2)', border: '1px solid var(--border-primary)', borderRadius: 20, fontSize: 12, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    🖥 {platformFilter}
                    <button onClick={() => setPlatformFilter('')} style={{ background: 'none', border: 'none', color: 'var(--accent2)', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                  </span>
                )}
                {genreFilter && (
                  <span style={{ background: 'var(--accent-bg)', color: 'var(--accent2)', border: '1px solid var(--border-primary)', borderRadius: 20, fontSize: 12, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    ◈ {genreFilter}
                    <button onClick={() => setGenreFilter('')} style={{ background: 'none', border: 'none', color: 'var(--accent2)', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                  </span>
                )}
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)', textDecoration: 'underline' }}>Limpar</button>
              </div>
            )}

            {/* Lista de jogos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.length === 0
                ? <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text3)' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>😴</div>
                    <p>{search || platformFilter || genreFilter ? 'Nenhum jogo encontrado.' : 'Nada aqui ainda. Adicione um jogo!'}</p>
                  </div>
                : filtered.map(g => <GameCard key={g.id} game={g} onEdit={setModal} onDelete={setConfirmDel} onStatusChange={handleStatusChange} />)
              }
            </div>
          </>
        )}

        {/* ── PLATAFORMAS ── */}
        {nav === 'plataformas' && (
          <>
            <div style={{ marginBottom: 20 }}>{sectionTitle('Plataformas')}</div>
            <PlatformsTab games={games} onPlatformFilter={handlePlatformFilter} />
          </>
        )}

        {/* ── GÊNEROS ── */}
        {nav === 'generos' && (
          <>
            <div style={{ marginBottom: 20 }}>{sectionTitle('Gêneros')}</div>
            <GenresTab games={games} onGenreFilter={handleGenreFilter} />
          </>
        )}

        {/* ── WISHLIST ── */}
        {nav === 'wishlist' && (
          <>
            <div style={{ marginBottom: 20 }}>{sectionTitle('Wishlist')}</div>
            <WishlistTab games={games} onEdit={setModal} onDelete={setConfirmDel} onStatusChange={handleStatusChange} />
          </>
        )}
      </main>

      {/* ── Modais ── */}
      {modal && (
        <GameModal
          game={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {confirmDel && (
        <ConfirmDeleteModal
          onConfirm={() => handleDelete(confirmDel)}
          onCancel={() => setConfirmDel(null)}
        />
      )}
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

  const handleSave = async form => {
    if (modal?.id) await updateGame(modal.id, form);
    else await addGame(form);
    setModal(null);
    showToast();
  };

  const handleDelete = async id => { await deleteGame(id); setConfirmDel(null); };

  const handleStatusChange = async (id, status) => {
    const extra = status === 'zerado' ? { endDate: new Date().toISOString().slice(0, 10) } : {};
    await updateGame(id, { status, ...extra });
    showToast();
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ width: 28, height: 28, border: '2px solid var(--border2)', borderTopColor: 'var(--accent)', borderRadius: theme === 'terminal' ? 0 : '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <Layout
      user={user} onLogout={onLogout}
      theme={theme} setTheme={setTheme}
      games={games} filtered={filtered} stats={stats}
      filter={filter} setFilter={setFilter}
      sort={sort} setSort={setSort}
      search={search} setSearch={setSearch}
      setModal={setModal} setConfirmDel={setConfirmDel}
      handleStatusChange={handleStatusChange}
      themeOpen={themeOpen} setThemeOpen={setThemeOpen}
      modal={modal} handleSave={handleSave}
      confirmDel={confirmDel} handleDelete={handleDelete}
      toastVisible={toastVisible}
      nav={nav} setNav={setNav}
      platformFilter={platformFilter} setPlatformFilter={setPlatformFilter}
      genreFilter={genreFilter} setGenreFilter={setGenreFilter}
    />
  );
}
