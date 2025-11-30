// Utility functions for Road Trip Trivia

// Constants
export const QUESTION_BANK_SIZE = 80;
export const MAX_SEED_VALUE = 2147483647; // 2^31-1, maximum value for linear congruential generator
export const SEARCH_DEBOUNCE_MS = 300;
export const RELOAD_SUCCESS_DISPLAY_MS = 2000;

// Question modes
export const QUESTION_MODES = Object.freeze({
  ALL: 'all',
  CURATED: 'curated'
});

// Difficulty levels
export const DIFFICULTY_LEVELS = Object.freeze({
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
});

// Security: HTML escaping helper to prevent XSS
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Template filling utility
export function fillTemplate(template, topicName, angle, index) {
  return template
    .replaceAll("{topic}", topicName)
    .replaceAll("{angle}", angle)
    .replaceAll("{n}", index + 1);
}

// Deterministic shuffle using linear congruential generator
export function shuffleIndices(length, seedBase = 1) {
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
export function buildAngles(topic) {
  const base = window.categoryAngles[topic.category] || [];
  const general = ["origin", "favorite", "legend", "rival", "surprise", "underdog"];
  return [...new Set([...topic.tags, ...base, ...general])];
}

// Toast Notification System
export const ToastManager = {
  container: null,
  toasts: new Map(),
  autoCloseDelay: 5000,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = null) {
    this.init();

    const toastId = Date.now() + Math.random();
    const toast = this.createToast(message, type, toastId);

    this.container.appendChild(toast);
    this.toasts.set(toastId, toast);

    // Auto-close after delay (unless it's an error, which persists longer)
    const closeDelay = duration || (type === 'error' ? 8000 : this.autoCloseDelay);
    setTimeout(() => this.close(toastId), closeDelay);

    return toastId;
  },

  createToast(message, type, id) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.dataset.toastId = id;

    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✓'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <p class="toast-message">${escapeHtml(message)}</p>
      </div>
      <button class="toast-close" aria-label="Close">×</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.close(id));

    return toast;
  },

  close(toastId) {
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

  closeAll() {
    this.toasts.forEach((toast, id) => this.close(id));
  }
};

// Error handling system with toast notifications
export const ErrorHandler = {
  critical(msg, error) {
    console.error(`[CRITICAL] ${msg}`, error);
    ToastManager.show(msg, 'error');
  },
  warn(msg, error) {
    console.warn(`[WARNING] ${msg}`, error);
    ToastManager.show(msg, 'warning');
  },
  info(msg) {
    console.log(`[INFO] ${msg}`);
    ToastManager.show(msg, 'info');
  },
  success(msg) {
    console.log(`[SUCCESS] ${msg}`);
    ToastManager.show(msg, 'success', 3000);
  }
};
