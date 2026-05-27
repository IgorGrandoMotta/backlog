// src/pages/Dashboard.jsx
import { useState, useMemo } from 'react';
import { useGames } from '../hooks/useGames';
import { GameCard } from '../components/GameCard';
import { GameModal } from '../components/GameModal';

const FILTERS = [
  { key:'todos',     label:'Todos' },
  { key:'pendente',  label:'Pendente' },
  { key:'jogando',   label:'Jogando' },
  { key:'zerado',    label:'Zerado' },
  { key:'abandonado',label:'Abandonado' },
  { key:'wishlist',  label:'Wishlist' },
];

const SORTS = [
  { key:'recent',  label:'Mais recente' },
  { key:'title',   label:'Nome A–Z' },
  { key:'rating',  label:'Melhor nota' },
  { key:'hours',   label:'Mais horas' },
];

export function Dashboard({ user, onLogout }) {
  const { games, loading, addGame, updateGame, deleteGame } = useGames(user.uid);
  const [filter, setFilter] = useState('todos');
  const [sort, setSort] = useState('recent');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'new' | game object
  const [confirmDel, setConfirmDel] = useState(null);

  const stats = useMemo(() => ({
    total:     games.length,
    zerados:   games.filter(g=>g.status==='zerado').length,
    jogando:   games.filter(g=>g.status==='jogando').length,
    horas:     games.reduce((a,b)=>a+(Number(b.hoursPlayed)||0),0),
    wishlist:  games.filter(g=>g.status==='wishlist').length,
  }), [games]);

  const filtered = useMemo(() => {
    let list = filter === 'todos' ? games : games.filter(g=>g.status===filter);
    if (search) list = list.filter(g=>g.title.toLowerCase().includes(search.toLowerCase()));
    switch (sort) {
      case 'title':  list = [...list].sort((a,b)=>a.title.localeCompare(b.title)); break;
      case 'rating': list = [...list].sort((a,b)=>avgR(b)-avgR(a)); break;
      case 'hours':  list = [...list].sort((a,b)=>(Number(b.hoursPlayed)||0)-(Number(a.hoursPlayed)||0)); break;
      default: break;
    }
    return list;
  }, [games, filter, sort, search]);

  const avgR = (g) => {
    const vals = Object.values(g.ratings||{}).filter(v=>v>0);
    return vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : 0;
  };

  const handleSave = async (form) => {
    if (modal?.id) {
      await updateGame(modal.id, form);
    } else {
      await addGame(form);
    }
    setModal(null);
  };

  const handleDelete = async (id) => {
    await deleteGame(id);
    setConfirmDel(null);
  };

  const handleStatusChange = async (id, status) => {
    const extra = status === 'zerado' ? { endDate: new Date().toISOString().slice(0,10) } : {};
    await updateGame(id, { status, ...extra });
  };

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'0 16px 80px' }}>
      {/* Topbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 0 24px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:28 }}>🎮</span>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:700, letterSpacing:2, color:'var(--text)' }}>BACKLOG</h1>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <img src={user.photoURL} alt="" width={32} height={32} style={{ borderRadius:'50%', border:'2px solid var(--border2)' }} />
          <span style={{ fontSize:13, color:'var(--text2)', display:window.innerWidth>500?'block':'none' }}>{user.displayName?.split(' ')[0]}</span>
          <button onClick={onLogout} style={{ background:'none', border:'1px solid var(--border2)', color:'var(--text2)', borderRadius:'var(--radius)', padding:'5px 12px', fontSize:12, transition:'all 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border-primary)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border2)'}
          >Sair</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, padding:'20px 0' }}>
        {[
          { n: stats.total,   l:'Total',    c:'var(--text)' },
          { n: stats.zerados, l:'Zerados',  c:'var(--green)' },
          { n: stats.jogando, l:'Jogando',  c:'var(--blue)' },
          { n: stats.horas,   l:'Horas',    c:'var(--accent2)' },
          { n: stats.wishlist,l:'Wishlist', c:'var(--amber)' },
        ].map(s=>(
          <div key={s.l} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'12px 10px', textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:700, color:s.c, fontFamily:'var(--font-display)', letterSpacing:1 }}>{s.n}</div>
            <div style={{ fontSize:11, color:'var(--text3)', marginTop:2, letterSpacing:0.5 }}>{s.l.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Barra de ações */}
      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:16, flexWrap:'wrap' }}>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍  Buscar na lista..."
          style={{ flex:1, minWidth:180 }}
        />
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ width:'auto', minWidth:140 }}>
          {SORTS.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <button onClick={()=>setModal('new')} style={{
          background:'var(--accent)', border:'none', color:'#fff',
          borderRadius:'var(--radius)', padding:'10px 20px', fontSize:14, fontWeight:600,
          letterSpacing:0.5, whiteSpace:'nowrap', transition:'opacity 0.15s'
        }}
          onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
          onMouseLeave={e=>e.currentTarget.style.opacity='1'}
        >+ Adicionar</button>
      </div>

      {/* Filtros */}
      <div style={{ display:'flex', gap:6, marginBottom:20, flexWrap:'wrap' }}>
        {FILTERS.map(f=>(
          <button key={f.key} onClick={()=>setFilter(f.key)} style={{
            background: filter===f.key ? 'var(--accent-bg)' : 'var(--bg2)',
            border: `1px solid ${filter===f.key ? 'rgba(124,106,255,0.4)' : 'var(--border)'}`,
            color: filter===f.key ? 'var(--accent2)' : 'var(--text2)',
            borderRadius:20, padding:'5px 14px', fontSize:13, fontWeight: filter===f.key ? 500 : 400,
            transition:'all 0.15s'
          }}>
            {f.label}
            {f.key !== 'todos' && games.filter(g=>g.status===f.key).length > 0 &&
              <span style={{ marginLeft:6, fontSize:11, opacity:0.7 }}>
                {games.filter(g=>g.status===f.key).length}
              </span>
            }
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text3)' }}>
          <div style={{ width:28, height:28, border:'2px solid var(--border2)', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 16px' }}/>
          Carregando...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text3)' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>😴</div>
          <p style={{ fontSize:15 }}>{search ? 'Nenhum jogo encontrado.' : 'Nada aqui ainda. Adicione um jogo!'}</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.map(g=>(
            <GameCard
              key={g.id}
              game={g}
              onEdit={setModal}
              onDelete={setConfirmDel}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Modal adicionar/editar */}
      {modal && (
        <GameModal
          game={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={()=>setModal(null)}
        />
      )}

      {/* Confirm delete */}
      {confirmDel && (
        <div onClick={()=>setConfirmDel(null)} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:300,
          display:'flex', alignItems:'center', justifyContent:'center', padding:16
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:'var(--radius-lg)',
            padding:28, maxWidth:360, width:'100%', textAlign:'center'
          }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🗑️</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:18, marginBottom:8 }}>Remover jogo?</h3>
            <p style={{ fontSize:14, color:'var(--text2)', marginBottom:24 }}>Essa ação não pode ser desfeita.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={()=>setConfirmDel(null)} style={{ background:'none', border:'1px solid var(--border2)', color:'var(--text2)', borderRadius:'var(--radius)', padding:'9px 20px', fontSize:14 }}>Cancelar</button>
              <button onClick={()=>handleDelete(confirmDel)} style={{ background:'var(--red-bg)', border:'1px solid rgba(248,113,113,0.3)', color:'var(--red)', borderRadius:'var(--radius)', padding:'9px 20px', fontSize:14, fontWeight:600 }}>Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
