// App entry: load content, restore any in-progress game, render.

import './css/style.css';
// Side effect: applies data-theme to <html> before first render.
import './theme';

import { render } from 'preact';
import { App } from './App';
import { loadTopics } from './content/catalog';
import { loadCuratedIndex } from './content/curated';
import { toast } from './lib/toast';
import { resumeSession } from './session/session';

async function main() {
  document.body.classList.add('loading');

  try {
    await Promise.all([loadTopics(), loadCuratedIndex()]);
  } catch (err) {
    toast.error(
      'Failed to load game data. Check your connection and refresh.',
      err,
    );
    document.body.classList.remove('loading');
    return;
  }

  resumeSession();

  document.documentElement.classList.remove('no-js');
  document.body.classList.remove('loading');

  const root = document.getElementById('app');
  if (!root) throw new Error('Root element #app not found');
  render(<App />, root);
}

document.addEventListener('DOMContentLoaded', main);
