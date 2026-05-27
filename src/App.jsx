// src/App.jsx
import { useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  const { user, login, logout } = useAuth();

  // Carregando
  if (user === undefined) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
        <div style={{ width:28, height:28, border:'2px solid rgba(255,255,255,0.1)', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!user) return <Login onLogin={login} />;

  return <Dashboard user={user} onLogout={logout} />;
}
