// Builds the ordered question pool for a game from its config: gathers curated
// (and optionally generated) questions across the selected topics and
// difficulties, then shuffles deterministically with the session seed.

import { shuffleInPlace } from '../lib/shuffle';
import {
  type AnswerExamples,
  DIFFICULTIES,
  type Difficulty,
  type GameConfig,
  type Question,
  type Topic,
} from '../types';
import {
  answerExamplesSignal,
  buildAngles,
  fillTemplate,
  loadAnswerExamples,
  promptTemplates,
  topicsSignal,
} from './catalog';
import { curatedByDifficulty, loadCuratedTopic } from './curated';

const POOL_CAP = 300; // upper bound for race/timed/endless games
const GENERATED_PER_BUCKET = 10; // generated prompts per topic+difficulty

function resolveTopics(config: GameConfig): Topic[] {
  const all = topicsSignal.value;
  if (config.topicIds.length === 0) return all;
  const wanted = new Set(config.topicIds);
  return all.filter((t) => wanted.has(t.id));
}

function difficultiesFor(config: GameConfig): Difficulty[] {
  return config.difficulty === 'mixed' ? DIFFICULTIES : [config.difficulty];
}

function generateForBucket(
  topic: Topic,
  difficulty: Difficulty,
  examples: AnswerExamples,
): Question[] {
  const topicExamples = examples[topic.id] ?? {};
  const angles = buildAngles(topic).filter((a) => topicExamples[a]?.length);
  if (angles.length === 0) return [];

  const templates = promptTemplates[difficulty];
  const out: Question[] = [];
  for (let i = 0; i < GENERATED_PER_BUCKET; i += 1) {
    const angle = angles[i % angles.length];
    const prompt = fillTemplate(
      templates[i % templates.length],
      topic.name,
      angle,
      i,
    );
    const pool = topicExamples[angle];
    const start = i % pool.length;
    const picks: string[] = [];
    for (let k = 0; k < Math.min(3, pool.length); k += 1) {
      picks.push(pool[(start + k) % pool.length]);
    }
    out.push({
      id: `g:${topic.id}:${difficulty}:${i}`,
      prompt,
      answer: picks.join(' · '),
      examples: picks,
      generated: true,
      angle,
      difficulty,
      topicId: topic.id,
      topicName: topic.name,
      category: topic.category,
    });
  }
  return out;
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
  const includeGenerated = config.contentMode === 'all';

  if (includeGenerated) await loadAnswerExamples();
  const examples = answerExamplesSignal.value;

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
      if (includeGenerated) {
        all.push(...generateForBucket(topic, difficulty, examples));
      }
    }
  });

  shuffleInPlace(all, seed);
  return all.slice(0, targetSize(config, all.length));
}
