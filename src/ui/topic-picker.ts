// Topic picker modal management
// Handles modal display, search, filtering, and focus trap

import { getOrCalculateCuratedCounts } from '../state';
import type { Topic } from '../types';
import { escapeHtml, SEARCH_DEBOUNCE_MS } from '../utils';
import { selectTopicAndStart } from './question-flow';

// Track focus for modal accessibility
let previousFocus: Element | null = null;

// WeakMap for element-specific search debounce timeouts
export const searchTimeouts = new WeakMap<HTMLElement, number>();

// Focus trap for modal accessibility
function trapFocus(e: KeyboardEvent): void {
  if (e.key !== 'Tab') return;

  const modal = document.getElementById('topicPicker');
  if (!modal) return;

  const focusableElements = modal.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
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

// Show topic picker
export function showTopicPicker(): void {
  previousFocus = document.activeElement;
  const modal = document.getElementById('topicPicker');
  if (modal) {
    modal.classList.remove('hidden');

    // Move focus to search input
    const searchInput = document.getElementById(
      'topicSearch',
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }

    // Add focus trap and escape key handler
    modal.addEventListener('keydown', trapFocus);
  }
}

// Hide topic picker
export function hideTopicPicker(): void {
  const modal = document.getElementById('topicPicker');

  // Clear search timeout if picker is being hidden
  const searchInput = document.getElementById('topicSearch');
  if (searchInput) {
    const existingTimeout = searchTimeouts.get(searchInput);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      searchTimeouts.delete(searchInput);
    }
  }

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

// Populate topic picker
export async function populateTopicPicker(
  filterMode: 'all' | 'curated' = 'all',
): Promise<void> {
  const container = document.getElementById('topicPickerContent');
  if (!container) return;

  const categories = [
    ...new Set(window.topicList.map((t: Topic) => t.category)),
  ].sort() as string[];

  // Use atomic cache operation to prevent race conditions
  const curatedCounts = await getOrCalculateCuratedCounts();

  container.innerHTML = categories
    .map((category: string) => {
      let categoryTopics = window.topicList.filter(
        (t: Topic) => t.category === category,
      );

      // Filter by curated if needed (using cached counts)
      if (filterMode === 'curated') {
        categoryTopics = categoryTopics.filter(
          (t: Topic) => (curatedCounts.get(t.id) || 0) > 0,
        );
      }

      // Skip empty categories
      if (categoryTopics.length === 0) return '';

      return `
      <div class="topic-category" data-category="${escapeHtml(category)}">
        <div class="topic-category-header">
          <h3>${escapeHtml(category)}</h3>
          <span class="topic-category-count">${categoryTopics.length}</span>
        </div>
        <div class="topic-grid">
          ${categoryTopics
            .map((topic: Topic) => {
              const curatedCount = curatedCounts.get(topic.id) || 0;
              const hasCurated = curatedCount > 0;
              return `
              <div class="topic-card"
                   data-topic-id="${escapeHtml(topic.id)}"
                   data-topic-name="${escapeHtml(topic.name.toLowerCase())}"
                   data-has-curated="${hasCurated}">
                <div class="topic-card-name">
                  ${escapeHtml(topic.name)}
                  ${hasCurated ? `<span class="curated-count">${curatedCount} curated</span>` : ''}
                </div>
                <div class="topic-card-tags">
                  ${topic.tags
                    .slice(0, 3)
                    .map(
                      (tag) =>
                        `<span class="topic-tag">${escapeHtml(tag)}</span>`,
                    )
                    .join('')}
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    `;
    })
    .join('');

  // Note: Click handlers are set up once via event delegation in bindEvents()
}

// Handle topic search
export function handleTopicSearch(searchTerm: string): void {
  const term = searchTerm.toLowerCase();
  const allCards = document.querySelectorAll('.topic-card');
  const allCategories = document.querySelectorAll('.topic-category');

  allCards.forEach((card) => {
    const topicName = (card as HTMLElement).dataset.topicName || '';
    const matches = topicName.includes(term);
    card.classList.toggle('hidden', !matches);
  });

  // Hide categories with no visible topics
  allCategories.forEach((category) => {
    const visibleCards = category.querySelectorAll('.topic-card:not(.hidden)');
    (category as HTMLElement).style.display =
      visibleCards.length > 0 ? 'block' : 'none';
  });
}

// Setup search input handler
export function setupSearchHandler(): void {
  const topicSearchInput = document.getElementById(
    'topicSearch',
  ) as HTMLInputElement;
  if (topicSearchInput) {
    topicSearchInput.addEventListener('input', (e) => {
      const element = e.target as HTMLInputElement;
      const existingTimeout = searchTimeouts.get(element);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      const timeout = window.setTimeout(() => {
        handleTopicSearch(element.value);
      }, SEARCH_DEBOUNCE_MS);

      searchTimeouts.set(element, timeout);
    });
  }
}

// Setup topic picker event delegation
export function setupTopicPickerEvents(): void {
  const topicPickerContent = document.getElementById('topicPickerContent');
  if (topicPickerContent) {
    topicPickerContent.addEventListener('click', (e) => {
      const card = (e.target as HTMLElement).closest(
        '.topic-card',
      ) as HTMLElement;
      if (card) {
        const topicId = card.dataset.topicId;
        if (topicId) {
          selectTopicAndStart(topicId);
          hideTopicPicker();
        }
      }
    });
  }
}
