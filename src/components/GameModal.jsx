// src/components/GameModal.jsx
import { useState, useEffect } from 'react';
import { GameSearch } from './GameSearch';
import { StarRating } from './StarRating';
import { coverUrl } from '../lib/igdb';

const STATUS_OPTIONS = [
  { value: 'pendente', label: 'Pendente', color: 'var(--text2)' },
  { value: 'jogando', label: 'Jogando', color: 'var(--blue)' },
  { value: 'zerado', label: 'Zerado', color: 'var(--green)' },
  { value: 'abandonado', label: 'Abandonado', color: 'var(--red)' },
  { value: 'wishlist', label: 'Wishlist', color: 'var(--amber)' },
];

const RATING_CATS = [
  { key: 'grafico', label: 'Gráfico' },
  { key: 'jogabilidade', label: 'Jogabilidade' },
  { key: 'historia', label: 'História' },
  { key: 'som', label: 'Som / Música' },
  { key: 'duracao', label: 'Duração' },
];

const DIFFICULTY = ['Muito fácil','Fácil','Médio','Difícil','Muito difícil'];

const empty = {
  igdbId: null, title: '', platform: '', status: 'pendente',
  coverUrl: '', genres: [], summary: '',
  hoursPlayed: '', startDate: '', endDate: '',
  difficulty: '', obs: '',
  ratings: { grafico:0, jogabilidade:0, historia:0, som:0, duracao:0 },
};

export function GameModal({ game, onSave, onClose }) {
  const [form, setForm] = useState(game ? { ...empty, ...game } : { ...empty });
  const [tab, setTab] = useState('info');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setRating = (k, v) => setForm((f) => ({ ...f, ratings: { ...f.ratings, [k]: v } }));

  const handleIGDB = (g) => {
    set('igdbId', g.id);
    set('title', g.name);
    if (g.cover?.url) set('coverUrl', coverUrl(g.cover.url, 'cover_big'));
    if (g.genres?.length) set('genres', g.genres.map(x=>x.name));
    if (g.summary) set('summary', g.summary);
    if (g.platforms?.length) set('platform', g.platforms[0].abbreviation);
  };

  const save = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  const avgRating = () => {
    const vals = Object.values(form.ratings).filter(v => v > 0);
    return vals.length ? (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1) : null;
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:200,
        display:'flex', alignItems:'center', justifyContent:'center', padding:16
      }}
    >
      <div style={{
        background:'var(--bg2)', border:'1px solid var(--border2)', borderRadius:'var(--radius-lg)',
        width:'100%', maxWidth:560, maxHeight:'90vh', overflow:'hidden',
        display:'flex', flexDirection:'column', boxShadow:'var(--shadow)',
        animation:'slideUp 0.25s ease both'
      }}>
        {/* Header */}
        <div style={{ padding:'20px 24px 0', borderBottom:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, letterSpacing:1 }}>
              {game ? 'EDITAR JOGO' : 'ADICIONAR JOGO'}
            </h2>
            <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text2)', fontSize:22, lineHeight:1 }}>×</button>
          </div>
          <div style={{ display:'flex', gap:0 }}>
            {['info','notas','detalhes'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background:'none', border:'none', borderBottom: tab===t ? '2px solid var(--accent)' : '2px solid transparent',
                color: tab===t ? 'var(--text)' : 'var(--text2)',
                padding:'8px 16px', fontSize:13, fontWeight:500, fontFamily:'var(--font-body)',
                textTransform:'capitalize', letterSpacing:0.5, transition:'all 0.15s'
              }}>
                {t === 'info' ? 'Informações' : t === 'notas' ? 'Notas' : 'Detalhes'}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:'20px 24px', overflowY:'auto', flex:1 }}>
          {tab === 'info' && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={lbl}>Buscar na IGDB</label>
                <GameSearch onSelect={handleIGDB} />
              </div>

              <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                {form.coverUrl && (
                  <img src={form.coverUrl} alt="" width={72} style={{ borderRadius:8, objectFit:'cover', flexShrink:0 }} />
                )}
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                  <div>
                    <label style={lbl}>Nome do jogo *</label>
                    <input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Ex: Elden Ring" />
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <div>
                      <label style={lbl}>Plataforma</label>
                      <input value={form.platform} onChange={e=>set('platform',e.target.value)} placeholder="PC, PS5, Switch..." />
                    </div>
                    <div>
                      <label style={lbl}>Status</label>
                      <select value={form.status} onChange={e=>set('status',e.target.value)}>
                        {STATUS_OPTIONS.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {form.summary && (
                <div style={{ background:'var(--bg3)', borderRadius:8, padding:12, fontSize:13, color:'var(--text2)', lineHeight:1.6, borderLeft:'3px solid var(--accent)' }}>
                  {form.summary.slice(0,220)}{form.summary.length > 220 ? '…' : ''}
                </div>
              )}
            </div>
          )}

          {tab === 'notas' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:13, color:'var(--text2)' }}>Avalie por categoria</span>
                {avgRating() && (
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--amber)' }}>
                    Média: {avgRating()} ⭐
                  </span>
                )}
              </div>
              {RATING_CATS.map(cat => (
                <div key={cat.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'var(--bg3)', borderRadius:'var(--radius)' }}>
                  <span style={{ fontSize:14, color:'var(--text)' }}>{cat.label}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <StarRating value={form.ratings[cat.key]} onChange={v=>setRating(cat.key,v)} />
                    <span style={{ fontSize:12, color:'var(--text3)', minWidth:12 }}>
                      {form.ratings[cat.key] > 0 ? form.ratings[cat.key] : '—'}
                    </span>
                  </div>
                </div>
              ))}
              <div>
                <label style={lbl}>Dificuldade</label>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {DIFFICULTY.map(d => (
                    <button key={d} onClick={()=>set('difficulty',d)} style={{
                      background: form.difficulty===d ? 'var(--accent-bg)' : 'var(--bg3)',
                      border: `1px solid ${form.difficulty===d ? 'var(--accent)' : 'var(--border2)'}`,
                      color: form.difficulty===d ? 'var(--accent2)' : 'var(--text2)',
                      borderRadius:8, padding:'6px 12px', fontSize:13, transition:'all 0.15s'
                    }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={lbl}>Review / Observações</label>
                <textarea value={form.obs} onChange={e=>set('obs',e.target.value)} placeholder="O que você achou? Dicas, frustrações, momentos marcantes..." style={{ minHeight:100 }} />
              </div>
            </div>
          )}

          {tab === 'detalhes' && (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={lbl}>Horas jogadas</label>
                <input type="number" min="0" value={form.hoursPlayed} onChange={e=>set('hoursPlayed',e.target.value)} placeholder="0" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div>
                  <label style={lbl}>Data de início</label>
                  <input type="date" value={form.startDate} onChange={e=>set('startDate',e.target.value)} />
                </div>
                <div>
                  <label style={lbl}>Data que zerou</label>
                  <input type="date" value={form.endDate} onChange={e=>set('endDate',e.target.value)} />
                </div>
              </div>
              {form.genres?.length > 0 && (
                <div>
                  <label style={lbl}>Gêneros (via IGDB)</label>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {form.genres.map(g=>(
                      <span key={g} style={{ background:'var(--accent-bg)', color:'var(--accent2)', border:'1px solid rgba(124,106,255,0.25)', borderRadius:6, fontSize:12, padding:'3px 10px' }}>{g}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border)', display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ background:'none', border:'1px solid var(--border2)', color:'var(--text2)', borderRadius:'var(--radius)', padding:'9px 20px', fontSize:14 }}>
            Cancelar
          </button>
          <button onClick={save} style={{
            background:'var(--accent)', border:'none', color:'#fff', fontWeight:600,
            borderRadius:'var(--radius)', padding:'9px 24px', fontSize:14, letterSpacing:0.5,
            transition:'opacity 0.15s', opacity: form.title.trim() ? 1 : 0.4
          }}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

const lbl = { display:'block', fontSize:12, color:'var(--text2)', marginBottom:5, letterSpacing:0.4 };
