---
name: trivia-quality-review
description: >
  Evaluate curated trivia questions for Road Trip Trivia against a 7-criterion quality rubric.
  Use this skill whenever the user mentions reviewing, auditing, checking, or improving trivia
  questions — including adding new questions, evaluating a curated file, spotting duplicates,
  or checking difficulty calibration. Even a casual "does this question look good?" should
  trigger this skill. For full-corpus bulk reviews, invoke the workflow at
  .claude/workflows/trivia-review.js; for ad-hoc single-topic reviews, apply the rubric
  directly to the file.
version: 1.0.0
---

# Road Trip Trivia — Question Quality Review Skill

## Purpose

Evaluate questions in `public/data/curated/[topic].json` against a consistent rubric.
Produces a report of flagged questions with actionable issues so they can be fixed or removed.

---

## The Rubric

Each question (`q`, `a`, `angle`) is rated on 7 criteria:

### 1. Factual Accuracy
Is the answer verifiably correct for the topic?
- `pass` — Definitively correct
- `warn` — Correct but incomplete, or has a widely-accepted alternate answer that would also be valid
- `fail` — Factually wrong, outdated, or misleading

### 2. Difficulty Calibration
Does the question match its placement (easy / medium / hard)?
- `pass` — Appropriate for the level
- `warn` — Slightly off (e.g., a universally-known fact in medium)
- `fail` — Clearly wrong level (hard-level obscurity in easy; trivial fact in hard)

**Calibration guide:**
| Level  | Expectation |
|--------|-------------|
| Easy   | Famous names, core concepts, iconic facts — things most people have heard of |
| Medium | Requires genuine interest/knowledge of the topic, not deep expertise |
| Hard   | Specific dates, obscure characters, technical details, lesser-known records |

### 3. Question Clarity
Is the question unambiguous and grammatically well-formed?
- `pass` — Clear and specific
- `warn` — Minor ambiguity (e.g., "What animal was sacred?" when many were sacred)
- `fail` — Unclear, grammatically broken, or could refer to multiple distinct things

### 4. Answer Quality
Is the answer precise enough to be checkable without debate?
- `pass` — Unambiguous, verifiable
- `warn` — Vague, overly broad, or requires knowing exactly what the question-setter had in mind
- `fail` — Circular, unanswerable, trivially obvious from the question itself, or missing key specifics

### 5. Topic Relevance
Does the question genuinely belong to this topic?
- `pass` — On-topic
- `warn` — Tangential — touches the topic but primarily tests knowledge of something else
- `fail` — Off-topic

### 6. Game Suitability
Is this a good road trip trivia question — fun, engaging, fair for groups?
- `pass` — Tests satisfying knowledge; generates good discussion
- `warn` — Too trivial to be rewarding, too academic in phrasing, or so obscure that most fans wouldn't know it even at hard difficulty
- `fail` — Unanswerable without reference material mid-trip; alienates all players regardless of difficulty; or the "win" feeling is absent (no one would care about getting it right)

### 7. Duplicates
Is this a duplicate or near-duplicate of another question in the same topic + difficulty?
- `pass` — Unique
- `warn` — Overlapping — tests the same specific fact as another question
- `fail` — Exact or near-exact duplicate

---

## Verdicts

| Verdict      | Condition |
|--------------|-----------|
| `✅ good`    | All 7 criteria pass |
| `⚠️ review`  | One or more `warn` findings |
| `❌ flag`    | One or more `fail` findings |

---

## Topic Contexts

Some topics have special considerations:

| Topic | Note |
|-------|------|
| `kpop-demon-hunters` | Based on the 2025 Netflix animated film — questions about the fictional universe are valid |
| `mythology` | Multiple mythological traditions exist; prefer questions that specify Greek/Roman/Norse etc. |
| `world-capitals` | Capitals change; verify against current geopolitical status |
| `tech-giants` / `tech-innovations` | Fast-moving field; verify facts aren't outdated |
| `robotics` | Academic/technical topic — "game suitability" threshold is relaxed for hard questions |

---

## Output Format

```json
{
  "topic": "topic-id",
  "findings": [
    {
      "difficulty": "easy",
      "index": 3,
      "q": "What animal was sacred to Egyptians?",
      "a": "Cats (among others)",
      "verdict": "review",
      "issues": [
        {
          "criterion": "Question Clarity",
          "severity": "warn",
          "note": "Many animals were sacred (cats, ibis, crocodiles, scarabs). Question implies a single answer."
        },
        {
          "criterion": "Answer Quality",
          "severity": "warn",
          "note": "'(among others)' in the answer signals the question is too vague to have a clear winner."
        }
      ]
    }
  ],
  "stats": { "total": 165, "good": 140, "review": 18, "flag": 7 }
}
```
