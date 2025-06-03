import React, { createContext, useState, useContext, useEffect } from 'react';
    import LoadingSpinner from '@/components/LoadingSpinner';

    const AuthContext = createContext(null);

    export const useAuth = () => useContext(AuthContext);

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        try {
          const storedUser = localStorage.getItem('kalineUser');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
          localStorage.removeItem('kalineUser');
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

      if (loading) {
        return <LoadingSpinner />;
      }

      return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
      );
    };