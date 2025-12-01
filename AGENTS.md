# Project / Repository Guidelines

This file provides guidance to AI Agents when working with code in this repository.

## Project Overview

Road Trip Trivia is a TypeScript trivia game application built with Vite. Features:

- 81 topics across 9 categories (Movies & TV, Books & Lore, Music, Theater, History, Science & Nature, Sports & Games, Travel & Places, Lifestyle & Fun)
- Three difficulty levels (easy, medium, hard) with 80 questions each
- Curated factual questions loaded from JSON (240+ questions across priority topics)
- Generated questions using templates and real answer examples
- Question mode toggle: "All questions" vs "Curated only"
- Score tracking, streak management, and progress persistence via localStorage
- Offline support with PWA (Progressive Web App) via vite-plugin-pwa
- Reactive state management using Preact Signals
- Client-side only implementation with no backend

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
```

## Architecture

### Module Structure (TypeScript + ES6 Modules via Vite)

**src/main.tsx** - Application entry point

- Initialization orchestration and PWA registration via vite-plugin-pwa
- Renders the root `<App />` component
- Initializes game state via `initGame()`

**src/types.ts** - TypeScript type definitions

- Core types: `Topic`, `Difficulty`, `QuestionMode`, `Question`, `State`, `Progress`
- Type guards and utility types for runtime safety
- Shared interfaces across all modules

**src/utils.ts** - Pure utility functions

- `shuffleIndices()`: Deterministic shuffle using linear congruential generator
- `fillTemplate()`: Template string replacement for question generation
- `buildAngles()`: Combines topic tags + category angles + general angles
- `ErrorHandler`: Toast notification system (info, warn, critical)
- `escapeHtml()`: XSS protection for user-facing content
- Constants: difficulty levels, question modes, debounce timings

**State Module** (`src/state/`) - Reactive state management

- `index.ts`: Main state exports and Preact Signals integration
  - `state` signal: Current session (topicId, difficulty, questionMode, revealed)
  - `scoreboard` signal: Reactive score, streak, asked tracking
  - Signal effects for automatic UI updates
- `questions.ts`: Question bank and generation logic
  - `questionBank` cache: Questions by topic/difficulty/mode
  - Lazy question generation: Creates questions only when needed
- `persistence.ts`: localStorage integration
  - Progress persistence across sessions
  - Preference storage (topic, difficulty, mode)
- `progress.ts`: Question tracking
  - Per-topic/difficulty progress (order, cursor)
  - Deterministic shuffle management
- `curated-cache.ts`: Curated questions management
  - Async loading from `/public/curated/[topic-id].json`
- `game-logic.ts`: Core game actions
  - `nextQuestion()`, `revealAnswer()`, `resetProgress()`
  - Encapsulates game rules and state transitions
- `init.ts`: App initialization
  - `initGame()`: Loads data, restores session, sets up effects

**Components Module** (`src/components/`) - Preact UI components

- `App.tsx`: Main application shell
  - Layout structure
  - Conditional rendering based on loading state
- `QuestionCard.tsx`: Displays current question and answer
  - Handles reveal/next interactions
  - Renders HTML-escaped content safely
- `Scoreboard.tsx`: Displays score, streak, and progress
  - Reacts to `scoreboard` signal changes
- `TopicPicker.tsx`: Topic selection modal
  - Search and filtering (all topics vs curated only)
  - Category-based organization
- `CuratedListDialog.tsx`: Dialog to show available curated questions

**src/data/data.ts** (203 lines) - Data module and loader

- `loadStaticData()`: Async function to load topics and answer examples from JSON files
- `topicList`: Empty array populated by loadStaticData() - 81 topics with id, name, category, tags
- `answerExamples`: Empty object populated by loadStaticData() - real-world answers by topic → angle
- `categoryAngles`: Category-specific question perspectives (kept in TypeScript)
- `promptTemplates`: Question templates by difficulty (kept in TypeScript)
- `answerTemplates`: Generic answer templates (kept in TypeScript)

**public/data/topics.json** (12 KB) - Topic list data

- JSON array of 81 topics with id, name, category, tags
- Loaded asynchronously at app initialization via fetch()
- Available offline via PWA service worker caching

**public/data/answer-examples.json** (16 KB) - Answer examples data

- JSON object mapping topics to answer examples by angle
- Real-world examples for 11 topics (lotr, star-wars, marvel, harry-potter, music-legends, us-history, space-exploration, soccer, disney-classics, modern-games, world-history)
- Loaded asynchronously at app initialization via fetch()
- Available offline via PWA service worker caching

**Curated Questions** - Factual Q&A

- **public/curated/index.json** - Index file listing available topic IDs (automatically maintained)
- **public/curated/[topic-id].json** (21 individual files, 4-12 KB each)
- Loaded on-demand per topic for better performance
- Index prevents unnecessary 404 errors for topics without curated questions
- Structure per file: `{ "easy": [], "medium": [], "hard": [] }`

Question structure:

- Each question: `{ q: "question", a: "answer", angle: "category angle" }`
- Loaded asynchronously with AbortController and parallel fetching
- Index-based loading: fetches index first, then only loads available topic files

### Key Data Flow

**Question Generation (Lazy + Cached)**

1. User selects topic/difficulty/mode → `getOrCreateQuestions(topicId, difficulty, mode)`
2. Check cache: `questionBank[topicId][cacheKey]` where `cacheKey = "${difficulty}_${mode}"`
3. If cache miss → `createQuestions(topic, difficulty, mode)`:
   - Add curated questions first (from JSON)
   - If "curated only" mode → return curated questions only
   - If "all" mode → fill remaining slots (up to 80) with generated questions using templates
   - Prefer angles with real answer examples over generic templates
4. Cache result and return

**Progress Tracking (Deterministic Shuffle)**

1. First time accessing topic/difficulty → `shuffleIndices(bankSize, seed)` creates random but consistent order
2. `progress[topicId][difficulty] = { order: [shuffled indices], cursor: 0 }`
3. Each question advance → increment cursor
4. When cursor reaches end → show "questions exhausted" state
5. Reset progress → mark for lazy reshuffle (`needsReshuffle: true`)

**State Persistence (via Preact Signals Effects)**

- `localStorage.setItem('questionProgress', JSON.stringify(progress))` - After cursor advances
- `localStorage.setItem('scoreboard', JSON.stringify(scoreboard.value))` - Reactive updates via signal effects
- `localStorage.setItem('lastTopicId', topicId)` - When topic selected
- `localStorage.setItem('difficulty', difficulty)` - When difficulty changed
- `localStorage.setItem('questionMode', mode)` - When question mode toggled
- Automatic persistence triggered by signal mutations (no manual saveState() calls needed)

### Important Implementation Details

**Security**

- All user-facing content (questions, answers, topic names) passes through `escapeHtml()` before rendering
- Curated questions loaded from static JSON (not executable JS) to prevent code injection
- HTML entities escaped: `&`, `<`, `>`, `"`, `'`

**Performance Optimizations**

- Lazy loading: Questions generated only when topic/difficulty accessed
- Modular loading: Individual curated topic files (4-12 KB each)
- Parallel fetching: All topic files loaded concurrently for faster initialization
- Caching: Generated questions cached per `${difficulty}_${mode}` to avoid regeneration
- Debouncing: Search input (300ms), mode changes (150ms), reload button (2000ms cooldown)
- AbortController: Cancels previous fetch requests when reloading curated questions
- Lazy reshuffle: Reset progress doesn't regenerate questions immediately

**Mode Switching Behavior**

- Switching "all" ↔ "curated only" clears current topic's progress (not other topics)
- Rebuilds question bank with new mode
- If topic has no curated questions in "curated only" mode → shows empty state

**Error Handling**

- Toast notification system with 3 levels: info (blue), warn (orange), critical (red)
- localStorage failures logged but don't crash app
- Missing curated question files → graceful fallback to generated questions only
- Invalid topic recovery → attempts reset to first available topic

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
- **HTML escaping**: Always escape user-facing content via `escapeHtml()`
- **Reactive patterns**: Use Preact Signals for state, effects for side effects (persistence, DOM updates)

## Vite Configuration

- **Base path**: `'./'` for relative URLs (supports subdirectory deployment)
- **Output directory**: `dist/`
- **Source maps**: Enabled in production builds
- **Dev server**: Port 3000 with auto-open browser
- **Module imports**: CSS imported in main.ts, processed by Vite
- **Public directory**: Static assets (curated-questions.json, icons)
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

2. Optionally add curated questions to `public/curated/[topic-id].json`
3. Optionally add answer examples to `public/data/answer-examples.json`

### Curated Questions

Edit individual topic file in `public/curated/[topic-id].json`:

```json
{
  "easy": [
    { "q": "Question?", "a": "Answer", "angle": "quote" }
  ],
  "medium": [...],
  "hard": [...]
}
```

After adding a new topic file, update the index:

```bash
yarn update-index
```

Users can reload curated questions without redeploying via "↻ Reload" button in topic picker.

### Answer Examples

Add to `public/data/answer-examples.json`:

```json
{
  "topic-id": {
    "angle-name": [
      "Real example 1",
      "Real example 2",
      "Real example 3"
    ]
  }
}
```

These are used when generating template-based questions to provide factual content instead of generic placeholders.

## Key Technologies

- **TypeScript 5.9.3**: Type-safe development with strict mode
- **Vite 7.2.4**: Fast build tool and dev server
- **Preact Signals 1.12.1**: Fine-grained reactive state management
- **Biome 2.3.8**: Fast linting and formatting
- **vite-plugin-pwa 1.2.0**: Progressive Web App capabilities with Workbox
