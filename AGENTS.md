# Project / Repository Guidelines

This file provides guidance to AI Agents when working with code in this repository.

## Project Overview

Road Trip Trivia is a vanilla JavaScript trivia game application built with Vite. Features:

- 81 topics across 9 categories (Movies & TV, Books & Lore, Music, Theater, History, Science & Nature, Sports & Games, Travel & Places, Lifestyle & Fun)
- Three difficulty levels (easy, medium, hard) with 80 questions each
- Curated factual questions loaded from JSON (240+ questions across priority topics)
- Generated questions using templates and real answer examples
- Question mode toggle: "All questions" vs "Curated only"
- Score tracking, streak management, and progress persistence via localStorage
- Offline support with service worker
- Client-side only implementation with no backend

## Commands

### Development

```bash
yarn dev              # Start Vite dev server on port 3000
yarn build            # Build production bundle to dist/
yarn preview          # Preview production build
```

### Code Quality

```bash
yarn lint             # Run Biome linter
yarn lint:fix         # Auto-fix linting issues
yarn format           # Format code with Biome
```

## Architecture

### Module Structure (ES6 Modules via Vite)

**src/js/main.js** (157 lines) - Application entry point

- Initialization orchestration and service worker registration
- Data validation and dependency checks
- Session restoration (last topic, difficulty, question mode, scoreboard)
- Exposes globals to `window` for backward compatibility

**src/js/state.js** (424 lines) - State management

- `state` object: Current session (topicId, difficulty, questionMode, score, streak, asked, revealed)
- `progress` object: Per-topic/difficulty question tracking (order, cursor)
- `questionBank` object: Cached questions by topic/difficulty/mode
- localStorage persistence for progress, preferences, and scoreboard
- Lazy question generation: Creates questions only when needed
- Async curated questions loading from `/public/curated-questions.json`

**src/js/ui.js** (557 lines) - DOM manipulation and rendering

- Question card rendering with HTML escaping for security
- Topic picker modal with search and filtering (all topics vs curated only)
- Event binding for all user interactions
- Scoreboard updates and difficulty/mode button management
- Debounced search and mode changes to prevent excessive operations

**src/js/utils.js** (172 lines) - Pure utility functions

- `shuffleIndices()`: Deterministic shuffle using linear congruential generator
- `fillTemplate()`: Template string replacement for question generation
- `buildAngles()`: Combines topic tags + category angles + general angles
- `ErrorHandler`: Toast notification system (info, warn, critical)
- `escapeHtml()`: XSS protection for user-facing content
- Constants: difficulty levels, question modes, debounce timings

**src/data/data.js** (1147 lines) - Static game data

- `topicList`: 81 topics with id, name, category, tags
- `categoryAngles`: Category-specific question perspectives
- `promptTemplates`: Question templates by difficulty (easy, medium, hard)
- `answerTemplates`: Generic answer templates (fallback when no examples exist)
- `answerExamples`: Real-world answers organized by topic → angle (e.g., Star Wars → iconic scene)

**public/curated-questions.json** (234 KB) - Factual Q&A

- Hand-written trivia with verifiable answers
- Structure: `{ "topic-id": { "easy": [], "medium": [], "hard": [] } }`
- Each question: `{ q: "question", a: "answer", angle: "category angle" }`
- Loaded asynchronously at app initialization with AbortController

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

**State Persistence**

- `localStorage.setItem('questionProgress', JSON.stringify(progress))` - After cursor advances
- `localStorage.setItem('scoreboard', JSON.stringify({ score, streak, asked }))` - After score changes
- `localStorage.setItem('lastTopicId', topicId)` - When topic selected
- `localStorage.setItem('difficulty', difficulty)` - When difficulty changed
- `localStorage.setItem('questionMode', mode)` - When question mode toggled

### Important Implementation Details

**Security**

- All user-facing content (questions, answers, topic names) passes through `escapeHtml()` before rendering
- Curated questions loaded from static JSON (not executable JS) to prevent code injection
- HTML entities escaped: `&`, `<`, `>`, `"`, `'`

**Performance Optimizations**

- Lazy loading: Questions generated only when topic/difficulty accessed
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
- Missing curated questions file → graceful fallback to generated questions only
- Invalid topic recovery → attempts reset to first available topic

## Git Workflow

Based on commit history:

- **feat:** New features, enhancements, curated content additions
- **fix:** Bug fixes, path corrections, service worker updates
- **refactor:** Code reorganization, modularization, style improvements
- Work directly on `main` branch
- Descriptive commit messages with context (what + why when non-obvious)

## Code Style

- **No semicolons**: Enforced by Biome linter
- **ES6+ modules**: `import`/`export`, arrow functions, template literals, `const`/`let`
- **Functional approach**: Pure functions in utils.js, state mutations isolated in state.js
- **Naming conventions**: camelCase for variables/functions, SCREAMING_SNAKE_CASE for constants
- **Comments**: Explain non-obvious logic, magic numbers, and architectural decisions
- **HTML escaping**: Always escape user-facing content via `escapeHtml()`

## Vite Configuration

- **Base path**: `'./'` for relative URLs (supports subdirectory deployment)
- **Output directory**: `dist/`
- **Source maps**: Enabled in production builds
- **Dev server**: Port 3000 with auto-open browser
- **Module imports**: CSS imported in main.js, processed by Vite
- **Public directory**: Static assets (curated-questions.json, service-worker.js)

## Adding Content

### New Topics

1. Add to `src/data/data.js` in `topicList`:

   ```javascript
   {
     id: "unique-id",
     name: "Display Name",
     category: "Category Name",
     tags: ["tag1", "tag2", "tag3", "tag4"]
   }
   ```

2. Optionally add curated questions to `public/curated-questions.json`
3. Optionally add answer examples to `answerExamples` in `src/data/data.js`

### Curated Questions

Edit `public/curated-questions.json`:

```json
{
  "topic-id": {
    "easy": [
      { "q": "Question?", "a": "Answer", "angle": "quote" }
    ],
    "medium": [...],
    "hard": [...]
  }
}
```

Users can reload curated questions without redeploying via "↻ Reload" button in topic picker.

### Answer Examples

Add to `answerExamples` in `src/data/data.js`:

```javascript
"topic-id": {
  "angle-name": [
    "Real example 1",
    "Real example 2",
    "Real example 3"
  ]
}
```

These are used when generating template-based questions to provide factual content instead of generic placeholders.
