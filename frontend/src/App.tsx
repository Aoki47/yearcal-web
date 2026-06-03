import './index.css';
import { useAuth } from './hooks/useAuth';
import { LoginScreen } from './components/LoginScreen';
import { YearCalendar } from './components/YearCalendar';

function App() {
  const { isAuthenticated, login, logout } = useAuth();

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-slate-900" />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return <YearCalendar onLogout={logout} />;
}

export default App;
