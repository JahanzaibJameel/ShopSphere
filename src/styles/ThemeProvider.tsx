import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { Theme, ThemeMode } from '@/types';

const storage = new MMKV({ id: 'theme-storage' });

const lightTheme: Theme = {
  colors: {
    primary: '#6366f1',
    secondary: '#a855f7',
    accent: '#ef4444',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    border: '#e5e7eb',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    white: '#ffffff',
    black: '#000000',
    backgroundSecondary: '#f3f4f6',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  fonts: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    bold: 'Inter-Bold',
    light: 'Inter-Light',
  },
};

const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#818cf8',
    secondary: '#c084fc',
    accent: '#f87171',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    textTertiary: '#9ca3af',
    border: '#374151',
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    info: '#60a5fa',
    white: '#ffffff',
    black: '#000000',
    backgroundSecondary: '#f3f4f6',
  },
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  colors: Theme['colors'];
  spacing: Theme['spacing'];
  fonts: Theme['fonts'];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const deviceColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  const isDarkTheme = (mode: ThemeMode): boolean => {
    if (mode === 'system') {
      return deviceColorScheme === 'dark';
    }
    return mode === 'dark';
  };

  const getTheme = (mode: ThemeMode): Theme => {
    if (mode === 'system') {
      return deviceColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return mode === 'dark' ? darkTheme : lightTheme;
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    storage.set('themeMode', mode);
  };

  useEffect(() => {
    const savedThemeMode = storage.getString('themeMode') as ThemeMode;
    if (savedThemeMode) {
      setThemeModeState(savedThemeMode);
    }
  }, []);

  const theme = getTheme(themeMode);
  const isDark = isDarkTheme(themeMode);

  const value: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode,
    isDark,
    colors: theme.colors,
    spacing: theme.spacing,
    fonts: theme.fonts,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
