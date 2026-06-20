// HTML escaping for the few places we build markup strings directly (toasts).
// Preact escapes JSX text automatically, so components don't need this.
export function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
