import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Create the Dark Mode context
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// Hook to use dark mode in components
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};

interface DarkModeProviderProps {
  children: ReactNode;
}

// Provider component that manages dark mode state
export function DarkModeProvider({ children }: DarkModeProviderProps) {
  // Initialize dark mode from localStorage, default to false
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('spendwise-dark-mode');
      return stored === 'true';
    }
    return false;
  });

  // Apply dark mode class to html element and persist to localStorage
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    // Persist preference to localStorage
    localStorage.setItem('spendwise-dark-mode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
