// src/pages/Login.jsx
export function Login({ onLogin }) {
  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'var(--bg)',
      backgroundImage:`
        radial-gradient(ellipse 60% 50% at 50% -10%, rgba(124,106,255,0.15) 0%, transparent 70%),
        radial-gradient(ellipse 40% 30% at 80% 80%, rgba(52,211,153,0.06) 0%, transparent 60%)
      `
    }}>
      <div style={{ textAlign:'center', maxWidth:420, padding:32 }}>
        {/* Logo / Título */}
        <div style={{ marginBottom:40 }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🎮</div>
          <h1 style={{
            fontFamily:'var(--font-display)', fontSize:48, fontWeight:700, letterSpacing:3,
            color:'var(--text)', lineHeight:1,
            background:'linear-gradient(135deg, var(--text) 0%, var(--accent2) 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
          }}>BACKLOG</h1>
          <p style={{ fontSize:15, color:'var(--text2)', marginTop:10, letterSpacing:0.3 }}>
            Sua lista de jogos para zerar.
          </p>
        </div>

        {/* Features */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:36, textAlign:'left' }}>
          {[
            ['🔍','Busca via IGDB'],
            ['⭐','Notas por categoria'],
            ['⏱','Tempo de jogo'],
            ['☁️','Salvo na nuvem'],
          ].map(([icon, text]) => (
            <div key={text} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'10px 12px', display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:18 }}>{icon}</span>
              <span style={{ fontSize:13, color:'var(--text2)' }}>{text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onLogin}
          style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:12,
            width:'100%', padding:'14px 24px',
            background:'var(--bg2)', border:'1px solid var(--border2)',
            borderRadius:'var(--radius)', color:'var(--text)',
            fontSize:15, fontWeight:500, fontFamily:'var(--font-body)',
            transition:'all 0.2s', cursor:'pointer'
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.background='var(--bg3)';}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.background='var(--bg2)';}}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Entrar com Google
        </button>

        <p style={{ fontSize:12, color:'var(--text3)', marginTop:20 }}>
          Seus dados ficam salvos na sua conta pessoal.
        </p>
      </div>
    </div>
  );
}
