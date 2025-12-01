// Curated Questions List Dialog
// Displays all topics with curated questions and their counts

import { loadCuratedTopicIndex } from '../state';
import type { CuratedQuestion, Topic } from '../types';
import { escapeHtml } from '../utils';

// Track focus for modal accessibility
let previousFocus: Element | null = null;

// Focus trap for modal accessibility
function trapFocus(e: KeyboardEvent): void {
  if (e.key !== 'Tab') return;

  const modal = document.getElementById('curatedListModal');
  if (!modal) return;

  const focusableElements = modal.querySelectorAll(
    'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );

  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  if (e.shiftKey && document.activeElement === firstFocusable) {
    e.preventDefault();
    lastFocusable.focus();
  } else if (!e.shiftKey && document.activeElement === lastFocusable) {
    e.preventDefault();
    firstFocusable.focus();
  }
}

// Show curated list dialog
export async function showCuratedListDialog(): Promise<void> {
  previousFocus = document.activeElement;
  const modal = document.getElementById('curatedListModal');
  if (!modal) return;

  modal.classList.remove('hidden');

  // Add focus trap and escape key handler
  modal.addEventListener('keydown', trapFocus);

  // Load and populate the curated list
  await populateCuratedList();

  // Move focus to close button
  const closeButton = document.getElementById('closeCuratedList');
  if (closeButton) {
    closeButton.focus();
  }
}

// Hide curated list dialog
export function hideCuratedListDialog(): void {
  const modal = document.getElementById('curatedListModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.removeEventListener('keydown', trapFocus);
  }

  // Restore focus to element that opened modal
  if (previousFocus && 'focus' in previousFocus) {
    (previousFocus as HTMLElement).focus();
    previousFocus = null;
  }
}

// Load all curated questions and populate the list
async function populateCuratedList(): Promise<void> {
  const container = document.getElementById('curatedListContent');
  if (!container) return;

  // Show loading state
  container.innerHTML =
    '<p class="loading-message">Loading curated questions data...</p>';

  try {
    // Load the index of topics with curated questions
    await loadCuratedTopicIndex();

    // Load all curated questions for topics in the index
    const topicList = window.topicList as Topic[];
    const curatedTopics: Array<{
      topic: Topic;
      easy: number;
      medium: number;
      hard: number;
      total: number;
    }> = [];

    // Load curated questions for each topic in parallel
    const loadPromises = topicList.map(async (topic) => {
      try {
        const response = await fetch(`/curated/${topic.id}.json`);
        if (!response.ok) return null;

        const data = (await response.json()) as {
          easy: CuratedQuestion[];
          medium: CuratedQuestion[];
          hard: CuratedQuestion[];
        };

        const easyCount = data.easy?.length || 0;
        const mediumCount = data.medium?.length || 0;
        const hardCount = data.hard?.length || 0;
        const total = easyCount + mediumCount + hardCount;

        if (total > 0) {
          return {
            topic,
            easy: easyCount,
            medium: mediumCount,
            hard: hardCount,
            total,
          };
        }
        return null;
      } catch {
        return null;
      }
    });

    const results = await Promise.all(loadPromises);
    results.forEach((result) => {
      if (result) {
        curatedTopics.push(result);
      }
    });

    // Sort by total count descending
    curatedTopics.sort((a, b) => b.total - a.total);

    // Calculate totals
    const totalTopics = curatedTopics.length;
    const totalQuestions = curatedTopics.reduce((sum, t) => sum + t.total, 0);
    const totalEasy = curatedTopics.reduce((sum, t) => sum + t.easy, 0);
    const totalMedium = curatedTopics.reduce((sum, t) => sum + t.medium, 0);
    const totalHard = curatedTopics.reduce((sum, t) => sum + t.hard, 0);

    // Generate HTML
    const html = `
      <div class="curated-list-summary">
        <div class="curated-list-summary-text">
          <strong>${totalTopics}</strong> topics with <strong>${totalQuestions}</strong> curated questions
        </div>
      </div>
      <table class="curated-list-table">
        <thead>
          <tr>
            <th>Topic</th>
            <th>Easy</th>
            <th>Medium</th>
            <th>Hard</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${curatedTopics
            .map(
              (item) => `
            <tr>
              <td class="topic-name">${escapeHtml(item.topic.name)}</td>
              <td>${item.easy}</td>
              <td>${item.medium}</td>
              <td>${item.hard}</td>
              <td class="total-count">${item.total}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
        <tfoot>
          <tr style="border-top: 2px solid var(--border); font-weight: 700;">
            <td class="topic-name">Total</td>
            <td>${totalEasy}</td>
            <td>${totalMedium}</td>
            <td>${totalHard}</td>
            <td class="total-count">${totalQuestions}</td>
          </tr>
        </tfoot>
      </table>
    `;

    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = `
      <p class="loading-message" style="color: var(--accent);">
        Failed to load curated questions data. Please try again.
      </p>
    `;
    console.error('Failed to load curated questions:', error);
  }
}

// Setup curated list dialog events
export function setupCuratedListEvents(): void {
  const closeCuratedListBtn = document.getElementById('closeCuratedList');
  if (closeCuratedListBtn) {
    closeCuratedListBtn.addEventListener('click', hideCuratedListDialog);
  }

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('curatedListModal');
      if (modal && !modal.classList.contains('hidden')) {
        hideCuratedListDialog();
      }
    }
  });
}
