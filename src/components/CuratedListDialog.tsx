import { useEffect, useState } from 'preact/hooks';
import { topicListSignal } from '../data/data';
import {
  getCuratedTopicStats,
  loadCuratedTopicIndex,
  showCuratedListSignal,
} from '../state';
import type { Topic } from '../types';

interface CuratedTopicStats {
  topic: Topic;
  easy: number;
  medium: number;
  hard: number;
  total: number;
}

export function CuratedListDialog() {
  const show = showCuratedListSignal.value;
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<CuratedTopicStats[]>([]);

  useEffect(() => {
    if (show) {
      setLoading(true);
      loadStats().then((data) => {
        setStats(data);
        setLoading(false);
      });
    }
  }, [show]);

  async function loadStats() {
    await loadCuratedTopicIndex();
    const topics = topicListSignal.value || [];
    const statsData = getCuratedTopicStats();

    const stats = topics
      .map((topic: Topic) => {
        const topicStats = statsData?.[topic.id];
        if (!topicStats) return null;

        const { easy, medium, hard } = topicStats;
        const total = easy + medium + hard;

        if (total === 0) return null;

        return {
          topic,
          easy,
          medium,
          hard,
          total,
        };
      })
      .filter((item): item is CuratedTopicStats => item !== null)
      .sort((a, b) => b.total - a.total);

    return stats;
  }

  if (!show) return null;

  return (
    <div class="topic-picker-overlay" role="dialog" aria-modal="true">
      <div class="topic-picker curated-list-dialog">
        <div class="topic-picker-header">
          <div>
            <h2>Curated Questions</h2>
            <p class="topic-picker-lede">
              Topics with curated factual questions
            </p>
          </div>
          <div class="picker-header-actions">
            <button
              type="button"
              class="ghost"
              onClick={() => {
                showCuratedListSignal.value = false;
              }}
            >
              Close
            </button>
          </div>
        </div>

        <div class="curated-list-content">
          {loading ? (
            <p class="loading-message">Loading curated questions data...</p>
          ) : (
            <>
              <div class="curated-list-summary">
                <span class="curated-list-summary-text">
                  <strong>{stats.length}</strong> topics available with{' '}
                  <strong>{stats.reduce((acc, s) => acc + s.total, 0)}</strong>{' '}
                  total questions.
                </span>
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
                  {stats.map((stat) => (
                    <tr key={stat.topic.id}>
                      <td>
                        <div class="topic-name">{stat.topic.name}</div>
                      </td>
                      <td>{stat.easy}</td>
                      <td>{stat.medium}</td>
                      <td>{stat.hard}</td>
                      <td>
                        <span class="total-count">{stat.total}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
