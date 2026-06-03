import { useState, useEffect } from 'react';
import { api } from '../api/client';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('yearcal_credentials');
    if (stored) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const credentials = btoa(`${username}:${password}`);
    const ok = await api.testAuth(credentials);
    if (ok) {
      sessionStorage.setItem('yearcal_credentials', credentials);
      setIsAuthenticated(true);
    }
    return ok;
  };

  const logout = () => {
    sessionStorage.removeItem('yearcal_credentials');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}
