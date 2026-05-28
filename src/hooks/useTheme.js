// src/hooks/useTheme.js
import { useState, useEffect } from 'react';

export const THEMES = [
  { key: 'dark',      label: '⬛ Dark' },
  { key: 'light',     label: '⬜ Light' },
  { key: 'cyberpunk', label: '🌆 Cyberpunk' },
  { key: 'terminal',  label: '💻 Terminal' },
  { key: 'nintendo',  label: '🎮 Nintendo' },
  { key: 'vintage',   label: '📜 Vintage' },
  { key: 'nordic',    label: '❄️ Nórdico' },
];

export function useTheme() {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem('mgl-theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mgl-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return { theme, setTheme: setThemeState, themes: THEMES };
}
