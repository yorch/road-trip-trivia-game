import { useEffect, useState } from 'preact/hooks';
import { topicList } from '../data/data';
import { loadCuratedTopicIndex, showCuratedListSignal } from '../state';
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
    const topics = topicList || [];

    const promises = topics.map(async (topic: Topic) => {
      try {
        const response = await fetch(`curated/${topic.id}.json`);
        if (!response.ok) return null;
        const data = await response.json();

        const easy = data.easy?.length || 0;
        const medium = data.medium?.length || 0;
        const hard = data.hard?.length || 0;
        const total = easy + medium + hard;

        if (total === 0) return null;

        return {
          topic,
          easy,
          medium,
          hard,
          total,
        };
      } catch {
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results
      .filter((r): r is CuratedTopicStats => r !== null)
      .sort((a, b) => b.total - a.total);
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
