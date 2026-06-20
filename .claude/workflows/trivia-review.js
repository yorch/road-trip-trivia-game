export const meta = {
  name: 'trivia-review',
  description:
    'Review all curated trivia questions against the rubric defined in the trivia-quality-review skill',
  phases: [
    {
      title: 'Discover',
      detail:
        'Resolve project root and read the topic list from the curated index',
    },
    {
      title: 'Review',
      detail: 'Evaluate each topic file in parallel using Haiku agents',
    },
    {
      title: 'Synthesize',
      detail: 'Aggregate findings and produce a summary report',
    },
  ],
};

// Output contract: this workflow does NOT write files itself (workflow scripts have no
// filesystem access, and asking an agent to transcribe a large findings JSON truncates it).
// It returns a `files` map of { absolutePath: contents }; the caller writes them verbatim.

const SKILL_PATH_REL = '.claude/skills/trivia-quality-review/SKILL.md';
const CURATED_REL = 'public/data/curated';

// ── Phase 1: Discover ───────────────────────────────────────────────────────
// Resolve the absolute project root (so every downstream path is absolute — the
// Read/Write tools require absolute paths) and read the canonical topic list.
phase('Discover');

const discovery = await agent(
  `${args?.basePath ? `The project root is: ${args.basePath}` : 'Run `pwd` to get the absolute path of the project root.'}
Then read the file <project-root>/${CURATED_REL}/index.json. It maps each topic id to its
per-difficulty question counts, e.g. { "ancient-egypt": { "easy": 55, "medium": 55, "hard": 55 } }.
Return the absolute project root and the full topic list with those counts.`,
  {
    label: 'discover-topics',
    effort: 'low',
    schema: {
      type: 'object',
      required: ['projectRoot', 'topics'],
      properties: {
        projectRoot: {
          type: 'string',
          description: 'Absolute path to the project root',
        },
        topics: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'easy', 'medium', 'hard'],
            properties: {
              id: { type: 'string' },
              easy: { type: 'number' },
              medium: { type: 'number' },
              hard: { type: 'number' },
            },
          },
        },
      },
    },
  },
);

if (!discovery || !discovery.topics?.length) {
  throw new Error('Discovery failed: no topics found in the curated index');
}

const ROOT = (args?.basePath ?? discovery.projectRoot).replace(/\/$/, '');
const SKILL_PATH = `${ROOT}/${SKILL_PATH_REL}`;
const OUTPUT_DIR = `${ROOT}/tmp/trivia-review`;
const topics = discovery.topics;

// ── Phase 2: Review ─────────────────────────────────────────────────────────
// Each agent reads the rubric straight from SKILL.md (single source of truth — the
// rubric is never duplicated here) and returns only the problem questions. "good"
// questions are derived by subtraction, so agents never self-report counts.

const FINDING_SCHEMA = {
  type: 'object',
  required: ['topic', 'findings'],
  properties: {
    topic: { type: 'string' },
    findings: {
      type: 'array',
      description:
        'Only questions with verdict "review" or "flag" — never "good"',
      items: {
        type: 'object',
        required: ['difficulty', 'index', 'q', 'a', 'verdict', 'issues'],
        properties: {
          difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
          index: {
            type: 'number',
            description: '0-based index within that difficulty array',
          },
          q: { type: 'string' },
          a: { type: 'string' },
          verdict: { type: 'string', enum: ['review', 'flag'] },
          issues: {
            type: 'array',
            items: {
              type: 'object',
              required: ['criterion', 'severity', 'note'],
              properties: {
                criterion: { type: 'string' },
                severity: { type: 'string', enum: ['warn', 'fail'] },
                note: {
                  type: 'string',
                  description: 'Concise explanation of the problem',
                },
              },
            },
          },
        },
      },
    },
  },
};

phase('Review');
log(`Reviewing ${topics.length} topics in parallel...`);

const reviewResults = await parallel(
  topics.map((t) => async () => {
    const filePath = `${ROOT}/${CURATED_REL}/${t.id}.json`;

    const prompt = `You are a trivia quality reviewer for "Road Trip Trivia", a casual open-ended
(no multiple choice) road trip game where an answer is hidden then revealed.

First, read the rubric at: ${SKILL_PATH}
It is the single source of truth — it defines the 7 criteria, the easy/medium/hard calibration
guide, the verdicts (good / review / flag), and special per-topic notes. Apply it exactly.

Then read the trivia question file at: ${filePath}
This topic has ${t.easy} easy, ${t.medium} medium, and ${t.hard} hard questions. Review every one.

Output rules:
- Include ONLY questions whose verdict is "review" or "flag". Never list "good" questions —
  they are counted by subtraction, so listing them just bloats the output.
- Duplicate detection: compare questions only within the same difficulty level.
- Be strict but fair — flag real problems, not stylistic preferences.
- List each distinct problem as its own entry in "issues".
- "index" is the 0-based position of the question within its difficulty array.

Return the structured findings for topic "${t.id}".`;

    return agent(prompt, {
      label: `review:${t.id}`,
      phase: 'Review',
      schema: FINDING_SCHEMA,
      model: 'claude-haiku-4-5-20251001',
      effort: 'medium',
    });
  }),
);

const valid = reviewResults.filter(Boolean);
log(`Completed: ${valid.length}/${topics.length} topics reviewed`);

// Deterministic aggregation — totals come from index.json, review/flag from the findings
// array itself, good = remainder. No reliance on any agent's self-reported counts.
const countsById = new Map(topics.map((t) => [t.id, t]));

const topicStats = valid
  .map((r) => {
    const c = countsById.get(r.topic) ?? { easy: 0, medium: 0, hard: 0 };
    const total = c.easy + c.medium + c.hard;
    const review = r.findings.filter((f) => f.verdict === 'review').length;
    const flag = r.findings.filter((f) => f.verdict === 'flag').length;
    const good = Math.max(0, total - review - flag);
    return { topicId: r.topic, total, good, review, flag };
  })
  .sort((a, b) => b.flag - a.flag || b.review - a.review);

const totalStats = topicStats.reduce(
  (acc, t) => ({
    total: acc.total + t.total,
    good: acc.good + t.good,
    review: acc.review + t.review,
    flag: acc.flag + t.flag,
  }),
  { total: 0, good: 0, review: 0, flag: 0 },
);

const allFindings = valid.flatMap((r) =>
  r.findings.map((f) => ({ ...f, topicId: r.topic })),
);

// ── Phase 3: Synthesize ─────────────────────────────────────────────────────
// The agent only writes prose (what LLMs are good at) and returns it as text.
// It does NOT touch the filesystem — the caller persists the returned files.
phase('Synthesize');

const goodPct = totalStats.total
  ? Math.round((totalStats.good / totalStats.total) * 100)
  : 0;

const synthesisPrompt = `Write a quality review report for "Road Trip Trivia". You reviewed
${totalStats.total} questions across ${valid.length} topics.

## Overall stats
- Total questions: ${totalStats.total}
- Good (no issues): ${totalStats.good} (${goodPct}%)
- Needs review (warnings): ${totalStats.review}
- Flagged (failures): ${totalStats.flag}

## Per-topic stats (sorted by flag count)
${topicStats.map((t) => `- ${t.topicId}: ${t.flag} flags, ${t.review} warnings, ${t.total} total`).join('\n')}

## All findings (review + flag questions only)
${JSON.stringify(allFindings, null, 2)}

---

Write a comprehensive Markdown report with exactly these sections:
- # Road Trip Trivia — Quality Review Report
- ## Executive Summary (overall quality as a letter grade A–F, the key numbers, a 2–3 sentence assessment)
- ## Issues by Category (group every issue by criterion — Factual Accuracy, Difficulty Calibration, Question Clarity, Answer Quality, Topic Relevance, Game Suitability, Duplicates — with counts and a few notable examples each)
- ## Topics Needing Attention (top 10 topics by flag+review count, with brief notes on the patterns you see)
- ## High-Priority Fixes (the worst "flag" findings as a checklist, each with the exact q/a and what to change)
- ## Patterns & Recommendations (2–3 systemic observations and process suggestions)

Return ONLY the Markdown document as your final message. Do not write any files and do not add
any commentary before or after the document.`;

const summaryMarkdown = await agent(synthesisPrompt, {
  label: 'synthesize',
  phase: 'Synthesize',
  effort: 'high',
});

// Caller writes these verbatim (see the output contract at the top of this file).
const findingsJson = JSON.stringify(
  { stats: totalStats, topicStats, findings: allFindings },
  null,
  2,
);

return {
  outputDir: OUTPUT_DIR,
  stats: totalStats,
  topicsReviewed: valid.length,
  topicsTotal: topics.length,
  files: {
    [`${OUTPUT_DIR}/findings.json`]: findingsJson,
    [`${OUTPUT_DIR}/summary.md`]: summaryMarkdown,
  },
}
