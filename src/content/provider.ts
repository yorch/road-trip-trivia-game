// Builds the ordered question pool for a game from its config: gathers curated
// questions across the selected topics and difficulties, then shuffles them
// deterministically with the session seed.

import { shuffleInPlace } from '../lib/shuffle';
import {
  DIFFICULTIES,
  type Difficulty,
  type GameConfig,
  type Question,
  type Topic,
} from '../types';
import { topicsSignal } from './catalog';
import { curatedByDifficulty, loadCuratedTopic } from './curated';

const POOL_CAP = 300; // upper bound for race/timed/endless games

function resolveTopics(config: GameConfig): Topic[] {
  const all = topicsSignal.value;
  if (config.topicIds.length === 0) return all;
  const wanted = new Set(config.topicIds);
  return all.filter((t) => wanted.has(t.id));
}

function difficultiesFor(config: GameConfig): Difficulty[] {
  return config.difficulty === 'mixed' ? DIFFICULTIES : [config.difficulty];
}

function targetSize(config: GameConfig, available: number): number {
  if (config.endMode === 'count') return Math.min(config.target, available);
  return Math.min(POOL_CAP, available);
}

export async function buildPool(
  config: GameConfig,
  seed: number,
): Promise<Question[]> {
  const topics = resolveTopics(config);
  const difficulties = difficultiesFor(config);

  const curatedFiles = await Promise.all(
    topics.map((t) => loadCuratedTopic(t.id)),
  );

  const all: Question[] = [];
  topics.forEach((topic, ti) => {
    const file = curatedFiles[ti];
    for (const difficulty of difficulties) {
      curatedByDifficulty(file, difficulty).forEach((cq, qi) => {
        all.push({
          id: `c:${topic.id}:${difficulty}:${qi}`,
          prompt: cq.q,
          answer: cq.a,
          angle: cq.angle,
          difficulty,
          topicId: topic.id,
          topicName: topic.name,
          category: topic.category,
        });
      });
    }
  });

  shuffleInPlace(all, seed);
  return all.slice(0, targetSize(config, all.length));
}
