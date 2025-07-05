import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import LoadingSpinner from '@/components/SpinnerCarregamento';
import { useNotificacao } from '@/components/ui/useNotificacao';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { notificar } = useNotificacao();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('kalineUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Erro ao carregar usuário do localStorage:", error);
      localStorage.removeItem('kalineUser');
      setError("Não é você, sou eu ;(");
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); 
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('kalineUser', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('kalineUser');
  }, []);

  const value = { user, login, logout, loading };

  // Efeito para mostrar notificação de erro
  useEffect(() => {
    if (error && !loading) {
      notificar({
        variant: "destructive",
        title: "Ops!",
        description: error,
        duration: 5000,
      });
    }
  }, [error, loading, notificar]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};