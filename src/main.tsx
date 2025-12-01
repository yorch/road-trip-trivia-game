// This file orchestrates the initialization of all modules

// Import CSS (Vite will process this)
import './css/style.css';

import { render } from 'preact';
import { App } from './components/App';
import { initGame } from './state/init';

async function main() {
  await initGame();
  const appRoot = document.getElementById('app');
  if (!appRoot) throw new Error('Root element #app not found');
  render(<App />, appRoot);
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', main);
