import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import {
  answerExamplesSignal,
  loadAnswerExamples,
  resetAnswerExamplesCache,
  topicListSignal,
} from '../data/data';
import {
  clearCuratedQuestionsCache,
  getTopicCuratedStats,
  hasCuratedQuestions,
  loadCuratedTopicIndex,
  resetCuratedTopicIds,
  scoreSignal,
  showCuratedListSignal,
  streakSignal,
  topicIdSignal,
} from '../state';
import { startNewTrip } from '../state/game-logic';

import type { Topic } from '../types';
import {
  ErrorHandler,
  RELOAD_SUCCESS_DISPLAY_MS,
  SEARCH_DEBOUNCE_MS,
} from '../utils';
import { CuratedListDialog } from './CuratedListDialog';
import {
  CATEGORY_ICONS,
  ClipboardListIcon,
  FlameIcon,
  RefreshIcon,
  TrophyIcon,
} from './icons';
import { SpeechSettings } from './SpeechSettings';
import { ThemeToggle } from './ThemeToggle';

export function TopicPicker() {
  const [, setLocation] = useLocation();
  const topicList = topicListSignal.value;
  const answerExamples = answerExamplesSignal.value;
  const [search, setSearch] = useState('');
  // Debounced copy of `search` used for filtering, so each keystroke doesn't
  // re-run the topic filter immediately. The input stays bound to `search`.
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filter, setFilter] = useState<'quality' | 'curated' | 'all'>(
    'quality',
  );
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(search),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadAnswerExamples(), loadCuratedTopicIndex()]).then(() =>
      setLoading(false),
    );

    // Focus search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Reload curated data without redeploying: drop the in-memory caches and
  // re-fetch the index, curated questions, and answer examples. A short
  // cooldown prevents repeated clicks from spamming refetches.
  const reloadingRef = useRef(false);
  const handleReload = () => {
    if (reloadingRef.current) return;
    reloadingRef.current = true;
    setLoading(true);

    resetCuratedTopicIds();
    clearCuratedQuestionsCache();
    resetAnswerExamplesCache();

    Promise.all([loadCuratedTopicIndex(), loadAnswerExamples()])
      .then(() => ErrorHandler.success('Curated questions reloaded'))
      .catch(() =>
        ErrorHandler.warn(
          'Could not reload curated questions — showing cached',
        ),
      )
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          reloadingRef.current = false;
        }, RELOAD_SUCCESS_DISPLAY_MS);
      });
  };

  const filteredTopics = useMemo(() => {
    if (!topicList) return [];

    let topics = topicList;

    // Filter by search
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      topics = topics.filter(
        (t: Topic) =>
          t.name.toLowerCase().includes(term) ||
          t.category.toLowerCase().includes(term) ||
          t.tags.some((tag) => tag.toLowerCase().includes(term)),
      );
    }

    // Filter by mode
    if (filter === 'curated') {
      topics = topics.filter((t: Topic) => hasCuratedQuestions(t.id));
    } else if (filter === 'quality') {
      topics = topics.filter(
        (t: Topic) => hasCuratedQuestions(t.id) || answerExamples?.[t.id],
      );
    }

    return topics;
  }, [debouncedSearch, filter, loading, topicList, answerExamples]); // loading dependency to re-run after data load

  // Group by category
  const groupedTopics = useMemo(() => {
    const groups: Record<string, Topic[]> = {};
    filteredTopics.forEach((t: Topic) => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, [filteredTopics]);

  const categories = Object.keys(groupedTopics).sort();

  return (
    <div class="topic-picker-page">
      <div class="topic-picker">
        <div class="app-header">
          <h1 class="app-title">Road Trip Trivia</h1>
          <div class="header-right">
            {scoreSignal.value > 0 && (
              <div class="app-stats">
                <span title="Total Score">
                  <TrophyIcon size={15} class="stat-icon" /> {scoreSignal.value}
                </span>
                <span title="Current Streak">
                  <FlameIcon size={15} class="stat-icon" /> {streakSignal.value}
                </span>
              </div>
            )}
            <SpeechSettings />
            <ThemeToggle />
          </div>
        </div>

        <div class="topic-picker-header">
          <div>
            <h2>Choose Your Topic</h2>
            <p class="topic-picker-lede">
              Pick any topic to start your trivia journey
            </p>
          </div>
          <div class="picker-header-actions">
            <button
              type="button"
              class="ghost"
              onClick={() => {
                showCuratedListSignal.value = true;
              }}
            >
              <ClipboardListIcon size={14} class="btn-icon" /> Curated List
            </button>
            <button type="button" class="ghost" onClick={handleReload}>
              <RefreshIcon size={14} class="btn-icon" /> Reload
            </button>
            {scoreSignal.value > 0 && (
              <button
                type="button"
                class="ghost"
                onClick={() => {
                  if (
                    confirm('Start a new trip? This will reset your score.')
                  ) {
                    startNewTrip();
                  }
                }}
              >
                New Trip
              </button>
            )}
            {topicIdSignal.value && (
              <button
                type="button"
                class="ghost"
                onClick={() => {
                  if (topicIdSignal.value) {
                    setLocation(`/topic/${topicIdSignal.value}`);
                  }
                }}
              >
                Back to Game
              </button>
            )}
          </div>
        </div>

        <div class="topic-picker-search">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search topics..."
            value={search}
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          />
        </div>

        <div class="topic-picker-filters">
          <span>Show:</span>
          <div class="filter-buttons">
            <button
              type="button"
              class={`filter-btn ${filter === 'quality' ? 'active' : ''}`}
              onClick={() => setFilter('quality')}
            >
              Recommended
            </button>
            <button
              type="button"
              class={`filter-btn ${filter === 'curated' ? 'active' : ''}`}
              onClick={() => setFilter('curated')}
            >
              Curated only
            </button>
            <button
              type="button"
              class={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All topics
            </button>
          </div>
        </div>

        <div class="topic-picker-content">
          {loading ? (
            <div class="loading-message">Loading topics...</div>
          ) : (
            categories.map((category) => (
              <div class="topic-category" key={category}>
                <div class="topic-category-header">
                  <h3>
                    {(() => {
                      const Icon = CATEGORY_ICONS[category];
                      return Icon ? (
                        <Icon size={14} class="category-icon" />
                      ) : null;
                    })()}
                    {category}
                  </h3>
                  <span class="topic-category-count">
                    {groupedTopics[category].length}
                  </span>
                </div>
                <div class="topic-grid">
                  {groupedTopics[category].map((topic: Topic) => {
                    const isCurated = hasCuratedQuestions(topic.id);
                    const stats = getTopicCuratedStats(topic.id);

                    return (
                      <button
                        type="button"
                        class="topic-card"
                        key={topic.id}
                        onClick={() => {
                          setLocation(`/topic/${topic.id}`);
                        }}
                      >
                        <span class="topic-card-name">
                          {topic.name}
                          {isCurated && (
                            <span
                              class="curated-badge"
                              title="Curated questions available"
                            >
                              Curated
                            </span>
                          )}
                        </span>
                        {stats && (
                          <span class="topic-card-counts">
                            <span
                              class="qpip qpip-easy"
                              role="img"
                              aria-label={`${stats.easy} easy questions`}
                            >
                              {stats.easy}
                            </span>
                            <span
                              class="qpip qpip-medium"
                              role="img"
                              aria-label={`${stats.medium} medium questions`}
                            >
                              {stats.medium}
                            </span>
                            <span
                              class="qpip qpip-hard"
                              role="img"
                              aria-label={`${stats.hard} hard questions`}
                            >
                              {stats.hard}
                            </span>
                          </span>
                        )}
                        <span class="topic-card-tags">
                          {topic.tags.slice(0, 3).map((tag) => (
                            <span class="topic-tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
          {!loading && categories.length === 0 && (
            <div class="loading-message">
              No topics found matching your criteria.
            </div>
          )}
        </div>
      </div>
      <CuratedListDialog />
    </div>
  );
}
