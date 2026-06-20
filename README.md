# 🚗 Road Trip Trivia

A TypeScript **quizmaster party game** with offline PWA capabilities, designed to keep the whole car entertained. One phone, no backend, no ads — the host reads questions aloud and players (or teams) compete.

## ✨ Features

- **Quizmaster mode**: one host holds the phone, reads each question aloud, and taps who got it — the device is reader + scoreboard
- **Players or teams**: set up any number of entrants (solo works too), as individuals or teams
- **Configurable games**: choose the topic scope, question source, difficulty, and how the game ends
- **End modes**: fixed question count, race to N points, timed, or endless
- **Difficulty-weighted scoring**: Easy 1 · Medium 2 · Hard 3, with a streak bonus for hot runs
- **5000+ Curated Questions**: hand-written factual trivia across all 43 topics (7 categories)
- **Generated prompts**: optional open-ended questions that reveal several example answers
- **Quick Play & Resume**: jump back into an in-progress game or restart with your last setup in one tap
- **Read Aloud**: text-to-speech with voice, speed, and pitch controls
- **Themes**: Warm Americana, Night Drive, and Coastal (defaults to your system preference)
- **PWA Support**: installable, works offline via vite-plugin-pwa
- **Type Safety**: full TypeScript with strict mode; reactive state via Preact Signals

## 🎮 How to Play

1. **Start a game**: tap **Quick Play** for an instant 2-team game, or **New Game** to configure it
2. **Set it up** (New Game): add players or teams, pick topics (or everything), choose difficulty and how the game ends
3. **Host reads**: the host reads each question aloud (tap 🔊 for text-to-speech), players answer out loud
4. **Reveal & award**: tap **Reveal answer**, then tap **who got it** (or **Nobody**) — points are scored automatically
5. **Win**: play to the end mode you chose, then see the **Results** — winner, standings, and best streaks

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
│   ├── css/style.css          # All styling (theme tokens + screens)
│   ├── lib/                   # shuffle, storage, html, toast
│   ├── content/               # catalog, curated loader, pool builder
│   │   ├── catalog.ts         # topics/examples loaders, angles, templates
│   │   ├── curated.ts         # curated index + per-topic loading
│   │   └── provider.ts        # buildPool(config, seed)
│   ├── session/               # game engine
│   │   ├── scoring.ts         # pure scoring (+ scoring.test.ts)
│   │   ├── session.ts         # session state machine + persistence
│   │   └── config.ts          # default config & ids
│   ├── screens/               # Home, Setup, Game, Results
│   ├── components/            # QuestionCard, Scoreboard, EntrantButtons,
│   │                          #   icons, ThemeToggle, SpeechSettings
│   ├── theme.ts               # theme signal + persistence
│   ├── speech.ts              # text-to-speech
│   ├── App.tsx                # hash router (/, /setup, /game, /results)
│   ├── main.tsx               # app entry point
│   └── types.ts               # content + session types
├── public/
│   ├── data/                  # Static content (unchanged across the rewrite)
│   │   ├── curated/           # index.json + one file per topic
│   │   ├── topics.json        # 43 topics
│   │   └── answer-examples.json
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

These examples are shown as the sample answers for open-ended generated prompts.

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
- **Session engine**: a single `GameSession` signal drives the whole game; pure, unit-tested scoring
- **Deterministic pool**: each game's question order derives from a stored seed, so a game resumes identically
- **Lazy content**: curated topic files load on demand and cache; answer examples load only when generated content is enabled
- **PWA Architecture**: Auto-generated service worker with Workbox for offline support
- **XSS Protection**: Content rendered via Preact JSX (auto-escaped); `escapeHtml()` for the toast `innerHTML` path
- **Error Recovery**: Guarded localStorage access; failed initial load surfaces a toast instead of crashing

## 🎯 Design Philosophy

1. **Type Safety First**: TypeScript ensures reliability and maintainability
2. **Curated Quality**: Prioritize hand-written factual questions over generated ones
3. **No Backend**: Everything runs client-side for simplicity and privacy
4. **Offline-Ready**: PWA with service worker works in areas with poor/no connectivity
5. **Reactive by Default**: Preact Signals provide automatic UI updates without manual DOM manipulation
6. **Social by design**: built for a carful of people on one device (quizmaster model), not solo play
7. **Real Examples**: generated prompts reveal actual answers (movie scenes, song titles, historical events), never placeholders

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
