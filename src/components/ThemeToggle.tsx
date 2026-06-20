import { THEMES, themeSignal } from '../theme';

export function ThemeToggle() {
  const current = themeSignal.value;

  return (
    <fieldset class="theme-toggle">
      <legend class="theme-toggle-legend">Choose theme</legend>
      {THEMES.map(({ id, label, color }) => (
        <button
          type="button"
          key={id}
          class={`theme-swatch ${current === id ? 'active' : ''}`}
          style={{ '--swatch-color': color } as Record<string, string>}
          onClick={() => {
            themeSignal.value = id;
          }}
          aria-label={label}
          aria-pressed={current === id}
          title={label}
        />
      ))}
    </fieldset>
  );
}
