# 🚗 Road Trip Trivia

A lightweight TypeScript trivia game with offline PWA capabilities, designed to keep your road trips entertaining. No backend required, no ads, just pure trivia fun for the whole car.

## ✨ Features

- **43 Topics** across 7 categories: Movies & TV, Books & Lore, Music, History, Science & Nature, Sports & Games, Travel & Places
- **Three Difficulty Levels**: Easy, Medium, and Hard questions to challenge everyone
- **5000+ Curated Questions**: Hand-written factual trivia with verifiable answers
- **Generated Questions**: Template-based questions with real-world answer examples
- **Two Question Modes**:
  - **All Questions**: Mix of curated and generated content (80 questions per topic/difficulty)
  - **Curated Only**: Play exclusively hand-written trivia questions
- **Progress Tracking**: Scores, streaks, and question history saved locally
- **Read Aloud**: Text-to-speech for questions with voice, speed, and pitch controls
- **Themes**: Warm Americana, Night Drive, and Coastal (defaults to your system preference)
- **Reactive State**: Preact Signals for efficient UI updates and automatic persistence
- **PWA Support**: Installable progressive web app with offline capabilities via vite-plugin-pwa
- **Live Reload**: Update curated questions without redeploying the app
- **Type Safety**: Full TypeScript implementation with strict mode
- **Clean Interface**: Card-based design optimized for mobile and desktop

## 🎮 How to Play

1. **Choose a Topic**: Click "Choose topic" or "Surprise me" for a random selection
2. **Select Difficulty**: Easy, Medium, or Hard
3. **Pick Question Mode**: All questions or curated-only
4. **Answer Questions**: Read the question, think of your answer, then reveal
5. **Track Progress**: Mark correct answers to build your score and streak
6. **Keep Going**: 80 questions per topic/difficulty combination

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and Yarn 4.x

### Installation

```bash
# Clone the repository
git clone git@github.com:yorch/road-trip-trivia-game.git
cd road-trip-trivia-game

# Install dependencies
yarn install
```

### Running Locally

```bash
# Development server with hot reload
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Update curated questions index
yarn update-index
```

The app will open automatically at `http://localhost:3000`

## 🛠️ Development

### Project Structure

```
road-trip-trivia/
├── src/
│   ├── css/
│   │   └── style.css          # All styling
│   ├── state/                 # State management
│   │   ├── index.ts           # Preact Signals & exports
│   │   ├── questions.ts       # Question bank & generation
│   │   ├── persistence.ts     # localStorage integration
│   │   ├── progress.ts        # Question tracking
│   │   ├── curated-cache.ts   # Curated questions loader
│   │   ├── game-logic.ts      # Core game actions
│   │   └── init.ts            # App initialization
│   ├── components/            # Preact UI components
│   │   ├── App.tsx            # Main application component
│   │   ├── QuestionCard.tsx   # Question display
│   │   ├── Scoreboard.tsx     # Score and stats
│   │   ├── TopicPicker.tsx    # Topic selection modal
│   │   └── CuratedListDialog.tsx # Curated questions list
│   ├── data/
│   │   └── data.ts            # Data loader, templates (topics/examples in JSON)
│   ├── main.tsx               # App entry point
│   ├── utils.ts               # Utility functions
│   └── types.ts               # TypeScript type definitions
├── public/
│   ├── data/                  # Static data files
│   │   ├── curated/           # Individual topic question files
│   │   │   ├── index.json     # Index of available topics
│   │   │   ├── star-wars.json # Per-topic curated questions (4-12 KB each)
│   │   │   ├── marvel.json
│   │   │   └── ...            # 21 topic files total
│   │   ├── topics.json        # 43 topics (12 KB)
│   │   └── answer-examples.json # Answer examples (16 KB)
│   └── icon-*.svg             # PWA icons
├── dist/                      # Production build output
└── index.html                 # App shell
```

### Code Quality

```bash
# Run linter
yarn lint

# Auto-fix linting issues
yarn lint:fix

# Format code
yarn format

# Type-check (the build does not type-check)
yarn typecheck

# Run unit tests
yarn test
```

### Adding Content

#### New Topics

Edit `public/data/topics.json` and add to the array:

```json
{
  "id": "your-topic-id",
  "name": "Display Name",
  "category": "Category Name",
  "tags": ["tag1", "tag2", "tag3", "tag4"]
}
```

#### Curated Questions

Edit individual topic files in `public/data/curated/[topic-id].json`:

```json
{
  "easy": [
    { "q": "Your question?", "a": "The answer", "angle": "quote" }
  ],
  "medium": [...],
  "hard": [...]
}
```

After adding a new topic file, update the index:

```bash
yarn update-index
```

Users can reload curated questions in the app without redeploying using the "↻ Reload" button.

#### Answer Examples

Add real-world examples to `public/data/answer-examples.json`:

```json
{
  "your-topic-id": {
    "character name": [
      "Luke Skywalker",
      "Princess Leia",
      "Han Solo"
    ]
  }
}
```

These examples are used when generating template-based questions to provide factual content.

## 🏗️ Built With

- **TypeScript 5.9.3** - Type-safe development with strict mode
- **Vite 7.2.4** - Fast build tool and dev server
- **Preact Signals 1.12.1** - Fine-grained reactive state management
- **vite-plugin-pwa 1.2.0** - Progressive Web App with Workbox service worker
- **Biome 2.3.8** - Fast linting and formatting
- **localStorage** - Progress persistence with automatic signal-based updates

## 📝 Architecture Highlights

- **Reactive State Management**: Preact Signals for automatic UI updates and persistence
- **Modular TypeScript**: Organized into state, UI, data, and utility modules with strict types
- **Modular Data Loading**: Individual 4-12 KB topic files loaded in parallel
- **Lazy Loading**: Questions generated only when needed
- **Smart Caching**: Avoids regenerating questions for same topic/difficulty/mode
- **Deterministic Shuffle**: Consistent question order across sessions using LCG algorithm
- **PWA Architecture**: Auto-generated service worker with Workbox for offline support
- **XSS Protection**: Content rendered via Preact JSX (auto-escaped); `escapeHtml()` for the toast `innerHTML` path
- **Error Recovery**: Graceful fallbacks for missing data or localStorage failures
- **Debounced Search**: Topic search filtering is debounced to avoid excessive recalculation

## 🎯 Design Philosophy

1. **Type Safety First**: TypeScript ensures reliability and maintainability
2. **Curated Quality**: Prioritize hand-written factual questions over generated ones
3. **No Backend**: Everything runs client-side for simplicity and privacy
4. **Offline-Ready**: PWA with service worker works in areas with poor/no connectivity
5. **Reactive by Default**: Preact Signals provide automatic UI updates without manual DOM manipulation
6. **Progressive Enhancement**: Generated questions fill gaps in curated content
7. **Real Examples**: Use actual answers (movie scenes, song titles, historical events) instead of placeholders

## 📱 Browser Support

- **Modern Browsers**: Chrome, Safari, Firefox, Edge (ES2020+ support required)
- **PWA Support**: Installable on mobile and desktop devices
- **Offline Capability**: Service workers cache content for use without internet
- **Storage**: Uses localStorage for saving progress

## 🤝 Contributing

Contributions welcome! Focus areas:

- **Curated Questions**: Add factual trivia to `public/data/curated/[topic-id].json`
- **New Topics**: Expand the topic list with interesting categories
- **Answer Examples**: Provide real-world answers for better generated questions
- **Bug Fixes**: Report and fix issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Perfect for**: Long drives, family road trips, learning sessions, or just testing your trivia knowledge! 🎉
