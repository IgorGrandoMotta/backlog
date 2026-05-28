// src/components/GameCard.jsx
import { StarRating } from './StarRating';

const STATUS = {
  pendente:   { label:'Pendente',   color:'var(--text2)',  bg:'rgba(139,144,160,0.1)' },
  jogando:    { label:'Jogando',    color:'var(--blue)',   bg:'var(--blue-bg)' },
  zerado:     { label:'Zerado',     color:'var(--green)',  bg:'var(--green-bg)' },
  abandonado: { label:'Abandonado', color:'var(--red)',    bg:'var(--red-bg)' },
  wishlist:   { label:'Wishlist',   color:'var(--amber)',  bg:'var(--amber-bg)' },
};

const CATS = ['grafico','jogabilidade','historia','som','duracao'];
const CAT_LABEL = { grafico:'Gráfico', jogabilidade:'Jogabilidade', historia:'História', som:'Som', duracao:'Duração' };

export function GameCard({ game, onEdit, onDelete, onStatusChange }) {
  const st = STATUS[game.status] || STATUS.pendente;

  const avg = () => {
    const vals = Object.values(game.ratings || {}).filter(v => v > 0);
    return vals.length ? (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1) : null;
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' }) : null;

  return (
    <div
      className="fade-in"
      style={{
        position: 'relative',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        minHeight: 120,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--border2)';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* ── BACKGROUND: cover com blur + overlay escuro ── */}
      {game.coverUrl && (
        <>
          {/* imagem borrada cobrindo o card inteiro */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${game.coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(22px) saturate(1.6) brightness(0.7)',
            transform: 'scale(1.15)',
            opacity: 0.55,
            zIndex: 0,
          }} />
          {/* overlay escuro semi-transparente para legibilidade */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.60) 30%, rgba(0,0,0,0.72) 100%)',
            zIndex: 1,
          }} />
        </>
      )}

      {/* fallback sem cover */}
      {!game.coverUrl && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--bg2)',
          zIndex: 0,
        }} />
      )}

      {/* ── CAPA ── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: 110,
        flexShrink: 0,
        alignSelf: 'stretch',
        background: 'var(--bg3)',
      }}>
        {game.coverUrl
          ? <img
              src={game.coverUrl}
              alt={game.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          : <div style={{
              width: '100%', height: '100%', minHeight: 120,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
            }}>🎮</div>
        }
      </div>

      {/* ── CONTEÚDO ── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        flex: 1,
        padding: '14px 16px',
        minWidth: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700,
              letterSpacing: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              color: 'var(--text)',
            }}>{game.title}</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
                color: st.color, background: st.bg,
                padding: '2px 10px', borderRadius: 20,
              }}>{st.label.toUpperCase()}</span>
              {game.platform && (
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>{game.platform}</span>
              )}
              {game.hoursPlayed > 0 && (
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>⏱ {game.hoursPlayed}h</span>
              )}
              {game.difficulty && (
                <span style={{ fontSize: 12, color: 'var(--text3)' }}>🎯 {game.difficulty}</span>
              )}
            </div>
          </div>

          {/* Média */}
          {avg() && (
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{
                fontSize: 20, fontWeight: 700, color: 'var(--amber)',
                fontFamily: 'var(--font-display)', lineHeight: 1,
              }}>{avg()}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>/ 5</div>
            </div>
          )}
        </div>

        {/* Ratings por categoria */}
        {game.ratings && Object.values(game.ratings).some(v => v > 0) && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
            {CATS.filter(c => game.ratings[c] > 0).map(c => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>{CAT_LABEL[c]}</span>
                <StarRating value={game.ratings[c]} readOnly size={11} />
              </div>
            ))}
          </div>
        )}

        {/* Obs */}
        {game.obs && (
          <p style={{
            fontSize: 13, color: 'var(--text2)', lineHeight: 1.55, marginBottom: 8,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            "{game.obs}"
          </p>
        )}

        {/* Datas */}
        {(game.startDate || game.endDate) && (
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
            {game.startDate && <span>▶ {fmtDate(game.startDate)}</span>}
            {game.endDate   && <span>🏁 {fmtDate(game.endDate)}</span>}
          </div>
        )}

        {/* Ações */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          {game.status !== 'zerado' && (
            <ActionBtn onClick={() => onStatusChange(game.id, 'zerado')} accent>✓ Zerado</ActionBtn>
          )}
          {game.status !== 'jogando' && game.status !== 'zerado' && (
            <ActionBtn onClick={() => onStatusChange(game.id, 'jogando')}>▶ Jogando</ActionBtn>
          )}
          <ActionBtn onClick={() => onEdit(game)}>✎ Editar</ActionBtn>
          <ActionBtn onClick={() => onDelete(game.id)} danger>✕</ActionBtn>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, accent, danger }) {
  return (
    <button onClick={onClick} style={{
      background: accent ? 'var(--accent-bg)' : danger ? 'var(--red-bg)' : 'rgba(0,0,0,0.25)',
      border: `1px solid ${accent ? 'rgba(124,106,255,0.3)' : danger ? 'rgba(248,113,113,0.2)' : 'var(--border2)'}`,
      color: accent ? 'var(--accent2)' : danger ? 'var(--red)' : 'var(--text2)',
      borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 500,
      transition: 'all 0.15s', letterSpacing: 0.3,
      backdropFilter: 'blur(4px)',
    }}>
      {children}
    </button>
  );
}
