import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const localTheme = localStorage.getItem('theme');
    return localTheme || 'light';
  });
  
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });
  
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem('fontSize')) || 16;
  });
  
  const [screenReader, setScreenReader] = useState(() => {
    return localStorage.getItem('screenReader') === 'true';
  });

  useEffect(() => {
    const root = window.document.documentElement;
   
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
   
    root.style.fontSize = `${fontSize}px`;
    
    localStorage.setItem('theme', theme);
    localStorage.setItem('highContrast', highContrast);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('screenReader', screenReader);
    
  }, [theme, highContrast, fontSize, screenReader]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };
  
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(24, prev + 2));
  };
  
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(12, prev - 2));
  };
  
  const resetFontSize = () => {
    setFontSize(16);
  };
  
  const toggleScreenReader = () => {
    const newValue = !screenReader;
    setScreenReader(newValue);
    if (newValue) {
      // Anúncio para leitores de tela
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Modo leitor de tela ativado. Navegação por teclado ativada.';
      document.body.appendChild(announcement);
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 4000);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      highContrast, 
      toggleHighContrast,
      fontSize,
      increaseFontSize,
      decreaseFontSize,
      resetFontSize,
      screenReader,
      toggleScreenReader
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
  