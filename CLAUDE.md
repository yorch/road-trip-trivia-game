# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Road Trip Trivia is a lightweight, vanilla JavaScript trivia game application designed for road trips. It features:

- 81 topics across 9 categories (Movies & TV, Books & Lore, Music, Theater, History, Science & Nature, Sports & Games, Travel & Places, Lifestyle & Fun)
- Three difficulty levels (easy, medium, hard) with 80 questions each
- Intelligent question generation with curated factual answers for priority topics
- Score tracking, streak management, and progress persistence
- Fully client-side implementation with no backend dependencies

## Architecture

### Core Components

**index.html**

- Single-page application structure
- Hero section with scoreboard (score, streak, questions asked)
- Controls for category/topic selection and difficulty buttons
- Card-based question display with answer reveal mechanism

**script.js** (main application logic)

- **Data Layer** (lines 1-1006): Topic definitions, question templates, curated Q&A, and answer examples
- **Question Generation** (lines 1008-1057): Template filling and question bank creation
- **Progress Management** (lines 1067-1096): State tracking and shuffled question ordering
- **UI Controllers** (lines 1098-1227): DOM manipulation and event handling
- **Initialization** (lines 1229-1238): App bootstrap on DOMContentLoaded

**style.css**

- Modern card-based design system
- Responsive layout for mobile/tablet/desktop
- Pill buttons, chips, and ghost button variants
- Answer reveal animations

### Data Structures

**topicList** (lines 5-82)

- Each topic has: `id`, `name`, `category`, `tags`
- Tags drive question angle generation

**categoryAngles** (lines 84-94)

- Category-specific question angles (e.g., "iconic scene" for Movies & TV)
- Used to enrich topic tags for question variety

**promptTemplates** (lines 96-159)

- Three difficulty-specific template sets
- Support numbered questions (e.g., "Quick #5:", "Expert #12:")
- Templates use `{topic}`, `{angle}`, `{n}` placeholders

**curatedQuestions** (lines 179-561)

- Factual Q&A for 10 priority topics: star-wars, marvel, harry-potter, music-legends, us-history, space-exploration, soccer, disney-classics, modern-games, world-history
- Structure: `{ q: "question text", a: "factual answer", angle: "category angle" }`
- Each topic has easy/medium/hard arrays

**answerExamples** (lines 563-1006)

- Real-world answer examples organized by topic → angle
- Used to populate generated questions with factual content
- Example: `answerExamples["star-wars"]["iconic scene"]` contains actual Star Wars scenes

### Question Generation Logic

1. **buildAngles()** (lines 1008-1012): Combines topic tags + category angles + general angles
2. **createQuestions()** (lines 1018-1057):
   - Prioritizes curated questions (factual content)
   - Filters angles to only those with real answer examples
   - Fills remaining slots (up to 80) with template-based questions
   - Uses real answer examples when available, falls back to generic templates

### State Management

**state object** (lines 1068-1075)

- `topicId`: Currently selected topic
- `difficulty`: "easy" | "medium" | "hard"
- `score`: Total correct answers
- `streak`: Consecutive correct answers
- `asked`: Total questions viewed
- `revealed`: Boolean for answer visibility

**progress object** (lines 1067, 1089-1096)

- Per-topic, per-difficulty tracking
- `order`: Shuffled indices array (deterministic based on seed)
- `cursor`: Current position in question order
- Prevents duplicate questions until all 80 are exhausted

### Key Functions

**shuffleIndices()** (lines 1077-1087)

- Deterministic shuffle using linear congruential generator
- Seed based on `topicId.length + difficulty.length`
- Ensures consistent question order across sessions

**nextQuestion()** (lines 1137-1155)

- Advances cursor in progress tracker
- Handles "questions exhausted" state
- Updates score tracking and renders new card

**toggleAnswer()** (lines 1157-1163)

- Shows/hides answer with CSS class toggle
- Updates button text ("Show answer" ↔ "Hide answer")

**markCorrect()** (lines 1165-1170)

- Increments score and streak
- Automatically advances to next question

**skipQuestion()** (lines 1172-1176)

- Resets streak to 0
- Advances without scoring

**resetProgress()** (lines 1178-1189)

- Re-shuffles all topic/difficulty combinations
- Resets score, streak, and asked counters

## Development Workflow

### No Build Process

This is a static site with no dependencies. To run:

```bash
# Option 1: Python built-in server
python3 -m http.server 8000

# Option 2: Node.js http-server (if installed)
npx http-server

# Option 3: Open directly in browser
open index.html
```

### Testing Changes

1. Modify files directly (no transpilation needed)
2. Refresh browser to see changes
3. Use browser DevTools console for debugging
4. Check `questionBank` object in console to verify question generation

### Git Workflow

Based on recent commits, the pattern is:

- **feat:** for new features (curated questions, new topics)
- **docs:** for documentation updates
- Work directly on `main` branch
- Descriptive commit messages referencing what was added/improved

## Common Development Tasks

### Adding New Topics

1. Add topic object to `topicList` (lines 5-82):

   ```javascript
   {
     id: "unique-id",
     name: "Display Name",
     category: "Category Name",
     tags: ["tag1", "tag2", "tag3", "tag4"]
   }
   ```

2. Optionally add curated questions to `curatedQuestions` (lines 179-561)
3. Optionally add answer examples to `answerExamples` (lines 563-1006)

### Adding Curated Questions

Priority approach for high-quality content:

1. Add to `curatedQuestions[topicId][difficulty]`:

   ```javascript
   "topic-id": {
     easy: [
       { q: "Question text?", a: "Factual answer", angle: "question angle" }
     ],
     medium: [...],
     hard: [...]
   }
   ```

2. Add corresponding answer examples to `answerExamples[topicId][angle]`:

   ```javascript
   "topic-id": {
     "angle-name": [
       "Example answer 1",
       "Example answer 2",
       "Example answer 3"
     ]
   }
   ```

### Adding New Categories

1. Add category to topics in `topicList`
2. Add category-specific angles to `categoryAngles` (lines 84-94):

   ```javascript
   "Category Name": ["angle1", "angle2", "angle3", ...]
   ```

### Modifying Question Templates

Edit `promptTemplates` (lines 96-159) to change question phrasing patterns. Each difficulty has two styles:

- Recognition/context-based questions (10-8 templates)
- Numbered quick-fire questions (10-7 templates)

### Debugging Question Generation

```javascript
// In browser console:
console.log(questionBank["star-wars"]["easy"]); // View all questions for topic/difficulty
console.log(progress); // Check progress tracking state
console.log(state); // View current game state
```

## Code Style Notes

- **No semicolons**: Code uses consistent semicolon-less style
- **Vanilla JS**: No frameworks, libraries, or build tools
- **ES6+**: Arrow functions, template literals, const/let, spread operators
- **Functional approach**: Pure functions for data transformations
- **Deterministic randomness**: Seeded shuffle for consistent ordering
- **Comments**: Inline comments explain magic numbers and key algorithms

## Question Quality Philosophy

Based on git history, the project evolved from generic template-based questions to prioritizing:

1. **Curated factual questions**: Real trivia with verifiable answers (10 priority topics completed)
2. **Real-world answer examples**: Actual scenes, songs, events vs generic placeholders
3. **Angle-driven diversity**: Questions vary by perspective (quote, scene, sidekick, etc.)
4. **Difficulty progression**: Easy = recognition, Medium = context/analysis, Hard = deep knowledge

When adding content, prioritize curated questions with factual answers over template-generated ones.

## File Organization

```
road-trip-trivia/
├── index.html          # Single-page app structure
├── script.js           # All application logic (1,238 lines)
├── style.css           # Complete styling (no preprocessor)
├── .git/               # Version control
└── CLAUDE.md           # This file
```

No package.json, node_modules, build configs, or deployment scripts needed - this is intentionally a simple static site.
