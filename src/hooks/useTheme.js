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

// Fontes especiais que cada tema precisa (além das fontes base já carregadas)
const THEME_FONTS = {
  terminal: 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap',
  nintendo: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
  vintage:  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:wght@400;500&display=swap',
  cyberpunk:'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap',
};

const loadedFonts = new Set();

function loadThemeFont(themeKey) {
  const url = THEME_FONTS[themeKey];
  if (!url || loadedFonts.has(themeKey)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
  loadedFonts.add(themeKey);
}

export function useTheme() {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem('mgl-theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mgl-theme', theme);
    loadThemeFont(theme);
  }, [theme]);

  // aplica tema salvo no mount sem flash
  useEffect(() => {
    const saved = localStorage.getItem('mgl-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    loadThemeFont(saved);
  }, []);

  return { theme, setTheme: setThemeState, themes: THEMES };
}
