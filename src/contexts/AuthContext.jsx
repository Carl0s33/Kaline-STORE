import React, { createContext, useState, useContext, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

    const AuthContext = createContext(null);

    export const useAuth = () => useContext(AuthContext);

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

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
        // Simulate a slightly longer loading time for the spinner to be visible
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500); 
        return () => clearTimeout(timer);
      }, []);

      const login = (userData) => {
        setUser(userData);
        localStorage.setItem('kalineUser', JSON.stringify(userData));
      };

      const logout = () => {
        setUser(null);
        localStorage.removeItem('kalineUser');
      };

      const value = { user, login, logout, loading };

      // Efeito para mostrar notificação de erro
      useEffect(() => {
        if (error && !loading) {
          // Usando o toast diretamente aqui, pois agora está dentro de um efeito
          import('@/components/ui/use-toast').then(({ useToast }) => {
            const { toast } = useToast();
            toast({
              variant: "destructive",
              title: "Ops!",
              description: error,
              duration: 5000,
            });
          });
        }
      }, [error, loading]);

      if (loading) {
        return <LoadingSpinner />;
      }

      return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      );
    };