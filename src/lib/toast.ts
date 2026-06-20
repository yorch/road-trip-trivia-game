// Lightweight toast notification system with a small severity wrapper.
// Builds DOM directly (outside Preact) so it can be called from anywhere.

import { escapeHtml } from './html';

type ToastType = 'info' | 'warning' | 'error' | 'success';

const ICONS: Record<ToastType, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
  success: '✓',
};

let container: HTMLDivElement | null = null;

function ensureContainer(): HTMLDivElement {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

function show(
  message: string,
  type: ToastType = 'info',
  duration?: number,
): void {
  const root = ensureContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${ICONS[type]}</div>
    <div class="toast-content"><p class="toast-message">${escapeHtml(message)}</p></div>
    <button class="toast-close" type="button" aria-label="Close">×</button>
  `;

  const close = () => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300); // match CSS animation
  };

  toast.querySelector('.toast-close')?.addEventListener('click', close);
  root.appendChild(toast);

  const ttl =
    duration ?? (type === 'error' ? 8000 : type === 'success' ? 3000 : 5000);
  setTimeout(close, ttl);
}

export const toast = {
  info: (msg: string) => {
    console.log(`[INFO] ${msg}`);
    show(msg, 'info');
  },
  success: (msg: string) => show(msg, 'success'),
  warn: (msg: string, err?: unknown) => {
    console.warn(`[WARN] ${msg}`, err);
    show(msg, 'warning');
  },
  error: (msg: string, err?: unknown) => {
    console.error(`[ERROR] ${msg}`, err);
    show(msg, 'error');
  },
};
