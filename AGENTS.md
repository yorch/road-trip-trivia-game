# Project / Repository Guidelines

This file provides guidance to AI Agents when working with code in this repository.

## Project Overview

Road Trip Trivia is a TypeScript **quizmaster party game** built with Vite. One
person (the host) holds the phone, reads each question aloud, and taps who got
it; players or teams compete across a configurable game to a results screen.

Features:

- **Quizmaster model**: host reads aloud (TTS), taps the entrant who answered; the device is reader + scoreboard
- **Game flow**: Home (Resume / Quick Play / New Game) → Setup → Game → Results
- **Configurable setup**: players or teams (solo works), topic scope (everything / pick topics), difficulty (mixed or fixed), and end mode (fixed question count / race to N points / timed / endless)
- **Difficulty-weighted scoring**: easy 1 / medium 2 / hard 3, plus a streak bonus every 3rd consecutive correct (a successful answer breaks everyone else's streak)
- **Content**: 5000+ curated factual questions covering all 43 topics — every question has a single answer (curated-only)
- **Resume & Quick Play**: in-progress game and last-used config persist to localStorage
- Hash-based routing (`/`, `/setup`, `/game`, `/results`) via wouter-preact
- Themes (Warm Americana, Night Drive, Coastal) and read-aloud voice/speed/pitch controls
- Offline support via PWA (vite-plugin-pwa); reactive state via Preact Signals; client-side only, no backend

## Commands

### Development

```bash
yarn dev              # Start Vite dev server on port 3000
yarn build            # Build production bundle to dist/
yarn preview          # Preview production build
yarn update-index     # Update curated questions index
```

### Code Quality

```bash
yarn lint             # Run Biome linter
yarn lint:fix         # Auto-fix linting issues
yarn format           # Format code with Biome
yarn typecheck        # Type-check with tsc (the build does NOT type-check)
yarn test             # Run unit tests (Vitest)
yarn test:watch       # Run unit tests in watch mode
```

> Note: `yarn build` uses Vite/esbuild, which strips types without checking
> them. Run `yarn typecheck` (also enforced in CI) to catch type errors.

## Architecture

`src/` is organized by responsibility. Reactive state uses Preact Signals;
routing is hash-based via wouter-preact.

### Module structure

**Entry & shell**

- `main.tsx` — loads topics + curated index, restores any in-progress game (`resumeSession`), renders `<App />`
- `App.tsx` — hash router with routes `/` (Home), `/setup` (Setup), `/game` (Game), `/results` (Results)
- `types.ts` — content types (`Topic`, `Difficulty`, `Question`, …) and session types (`Entrant`, `GameConfig`, `GameSession`, `EntrantScore`, `AwardResult`, `EndMode`, …)

**`lib/`** — framework-agnostic primitives

- `shuffle.ts` — seeded Fisher-Yates (`shuffleInPlace`/`shuffled`); deterministic per seed
- `storage.ts` — guarded localStorage helpers (`readJSON`/`writeJSON`/…)
- `html.ts` — `escapeHtml` (only for the toast `innerHTML` path; Preact escapes JSX)
- `toast.ts` — `toast.{info,success,warn,error}` notifications

**`content/`** — question content

- `catalog.ts` — topic list loader plus category helpers (`categories`, `topicIdsForCategory`, `topicsForCategory`)
- `curated.ts` — curated index + per-topic file loading (cached), `curatedStats`/`hasCurated`
- `provider.ts` — `buildPool(config, seed)`: gathers curated questions across the selected topics/difficulties and deterministically shuffles them into the game's ordered pool

**`session/`** — game engine

- `scoring.ts` — pure scoring: `basePoints` (1/2/3), `bonusForStreak`, `applyCorrect`. Unit-tested in `scoring.test.ts`
- `session.ts` — the `sessionSignal` state machine: `startGame`, `reveal`, `award(entrantId|null)`, `finishGame`, `clearSession`, `resumeSession`, `standings`. Persists the active game (Resume) and last config (Quick Play / Rematch)
- `config.ts` — `defaultConfig`, `genId`, entrant-name defaults

**Screens (`screens/`)** — `Home`, `Setup`, `Game`, `Results`

**Components (`components/`)** — `QuestionCard`, `Scoreboard` (live HUD), `EntrantButtons` ("who got it?"), plus ported `icons.tsx`, `ThemeToggle`, `SpeechSettings`

**Root modules** — `theme.ts` (theme signal + `data-theme`), `speech.ts` (TTS signals + `speak`/`stopSpeech`)

### Content data (`public/data/`, unchanged by the rewrite)

- `topics.json` — 43 topics (id, name, category, tags), loaded at startup
- `curated/index.json` — per-topic counts `{ easy, medium, hard }` (maintained by `yarn update-index`)
- `curated/[topic-id].json` — `{ easy: [], medium: [], hard: [] }`, each entry `{ q, a, angle }`; loaded on demand, cached per topic

### Key data flow

**Starting a game** (`startGame(config)`):

1. Pick a random `seed`, then `buildPool(config, seed)` collects curated questions from the selected topics × difficulties, tagging each with its source topic.
2. The pool is shuffled deterministically by `seed` and capped (the target count for `count` mode, else `POOL_CAP`).
3. A `GameSession` (pool, cursor, per-entrant scores, status, optional `endsAt` for timed) is stored in `sessionSignal` and persisted.

**Playing** (per question): `reveal()` shows the answer → host calls `award(entrantId | null)` → scorer gets difficulty-weighted points + any streak bonus, everyone else's streak resets, cursor advances, and `isGameOver` (count / race / timed / endless) flips status to `finished` when met.

**Persistence**: the active session is written to localStorage on every change (cleared when finished/abandoned) so Home can offer **Resume**; the last `GameConfig` is saved for **Quick Play** and **Rematch**.

### Important implementation details

- **Security**: content renders via Preact JSX (auto-escaped); `escapeHtml` is only used for the toast `innerHTML`. Curated questions are static JSON, never executable.
- **Answer reveal**: the answer/examples are rendered only once `revealed` (kept out of the DOM/accessibility tree beforehand).
- **Determinism**: a saved game resumes identically because the pool order derives from the stored `seed`.
- **Reduced motion**: animations collapse under `prefers-reduced-motion`.
- **Error handling**: storage access is guarded everywhere; a failed initial content load surfaces a toast rather than crashing.

## Git Workflow

Based on commit history:

- **feat:** New features, enhancements, curated content additions
- **fix:** Bug fixes, path corrections, service worker updates
- **refactor:** Code reorganization, modularization, style improvements
- Work directly on `main` branch
- Descriptive commit messages with context (what + why when non-obvious)

## Code Style

- **TypeScript**: Strict mode enabled, explicit types for public APIs
- **No semicolons**: Enforced by Biome linter
- **ES6+ modules**: `import`/`export`, arrow functions, template literals, `const`/`let`
- **Functional approach**: Pure functions in utils.ts, state mutations via Preact Signals
- **Naming conventions**: camelCase for variables/functions, SCREAMING_SNAKE_CASE for constants, PascalCase for types
- **Type safety**: Prefer type inference where clear, explicit types for function boundaries
- **Comments**: Explain non-obvious logic, magic numbers, and architectural decisions
- **HTML escaping**: Preact escapes JSX text automatically; only use `escapeHtml()` when building `innerHTML` directly
- **Reactive patterns**: Use Preact Signals for state, effects for side effects (persistence, DOM updates)

## Vite Configuration

- **Base path**: `'./'` for relative URLs (supports subdirectory deployment)
- **Output directory**: `dist/`
- **Source maps**: Enabled in production builds
- **Dev server**: Port 3000 with auto-open browser
- **Module imports**: CSS imported in main.ts, processed by Vite
- **Public directory**: Static assets (`data/` JSON files, icons)
- **PWA Plugin**: vite-plugin-pwa with Workbox
  - Auto-update strategy for service worker
  - Runtime caching for JSON files (1 week expiration)
  - Offline support with manifest.json generation
  - Asset precaching for JS, CSS, HTML, JSON

## Adding Content

### New Topics

1. Add to `public/data/topics.json`:

   ```json
   {
     "id": "unique-id",
     "name": "Display Name",
     "category": "Category Name",
     "tags": ["tag1", "tag2", "tag3", "tag4"]
   }
   ```

2. Add curated questions to `public/data/curated/[topic-id].json` (a topic with no curated questions can't be played)

### Curated Questions

Edit individual topic file in `public/data/curated/[topic-id].json`:

```json
{
  "easy": [
    { "q": "Question?", "a": "Answer", "angle": "quote" }
  ],
  "medium": [...],
  "hard": [...]
}
```

After adding or changing a topic file, update the index:

```bash
yarn update-index
```

## Key Technologies

- **TypeScript 6.0**: Type-safe development with strict mode
- **Vite 8**: Fast build tool and dev server
- **Preact 10 + Preact Signals 2.9**: UI and fine-grained reactive state
- **wouter-preact 3**: Minimal hash-based routing
- **Biome 2.5**: Fast linting and formatting
- **Vitest 4**: Unit testing
- **vite-plugin-pwa 1.3**: Progressive Web App capabilities with Workbox

(See `package.json` for exact pinned versions.)
