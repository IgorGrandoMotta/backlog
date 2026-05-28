// src/pages/Login.jsx
export function Login({ onLogin }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'DM Sans', sans-serif",
      background: '#0a0a0a',
      overflow: 'hidden',
    }}>

      {/* ══════════════════════════════════
          PAINEL ESQUERDO
      ══════════════════════════════════ */}
      <div style={{
        width: '52%',
        flexShrink: 0,
        background: '#0d0d0d',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '52px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* grade decorativa de fundo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />

        {/* vinheta nas bordas */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
        }} />

        {/* ── TOPO: logo ── */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Logo3D />
        </div>

        {/* ── MEIO: headline ── */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: -1,
            color: '#ffffff',
            marginBottom: 24,
          }}>
            BACKLOG
            <br />
            <span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 400, fontSize: 64 }}>MANAGER</span>
          </h1>
          <p style={{
            fontSize: 17,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.65,
            maxWidth: 340,
            fontWeight: 400,
          }}>
            Organize, avalie e acompanhe cada jogo da sua coleção — do pendente ao zerado.
          </p>

          {/* linha divisória */}
          <div style={{
            width: 48,
            height: 2,
            background: 'rgba(255,255,255,0.15)',
            marginTop: 32,
          }} />
        </div>

        {/* ── RODAPÉ: features ── */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: '⟳', label: 'Busca via RAWG', sub: '+500k jogos catalogados' },
              { icon: '★', label: 'Notas por categoria', sub: 'Gráfico, som, história e mais' },
              { icon: '⏱', label: 'Horas jogadas', sub: 'Acompanhe seu tempo' },
              { icon: '☁', label: 'Salvo na nuvem', sub: 'Sincronizado com sua conta' },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  flexShrink: 0,
                  color: 'rgba(255,255,255,0.6)',
                }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.80)', lineHeight: 1.2 }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', marginTop: 2 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          PAINEL DIREITO — login
      ══════════════════════════════════ */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 52px',
        position: 'relative',
        background: '#111111',
      }}>

        {/* glow central sutil */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          width: '100%',
          maxWidth: 360,
          position: 'relative',
          zIndex: 1,
        }}>

          {/* mini logo repetido */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 48,
          }}>
            <MiniLogo />
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 2,
              color: 'rgba(255,255,255,0.70)',
            }}>BACKLOG</span>
          </div>

          <h2 style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 32,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: 0.5,
            marginBottom: 8,
            lineHeight: 1.1,
          }}>Bem-vindo de volta</h2>
          <p style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 40,
          }}>
            Entre para acessar sua coleção.
          </p>

          {/* botão Google */}
          <GoogleButton onClick={onLogin} />

          {/* divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '28px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.20)', letterSpacing: 1 }}>ACESSO SEGURO</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* badges de segurança */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {['🔒 Dados privados', '☁ Google Auth', '✓ Gratuito'].map(b => (
              <span key={b} style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20,
                padding: '4px 10px',
              }}>{b}</span>
            ))}
          </div>
        </div>

        {/* rodapé */}
        <p style={{
          position: 'absolute',
          bottom: 28,
          fontSize: 11,
          color: 'rgba(255,255,255,0.15)',
          letterSpacing: 0.3,
        }}>
          My Game List © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

/* ─── Logo 3D SVG preto e branco ─────────────────────────────── */
function Logo3D() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* sombra/base 3D */}
      <rect x="10" y="18" width="44" height="30" rx="8" fill="rgba(0,0,0,0.6)" />
      {/* face frontal */}
      <rect x="6" y="14" width="44" height="30" rx="8" fill="#1a1a1a" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      {/* brilho superior */}
      <rect x="6" y="14" width="44" height="8" rx="8" fill="rgba(255,255,255,0.07)" />
      {/* cruz do controle */}
      <rect x="16" y="25" width="10" height="3" rx="1.5" fill="rgba(255,255,255,0.55)" />
      <rect x="19.5" y="21.5" width="3" height="10" rx="1.5" fill="rgba(255,255,255,0.55)" />
      {/* botões direita */}
      <circle cx="42" cy="24" r="2.5" fill="rgba(255,255,255,0.20)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <circle cx="48" cy="27" r="2.5" fill="rgba(255,255,255,0.20)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <circle cx="42" cy="30" r="2.5" fill="rgba(255,255,255,0.20)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <circle cx="36" cy="27" r="2.5" fill="rgba(255,255,255,0.20)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      {/* joysticks */}
      <circle cx="22" cy="36" r="4" fill="#111" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <circle cx="22" cy="36" r="2" fill="rgba(255,255,255,0.12)" />
      <circle cx="36" cy="36" r="4" fill="#111" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <circle cx="36" cy="36" r="2" fill="rgba(255,255,255,0.12)" />
      {/* brilho aresta 3D */}
      <rect x="6" y="14" width="1.5" height="30" rx="1" fill="rgba(255,255,255,0.10)" />
      <rect x="6" y="14" width="44" height="1.5" rx="1" fill="rgba(255,255,255,0.15)" />
    </svg>
  );
}

/* ─── Mini logo para o lado direito ─────────────────────────── */
function MiniLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="44" height="30" rx="8" fill="#1e1e1e" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <rect x="16" y="25" width="10" height="3" rx="1.5" fill="rgba(255,255,255,0.5)" />
      <rect x="19.5" y="21.5" width="3" height="10" rx="1.5" fill="rgba(255,255,255,0.5)" />
      <circle cx="42" cy="24" r="2.5" fill="rgba(255,255,255,0.25)" />
      <circle cx="48" cy="27" r="2.5" fill="rgba(255,255,255,0.25)" />
      <circle cx="42" cy="30" r="2.5" fill="rgba(255,255,255,0.25)" />
      <circle cx="36" cy="27" r="2.5" fill="rgba(255,255,255,0.25)" />
      <circle cx="22" cy="36" r="4" fill="#111" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <circle cx="36" cy="36" r="4" fill="#111" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </svg>
  );
}

/* ─── Botão Google estilizado ────────────────────────────────── */
function GoogleButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        width: '100%',
        padding: '15px 24px',
        background: '#ffffff',
        border: 'none',
        borderRadius: 10,
        color: '#111111',
        fontSize: 15,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        cursor: 'pointer',
        letterSpacing: 0.2,
        transition: 'all 0.18s',
        boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#f0f0f0';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#ffffff';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.4)';
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Entrar com Google
    </button>
  );
}
