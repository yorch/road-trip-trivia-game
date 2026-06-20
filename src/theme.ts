import { effect, signal } from '@preact/signals';
import { readString, writeString } from './lib/storage';

export type Theme = 'warm' | 'dark' | 'ocean';

export const THEMES: { id: Theme; label: string; color: string }[] = [
  { id: 'warm', label: 'Warm Americana', color: '#C8461A' },
  { id: 'dark', label: 'Night Drive', color: '#D45820' },
  { id: 'ocean', label: 'Coastal', color: '#0E7490' },
];

const STORAGE_KEY = 'app-theme';

function getDefaultTheme(): Theme {
  const stored = readString(STORAGE_KEY) as Theme | null;
  if (stored && THEMES.some((t) => t.id === stored)) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'warm';
}

export const themeSignal = signal<Theme>(getDefaultTheme());

// Apply to <html> and persist on every change (runs synchronously on import).
effect(() => {
  const t = themeSignal.value;
  document.documentElement.setAttribute('data-theme', t);
  writeString(STORAGE_KEY, t);
});
