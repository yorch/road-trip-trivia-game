import type { Difficulty, QuestionMode, Topic } from './types';

// Constants
export const QUESTION_BANK_SIZE = 80;
export const MAX_SEED_VALUE = 2147483647; // 2^31-1, maximum value for linear congruential generator
export const SEARCH_DEBOUNCE_MS = 300;
export const RELOAD_SUCCESS_DISPLAY_MS = 2000;
export const MODE_CHANGE_DEBOUNCE_MS = 100; // Delay for mode change flag reset

// Question modes
export const QUESTION_MODES: Record<string, QuestionMode> = Object.freeze({
  ALL: 'all',
  CURATED: 'curated',
});

// Difficulty levels
export const DIFFICULTY_LEVELS: Record<string, Difficulty> = Object.freeze({
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
});

// Curated questions path (relative to the HTML page location)
// fetch() resolves relative URLs from the document location, not the module
export const CURATED_QUESTIONS_PATH = '/curated-questions.json';

// Get curated questions URL with optional cache busting
export function getCuratedQuestionsUrl(bustCache = false): string {
  return bustCache
    ? `${CURATED_QUESTIONS_PATH}?${Date.now()}`
    : CURATED_QUESTIONS_PATH;
}

// Security: HTML escaping helper to prevent XSS
export function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Template filling utility
export function fillTemplate(
  template: string,
  topicName: string,
  angle: string,
  index: number,
): string {
  return template
    .replaceAll('{topic}', topicName)
    .replaceAll('{angle}', angle)
    .replaceAll('{n}', String(index + 1));
}

// Deterministic shuffle using linear congruential generator
export function shuffleIndices(length: number, seedBase = 1): number[] {
  if (length === 0) return [];
  const arr = Array.from({ length }, (_, i) => i);
  let seed = seedBase;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    seed = (seed * 16807) % MAX_SEED_VALUE;
    const rand = seed / MAX_SEED_VALUE;
    const j = Math.floor(rand * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Build angles for a topic
export function buildAngles(topic: Topic): string[] {
  const base = window.categoryAngles[topic.category] || [];
  const general = [
    'origin',
    'favorite',
    'legend',
    'rival',
    'surprise',
    'underdog',
  ];
  return [...new Set([...topic.tags, ...base, ...general])];
}

type ToastType = 'info' | 'warning' | 'error' | 'success';

interface ToastManagerType {
  container: HTMLDivElement | null;
  toasts: Map<number, HTMLDivElement>;
  autoCloseDelay: number;
  init(): void;
  show(message: string, type?: ToastType, duration?: number | null): number;
  createToast(message: string, type: ToastType, id: number): HTMLDivElement;
  close(toastId: number): void;
  closeAll(): void;
}

// Toast Notification System
export const ToastManager: ToastManagerType = {
  container: null,
  toasts: new Map(),
  autoCloseDelay: 5000,

  init(): void {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(
    message: string,
    type: ToastType = 'info',
    duration: number | null = null,
  ): number {
    this.init();

    const toastId = Date.now() + Math.random();
    const toast = this.createToast(message, type, toastId);

    this.container?.appendChild(toast);
    this.toasts.set(toastId, toast);

    // Auto-close after delay (unless it's an error, which persists longer)
    const closeDelay =
      duration || (type === 'error' ? 8000 : this.autoCloseDelay);
    setTimeout(() => this.close(toastId), closeDelay);

    return toastId;
  },

  createToast(message: string, type: ToastType, id: number): HTMLDivElement {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.dataset.toastId = String(id);

    const icons: Record<ToastType, string> = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✓',
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <p class="toast-message">${escapeHtml(message)}</p>
      </div>
      <button class="toast-close" aria-label="Close">×</button>
    `;

    const closeBtn = toast.querySelector('.toast-close') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => this.close(id));

    return toast;
  },

  close(toastId: number): void {
    const toast = this.toasts.get(toastId);
    if (!toast) return;

    toast.classList.add('removing');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      this.toasts.delete(toastId);
    }, 300); // Match animation duration
  },

  closeAll(): void {
    this.toasts.forEach((_toast, id) => {
      this.close(id);
    });
  },
};

interface ErrorHandlerType {
  critical(msg: string, error?: Error): void;
  warn(msg: string, error?: Error): void;
  info(msg: string): void;
  success(msg: string): void;
}

// Error handling system with toast notifications
export const ErrorHandler: ErrorHandlerType = {
  critical(msg: string, error?: Error): void {
    console.error(`[CRITICAL] ${msg}`, error);
    ToastManager.show(msg, 'error');
  },
  warn(msg: string, error?: Error): void {
    console.warn(`[WARNING] ${msg}`, error);
    ToastManager.show(msg, 'warning');
  },
  info(msg: string): void {
    console.log(`[INFO] ${msg}`);
    ToastManager.show(msg, 'info');
  },
  success(msg: string): void {
    console.log(`[SUCCESS] ${msg}`);
    ToastManager.show(msg, 'success', 3000);
  },
};
