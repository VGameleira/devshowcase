import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Contexto de autenticação — mantém o token e os dados
 * do usuário logado em memória e no localStorage pra não
 * perder o login quando recarregar a página.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tenta recuperar sessão ao montar o componente
  useEffect(() => {
    const savedToken = localStorage.getItem('devshowcase_token');
    const savedUser  = localStorage.getItem('devshowcase_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  async function login(email, senha) {
    const response = await api.post('/login.php', { email, senha });
    const data = response.data;

    if (!data.token) {
      throw new Error(data.message || 'Erro ao fazer login.');
    }

    // Salva localmente
    localStorage.setItem('devshowcase_token', data.token);
    localStorage.setItem('devshowcase_user', JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  }

  function logout() {
    localStorage.removeItem('devshowcase_token');
    localStorage.removeItem('devshowcase_user');
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
