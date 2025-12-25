import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isSystemTheme: boolean;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};

const STORAGE_KEY = 'spendwise-dark-mode';

export function DarkModeProvider({ children }: { children: ReactNode }) {
  // 1. Get the system preference (light or dark)
  const systemColorScheme = useColorScheme();
  
  const [darkMode, setDarkMode] = useState<boolean>(systemColorScheme === 'dark');
  const [isSystemTheme, setIsSystemTheme] = useState<boolean>(true);

  // 2. Load saved preference on mount
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored !== null) {
          setDarkMode(stored === 'true');
          setIsSystemTheme(false);
        }
      } catch (e) {
        console.error("Failed to load dark mode preference", e);
      }
    };
    loadPreference();
  }, []);

  // 3. Listen for system theme changes if user hasn't set a manual preference
  useEffect(() => {
    if (isSystemTheme) {
      setDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, isSystemTheme]);

  const toggleDarkMode = async () => {
    const nextValue = !darkMode;
    setDarkMode(nextValue);
    setIsSystemTheme(false); // User has now manually overridden system settings
    try {
      await AsyncStorage.setItem(STORAGE_KEY, String(nextValue));
    } catch (e) {
      console.error("Failed to save dark mode preference", e);
    }
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, isSystemTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
}