/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({ darkMode: false, toggleDarkMode: () => {} });

export function ThemeProvider({ children }) {
  const darkMode = false;
  const toggleDarkMode = () => {};

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(ThemeContext);
}

export default ThemeContext;
