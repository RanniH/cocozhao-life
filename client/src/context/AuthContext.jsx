import { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin } from '../api/index.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = useCallback(async (password) => {
    const { token: t } = await apiLogin(password);
    setToken(t);
    localStorage.setItem('token', t);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAdmin: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
