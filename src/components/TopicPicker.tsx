import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useLocation } from 'wouter-preact';
import {
  answerExamplesSignal,
  loadAnswerExamples,
  topicListSignal,
} from '../data/data';
import {
  hasCuratedQuestions,
  loadCuratedTopicIndex,
  scoreSignal,
  showCuratedListSignal,
  topicIdSignal,
} from '../state';
import { startNewTrip } from '../state/game-logic';

import type { Topic } from '../types';
import { CuratedListDialog } from './CuratedListDialog';

export function TopicPicker() {
  const [, setLocation] = useLocation();
  const topicList = topicListSignal.value;
  const answerExamples = answerExamplesSignal.value;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'quality' | 'curated' | 'all'>(
    'quality',
  );
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const filteredTopics = useMemo(() => {
    if (!topicList) return [];

    let topics = topicList;

    // Filter by search
    if (search) {
      const term = search.toLowerCase();
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
  }, [search, filter, loading, topicList, answerExamples]); // loading dependency to re-run after data load

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
              📋 Curated List
            </button>
            <button
              type="button"
              class="ghost"
              onClick={() => {
                setLoading(true);
                // Reload logic... maybe just re-fetch?
                // For now just simulate reload
                setTimeout(() => setLoading(false), 500);
              }}
            >
              ↻ Reload
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
                  <h3>{category}</h3>
                  <span class="topic-category-count">
                    {groupedTopics[category].length}
                  </span>
                </div>
                <div class="topic-grid">
                  {groupedTopics[category].map((topic: Topic) => {
                    const isCurated = hasCuratedQuestions(topic.id);
                    const hasExamples = answerExamples?.[topic.id];

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
                          {!isCurated && hasExamples && (
                            <span
                              class="quality-badge"
                              title="Real answer examples"
                            >
                              Quality
                            </span>
                          )}
                        </span>
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
