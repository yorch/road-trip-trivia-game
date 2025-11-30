# 🚗 Road Trip Trivia

A lightweight, offline-capable trivia game designed to keep your road trips entertaining. No backend required, no ads, just pure trivia fun for the whole car.

## ✨ Features

- **81 Topics** across 9 categories: Movies & TV, Books & Lore, Music, Theater, History, Science & Nature, Sports & Games, Travel & Places, and Lifestyle & Fun
- **Three Difficulty Levels**: Easy, Medium, and Hard questions to challenge everyone
- **240+ Curated Questions**: Hand-written factual trivia with verifiable answers
- **Generated Questions**: Template-based questions with real-world answer examples
- **Two Question Modes**:
  - **All Questions**: Mix of curated and generated content (80 questions per topic/difficulty)
  - **Curated Only**: Play exclusively hand-written trivia questions
- **Progress Tracking**: Scores, streaks, and question history saved locally
- **Offline Support**: Works without internet connection via service worker
- **Live Reload**: Update curated questions without redeploying the app
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
git clone <repository-url>
cd road-trip-trivia

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
```

The app will open automatically at `http://localhost:3000`

## 🛠️ Development

### Project Structure

```
road-trip-trivia/
├── src/
│   ├── css/
│   │   └── style.css          # All styling
│   ├── js/
│   │   ├── main.js            # App initialization
│   │   ├── state.js           # State management & localStorage
│   │   ├── ui.js              # DOM manipulation & rendering
│   │   └── utils.js           # Utility functions
│   └── data/
│       └── data.js            # Topics, templates, answer examples
├── public/
│   ├── curated-questions.json # Hand-written trivia (reloadable)
│   └── service-worker.js      # Offline support
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
```

### Adding Content

#### New Topics

Edit `src/data/data.js` and add to `topicList`:

```javascript
{
  id: "your-topic-id",
  name: "Display Name",
  category: "Category Name",
  tags: ["tag1", "tag2", "tag3", "tag4"]
}
```

#### Curated Questions

Edit `public/curated-questions.json`:

```json
{
  "your-topic-id": {
    "easy": [
      { "q": "Your question?", "a": "The answer", "angle": "quote" }
    ],
    "medium": [...],
    "hard": [...]
  }
}
```

Users can reload curated questions in the app without redeploying using the "↻ Reload" button.

#### Answer Examples

Add real-world examples to `answerExamples` in `src/data/data.js`:

```javascript
"your-topic-id": {
  "character name": [
    "Luke Skywalker",
    "Princess Leia",
    "Han Solo"
  ]
}
```

These examples are used when generating template-based questions to provide factual content.

## 🏗️ Built With

- **Vite** - Build tool and dev server
- **Vanilla JavaScript** - ES6+ modules, no frameworks
- **Service Workers** - Offline functionality
- **localStorage** - Progress persistence
- **Biome** - Linting and formatting

## 📝 Architecture Highlights

- **Lazy Loading**: Questions generated only when needed
- **Smart Caching**: Avoids regenerating questions for same topic/difficulty/mode
- **Deterministic Shuffle**: Consistent question order across sessions
- **XSS Protection**: All user-facing content HTML-escaped
- **Error Recovery**: Graceful fallbacks for missing data or localStorage failures
- **Debounced Operations**: Search and mode changes optimized to prevent excessive calculations

## 🎯 Design Philosophy

1. **Curated First**: Prioritize hand-written factual questions over generated ones
2. **No Backend**: Everything runs client-side for simplicity and privacy
3. **Offline-Ready**: Works in areas with poor/no connectivity (perfect for road trips)
4. **Progressive Enhancement**: Generated questions fill gaps in curated content
5. **Real Examples**: Use actual answers (movie scenes, song titles, historical events) instead of placeholders

## 📱 Browser Support

- Modern browsers with ES6+ module support
- Service workers for offline functionality (optional enhancement)
- localStorage for progress tracking (gracefully degrades if unavailable)

## 🤝 Contributing

Contributions welcome! Focus areas:

- **Curated Questions**: Add factual trivia to `public/curated-questions.json`
- **New Topics**: Expand the topic list with interesting categories
- **Answer Examples**: Provide real-world answers for better generated questions
- **Bug Fixes**: Report and fix issues

## 📄 License

This project is available for personal and educational use.

---

**Perfect for**: Long drives, family road trips, learning sessions, or just testing your trivia knowledge! 🎉
