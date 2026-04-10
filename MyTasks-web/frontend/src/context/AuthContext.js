import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'mytasks_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { user: storedUser, token: storedToken } = JSON.parse(stored);
          api.setToken(storedToken);
          
          const response = await api.getMe();
          setUser(response.data);
          setToken(storedToken);
        }
      } catch (err) {
        localStorage.removeItem(STORAGE_KEY);
        api.clearToken();
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const saveAuth = useCallback((userData, authToken) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: userData,
      token: authToken
    }));
    api.setToken(authToken);
    setUser(userData);
    setToken(authToken);
  }, []);

  const register = useCallback(async (name, email, password) => {
    setError(null);
    try {
      const response = await api.register(name, email, password);
      saveAuth(response.data.user, response.data.token);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [saveAuth]);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await api.login(email, password);
      saveAuth(response.data.user, response.data.token);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [saveAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    api.clearToken();
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
