'use client';

import { createContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setLightTheme: () => void;
  setDarkTheme: () => void;
  setSystemTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  toggleTheme: () => {},
  setLightTheme: () => {},
  setDarkTheme: () => {},
  setSystemTheme: () => {},
});

function applyEffectiveTheme(themeToApply: Theme) {
  let effectiveTheme: 'light' | 'dark' = 'light';

  if (themeToApply === 'light' || themeToApply === 'dark') {
    effectiveTheme = themeToApply;
  } else {
    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || 'system';
    applyEffectiveTheme(initialTheme);
    setTheme(initialTheme);
  }, []);

  const applyTheme = useCallback((themeToApply: Theme) => {
    applyEffectiveTheme(themeToApply);
    localStorage.setItem('theme', themeToApply);
    setTheme(themeToApply);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  const setLightTheme = useCallback(() => applyTheme('light'), [applyTheme]);
  const setDarkTheme = useCallback(() => applyTheme('dark'), [applyTheme]);
  const setSystemTheme = useCallback(() => applyTheme('system'), [applyTheme]);

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
  }), [theme, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
