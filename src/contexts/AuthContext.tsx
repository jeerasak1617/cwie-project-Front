import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api';

interface User {
  id: number;
  username?: string;
  student_code?: string;
  first_name_th?: string;
  last_name_th?: string;
  full_name?: string;
  email?: string;
  sys_role?: string;
  photo_url?: string;
  status?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginAdmin: (username: string, password: string) => Promise<{ user: User }>;
  loginLine: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/auth/me').then(res => setUser(res.data)).catch(() => {
        localStorage.removeItem('token'); localStorage.removeItem('user'); setToken(null); setUser(null);
      }).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);

  const loginAdmin = async (username: string, password: string) => {
    const res = await api.post('/auth/login', null, { params: { username, password } });
    const { access_token, user: userData } = res.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(access_token); setUser(userData);
    return { user: userData };
  };

  const loginLine = () => { setUser({ id: 0, first_name_th: 'LINE User', last_name_th: '' }); };
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setToken(null); setUser(null); };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, loading, loginAdmin, loginLine, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => { const c = useContext(AuthContext); if (!c) throw new Error('useAuth must be used within AuthProvider'); return c; };
