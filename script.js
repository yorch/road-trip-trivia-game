// Road Trip Trivia: lightweight data generator with 50+ topics and 80+ questions per difficulty.

const difficulties = ["easy", "medium", "hard"];

const topicList = [
  { id: "star-wars", name: "Star Wars", category: "Movies & TV", tags: ["Jedi", "Force", "rebellion", "lightsaber"] },
  { id: "harry-potter", name: "Harry Potter", category: "Books & Lore", tags: ["Hogwarts", "spells", "houses", "wands"] },
  { id: "kpop-demon-hunters", name: "K-Pop Demon Hunters", category: "Music & TV", tags: ["stage battles", "idols", "mythic rivals", "dance breaks"] },
  { id: "marvel", name: "Marvel Universe", category: "Movies & TV", tags: ["Avengers", "multiverse", "villains", "origin stories"] },
  { id: "dc-comics", name: "DC Comics", category: "Movies & TV", tags: ["Justice League", "Gotham", "metropolis", "rogues gallery"] },
  { id: "lotr", name: "Lord of the Rings", category: "Books & Lore", tags: ["Middle-earth", "rings", "quests", "fellowship"] },
  { id: "disney-classics", name: "Disney Classics", category: "Movies & TV", tags: ["animation", "songs", "sidekicks", "castles"] },
  { id: "90s-cartoons", name: "90s Cartoons", category: "Movies & TV", tags: ["theme songs", "retro heroes", "morning shows", "toy tie-ins"] },
  { id: "anime-heroes", name: "Anime Heroes", category: "Movies & TV", tags: ["power-ups", "teams", "arcs", "rivals"] },
  { id: "space-sci-fi", name: "Space Sci-Fi", category: "Movies & TV", tags: ["starships", "captains", "alien worlds", "warp drives"] },
  { id: "pirate-adventures", name: "Pirate Adventures", category: "Books & Lore", tags: ["treasure maps", "ships", "captains", "legends"] },
  { id: "detective-mysteries", name: "Detective Mysteries", category: "Books & Lore", tags: ["sleuths", "clues", "cases", "twists"] },
  { id: "time-travel", name: "Time Travel Tales", category: "Books & Lore", tags: ["paradoxes", "timelines", "devices", "future stakes"] },
  { id: "music-legends", name: "Music Legends", category: "Music", tags: ["guitar solos", "iconic tours", "chart toppers", "signature songs"] },
  { id: "pop-hits", name: "Pop Hits", category: "Music", tags: ["choruses", "hooks", "dance tracks", "radio moments"] },
  { id: "rock-history", name: "Rock History", category: "Music", tags: ["anthems", "guitar riffs", "festival lore", "classic albums"] },
  { id: "jazz-blues", name: "Jazz & Blues", category: "Music", tags: ["improv solos", "standards", "blue notes", "club nights"] },
  { id: "country-roads", name: "Country Roads", category: "Music", tags: ["story songs", "fiddles", "line dancing", "highways"] },
  { id: "folk-music", name: "Folk Music", category: "Music", tags: ["ballads", "acoustic tales", "traditions", "campfire songs"] },
  { id: "classical-composers", name: "Classical Composers", category: "Music", tags: ["symphonies", "concertos", "motifs", "orchestras"] },
  { id: "edm", name: "Electronic Dance", category: "Music", tags: ["drops", "synth leads", "club nights", "festivals"] },
  { id: "broadway", name: "Broadway Musicals", category: "Theater", tags: ["show tunes", "ensembles", "opening numbers", "curtain calls"] },
  { id: "movie-soundtracks", name: "Movie Soundtracks", category: "Music", tags: ["themes", "scores", "leitmotifs", "credits songs"] },
  { id: "us-history", name: "US History", category: "History", tags: ["founding", "revolutions", "amendments", "milestones"] },
  { id: "world-history", name: "World History", category: "History", tags: ["ancient empires", "trade routes", "conflicts", "peace accords"] },
  { id: "presidents", name: "American Presidents", category: "History", tags: ["campaigns", "policies", "quotes", "eras"] },
  { id: "ancient-egypt", name: "Ancient Egypt", category: "History", tags: ["pharaohs", "pyramids", "myths", "nile"] },
  { id: "ancient-greece", name: "Ancient Greece", category: "History", tags: ["gods", "city-states", "olympics", "philosophers"] },
  { id: "medieval-europe", name: "Medieval Europe", category: "History", tags: ["castles", "knights", "guilds", "legends"] },
  { id: "renaissance", name: "Renaissance Art", category: "History", tags: ["masters", "patrons", "workshops", "perspective"] },
  { id: "ww2", name: "World War II", category: "History", tags: ["allies", "axis", "home front", "turning points"] },
  { id: "civil-rights", name: "Civil Rights Movement", category: "History", tags: ["marches", "leaders", "landmark cases", "protests"] },
  { id: "space-race", name: "Space Race", category: "History", tags: ["rockets", "moonshots", "astronauts", "rivalry"] },
  { id: "inventors", name: "Inventions & Inventors", category: "History", tags: ["breakthroughs", "patents", "prototypes", "eureka moments"] },
  { id: "women-history", name: "Women in History", category: "History", tags: ["trailblazers", "movements", "discoveries", "firsts"] },
  { id: "space-exploration", name: "Space Exploration", category: "Science & Nature", tags: ["missions", "rovers", "telescopes", "planets"] },
  { id: "solar-system", name: "Solar System", category: "Science & Nature", tags: ["planets", "moons", "orbits", "asteroids"] },
  { id: "human-body", name: "Human Body", category: "Science & Nature", tags: ["organs", "systems", "health", "senses"] },
  { id: "weather", name: "Weather & Climate", category: "Science & Nature", tags: ["storms", "seasons", "patterns", "forecasts"] },
  { id: "earth-science", name: "Earth Science", category: "Science & Nature", tags: ["rocks", "tectonics", "oceans", "atmosphere"] },
  { id: "dinosaurs", name: "Dinosaurs", category: "Science & Nature", tags: ["fossils", "eras", "predators", "herbivores"] },
  { id: "ocean-life", name: "Ocean Life", category: "Science & Nature", tags: ["coral reefs", "currents", "creatures", "deep sea"] },
  { id: "rainforest", name: "Rainforest", category: "Science & Nature", tags: ["canopy", "biodiversity", "rivers", "wildlife"] },
  { id: "animals", name: "Animals of the World", category: "Science & Nature", tags: ["habitats", "tracks", "adaptations", "sounds"] },
  { id: "tech-innovations", name: "Tech Innovations", category: "Science & Nature", tags: ["gadgets", "startups", "breakthroughs", "future bets"] },
  { id: "robotics", name: "Robotics & AI", category: "Science & Nature", tags: ["automation", "sensors", "ethics", "design"] },
  { id: "soccer", name: "Soccer", category: "Sports & Games", tags: ["world cups", "clubs", "legends", "positions"] },
  { id: "basketball", name: "Basketball", category: "Sports & Games", tags: ["playoffs", "dunks", "point guards", "dynasties"] },
  { id: "baseball", name: "Baseball", category: "Sports & Games", tags: ["ballparks", "pitching", "stats", "legends"] },
  { id: "olympics", name: "Olympics", category: "Sports & Games", tags: ["host cities", "opening ceremonies", "records", "events"] },
  { id: "racing", name: "Cars & Racing", category: "Sports & Games", tags: ["grand prix", "pit stops", "circuits", "drivers"] },
  { id: "board-games", name: "Board Games", category: "Sports & Games", tags: ["strategy", "dice", "co-op", "family night"] },
  { id: "retro-games", name: "Video Games Retro", category: "Sports & Games", tags: ["arcades", "8-bit", "platformers", "cheat codes"] },
  { id: "modern-games", name: "Video Games Modern", category: "Sports & Games", tags: ["open worlds", "crafting", "online squads", "boss fights"] },
  { id: "esports", name: "Esports", category: "Sports & Games", tags: ["tournaments", "metas", "casters", "big plays"] },
  { id: "martial-arts", name: "Martial Arts", category: "Sports & Games", tags: ["forms", "sparring", "belts", "philosophy"] },
  { id: "world-capitals", name: "World Capitals", category: "Travel & Places", tags: ["rivers", "city squares", "monuments", "embassies"] },
  { id: "landmarks", name: "World Landmarks", category: "Travel & Places", tags: ["towers", "bridges", "temples", "statues"] },
  { id: "national-parks", name: "US National Parks", category: "Travel & Places", tags: ["trails", "wildlife", "rangers", "vistas"] },
  { id: "world-cultures", name: "World Cultures", category: "Travel & Places", tags: ["festivals", "languages", "traditions", "recipes"] },
  { id: "food-world", name: "Food Around the World", category: "Travel & Places", tags: ["street food", "spices", "comfort dishes", "desserts"] },
  { id: "deserts-mountains", name: "Deserts & Mountains", category: "Travel & Places", tags: ["summits", "dunes", "base camps", "routes"] },
  { id: "islands-oceans", name: "Islands & Oceans", category: "Travel & Places", tags: ["archipelagos", "reefs", "ferries", "lagoon"] },
  { id: "trains-travel", name: "Trains & Travel", category: "Travel & Places", tags: ["stations", "rail lore", "night routes", "scenic rides"] },
  { id: "aviation", name: "Aviation & Flight", category: "Travel & Places", tags: ["cockpits", "pilots", "airshows", "routes"] },
  { id: "sailing", name: "Sailing & Sea", category: "Travel & Places", tags: ["harbors", "regattas", "navigation", "knots"] },
  { id: "camping", name: "Camping & Hiking", category: "Lifestyle & Fun", tags: ["trail snacks", "tents", "maps", "campfire stories"] },
  { id: "survival", name: "Survival Skills", category: "Lifestyle & Fun", tags: ["signals", "first aid", "shelter", "fire craft"] },
  { id: "cooking", name: "Cooking Basics", category: "Lifestyle & Fun", tags: ["knife skills", "spices", "sauces", "kitchen tools"] },
  { id: "desserts", name: "Desserts", category: "Lifestyle & Fun", tags: ["cakes", "cookies", "frosting", "fruit treats"] },
  { id: "coffee-tea", name: "Coffee & Tea", category: "Lifestyle & Fun", tags: ["brews", "roasts", "ceremony", "pairings"] },
  { id: "fashion", name: "Fashion History", category: "Lifestyle & Fun", tags: ["runways", "decades", "designers", "silhouettes"] },
  { id: "architecture", name: "Architecture", category: "Lifestyle & Fun", tags: ["styles", "materials", "cityscapes", "skylines"] },
  { id: "photography", name: "Photography", category: "Lifestyle & Fun", tags: ["lenses", "light", "subjects", "angles"] },
  { id: "gardening", name: "Gardening", category: "Lifestyle & Fun", tags: ["soil", "seasons", "pollinators", "harvest"] },
  { id: "eco-living", name: "Eco Living", category: "Lifestyle & Fun", tags: ["recycling", "energy", "habits", "green swaps"] }
];

const categoryAngles = {
  "Movies & TV": ["iconic scenes", "quotes", "directors", "soundtracks", "plot twists", "sidekicks"],
  "Books & Lore": ["authors", "chapters", "magic systems", "creatures", "libraries", "prophecies"],
  Music: ["choruses", "hooks", "eras", "genres", "albums", "tour moments"],
  Theater: ["characters", "stagecraft", "ensembles", "overtures", "spotlights", "intermissions"],
  History: ["dates", "turning points", "leaders", "movements", "documents", "milestones"],
  "Science & Nature": ["experiments", "habitats", "cycles", "discoveries", "phenomena", "patterns"],
  "Sports & Games": ["rules", "positions", "championships", "records", "legends", "rivals"],
  "Travel & Places": ["landmarks", "traditions", "foods", "routes", "landscapes", "customs"],
  "Lifestyle & Fun": ["gear", "rituals", "hacks", "daily moves", "myths", "tiny wins"]
};

const promptTemplates = {
  easy: [
    "Quick fire #{n}: Name a {angle} everyone links to {topic}.",
    "Starter #{n}: What {angle} would you share to introduce {topic}?",
    "Warm-up #{n}: Mention a fun {angle} from {topic}.",
    "Roadside #{n}: Tell the crew one {angle} from {topic}.",
    "Spotlight #{n}: Which {angle} pops to mind for {topic}?",
    "Soundbite #{n}: Give a short {angle} about {topic}."
  ],
  medium: [
    "Round #{n}: Explain how a {angle} shapes {topic}.",
    "Challenge #{n}: Connect a {angle} to why {topic} is memorable.",
    "Checkpoint #{n}: Share a story that highlights a {angle} in {topic}.",
    "Explain #{n}: What makes this {angle} iconic for {topic}?",
    "Describe #{n}: Use a {angle} to convince a friend to try {topic}."
  ],
  hard: [
    "Deep dive #{n}: Compare two {angle} ideas within {topic}.",
    "Expert #{n}: Link a lesser-known {angle} to the big picture of {topic}.",
    "Toughie #{n}: What debated {angle} keeps fans of {topic} talking?",
    "Brain burn #{n}: Create a tricky clue about a {angle} in {topic}.",
    "Stretch #{n}: Tie a {angle} from {topic} to another category you love."
  ]
};

const answerTemplates = {
  easy: [
    "Example: {topic} fans instantly mention {angle}.",
    "Easy answer: think of {topic} and its {angle}.",
    "Go-to idea: the famous {angle} in {topic} works here."
  ],
  medium: [
    "Solid answer: describe how {angle} pushes the story of {topic}.",
    "You could mention a {angle} moment that changed {topic}.",
    "Try linking the {angle} in {topic} to a mood or theme."
  ],
  hard: [
    "Answer angle: compare how one {angle} differs from another in {topic}.",
    "Smart take: connect a hidden {angle} in {topic} to history or science.",
    "Advanced note: debate the {angle} within {topic} and why it matters."
  ]
};

function buildAngles(topic) {
  const base = categoryAngles[topic.category] || [];
  const general = ["origins", "favorites", "legends", "rivals", "surprises", "underdogs"];
  return [...new Set([...topic.tags, ...base, ...general])];
}

function fillTemplate(template, topicName, angle, index) {
  return template.replace("{topic}", topicName).replace("{angle}", angle).replace("{n}", index + 1);
}

function createQuestions(topic, difficulty) {
  const prompts = promptTemplates[difficulty];
  const answers = answerTemplates[difficulty];
  const angles = buildAngles(topic);
  const bank = [];

  for (let i = 0; i < 80; i += 1) {
    const angle = angles[i % angles.length];
    const prompt = fillTemplate(prompts[i % prompts.length], topic.name, angle, i);
    const answer = fillTemplate(answers[i % answers.length], topic.name, angle, i);
    bank.push({ prompt, answer, angle });
  }
  return bank;
}

const questionBank = {};
topicList.forEach((topic) => {
  questionBank[topic.id] = {};
  difficulties.forEach((diff) => {
    questionBank[topic.id][diff] = createQuestions(topic, diff);
  });
});

const progress = {};
const state = {
  topicId: topicList[0].id,
  difficulty: "easy",
  score: 0,
  streak: 0,
  asked: 0,
  revealed: false
};

function shuffleIndices(length, seedBase = 1) {
  const arr = Array.from({ length }, (_, i) => i);
  let seed = seedBase;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    seed = (seed * 16807) % 2147483647;
    const rand = seed / 2147483647;
    const j = Math.floor(rand * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getProgress(topicId, difficulty) {
  if (!progress[topicId]) progress[topicId] = {};
  if (!progress[topicId][difficulty]) {
    const seed = topicId.length + difficulty.length;
    progress[topicId][difficulty] = { order: shuffleIndices(80, seed), cursor: 0 };
  }
  return progress[topicId][difficulty];
}

function setCategoryOptions() {
  const select = document.getElementById("categorySelect");
  const categories = [...new Set(topicList.map((t) => t.category))].sort();
  select.innerHTML = `<option value="all">All categories</option>` + categories.map((c) => `<option value="${c}">${c}</option>`).join("");
}

function setTopicOptions(filter = "all") {
  const select = document.getElementById("topicSelect");
  const topics = filter === "all" ? topicList : topicList.filter((t) => t.category === filter);
  select.innerHTML = topics.map((t) => `<option value="${t.id}">${t.name} — ${t.category}</option>`).join("");
  if (!topics.find((t) => t.id === state.topicId)) {
    state.topicId = topics[0]?.id || topicList[0].id;
  }
  select.value = state.topicId;
}

function updateDifficultyButtons() {
  document.querySelectorAll(".difficulty").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.difficulty === state.difficulty);
  });
}

function updateScoreboard() {
  document.getElementById("scoreValue").textContent = state.score;
  document.getElementById("streakValue").textContent = state.streak;
  document.getElementById("askedValue").textContent = state.asked;
}

function renderCard(question) {
  const topic = topicList.find((t) => t.id === state.topicId);
  document.getElementById("cardTopic").textContent = `${topic.name} • ${topic.category}`;
  document.getElementById("cardDifficulty").textContent = state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);
  document.getElementById("cardTitle").textContent = question.prompt;
  document.getElementById("cardMeta").textContent = `Angle: ${question.angle}`;
  document.getElementById("cardBody").textContent = "Think it through, then reveal the suggested answer.";
  document.getElementById("answerText").textContent = question.answer;
  toggleAnswer(false);
}

function nextQuestion() {
  const prog = getProgress(state.topicId, state.difficulty);
  const bank = questionBank[state.topicId][state.difficulty];

  if (prog.cursor >= bank.length) {
    document.getElementById("cardTitle").textContent = "All questions used up!";
    document.getElementById("cardBody").textContent = "Reset progress or switch difficulty to keep rolling.";
    document.getElementById("answerText").textContent = "Every question in this lane has been used.";
    toggleAnswer(true);
    return;
  }

  const idx = prog.order[prog.cursor];
  prog.cursor += 1;
  state.asked += 1;
  state.revealed = false;
  updateScoreboard();
  renderCard(bank[idx]);
}

function toggleAnswer(forceVisible) {
  const answerEl = document.getElementById("cardAnswer");
  const show = typeof forceVisible === "boolean" ? forceVisible : !state.revealed;
  state.revealed = show;
  answerEl.classList.toggle("visible", show);
  document.getElementById("toggleAnswer").textContent = show ? "Hide answer" : "Show answer";
}

function markCorrect() {
  state.score += 1;
  state.streak += 1;
  updateScoreboard();
  nextQuestion();
}

function skipQuestion() {
  state.streak = 0;
  updateScoreboard();
  nextQuestion();
}

function resetProgress() {
  Object.keys(progress).forEach((topicId) => {
    difficulties.forEach((diff) => {
      progress[topicId][diff] = { order: shuffleIndices(80, topicId.length + diff.length + 1), cursor: 0 };
    });
  });
  state.score = 0;
  state.streak = 0;
  state.asked = 0;
  updateScoreboard();
  nextQuestion();
}

function bindEvents() {
  document.getElementById("categorySelect").addEventListener("change", (e) => {
    setTopicOptions(e.target.value);
    nextQuestion();
  });

  document.getElementById("topicSelect").addEventListener("change", (e) => {
    state.topicId = e.target.value;
    state.streak = 0;
    updateScoreboard();
    nextQuestion();
  });

  document.querySelectorAll(".difficulty").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.difficulty = btn.dataset.difficulty;
      state.streak = 0;
      updateDifficultyButtons();
      updateScoreboard();
      nextQuestion();
    });
  });

  document.getElementById("nextQuestion").addEventListener("click", nextQuestion);
  document.getElementById("toggleAnswer").addEventListener("click", () => toggleAnswer());
  document.getElementById("markCorrect").addEventListener("click", markCorrect);
  document.getElementById("skipQuestion").addEventListener("click", skipQuestion);
  document.getElementById("randomTopic").addEventListener("click", () => {
    const random = topicList[Math.floor(Math.random() * topicList.length)];
    state.topicId = random.id;
    document.getElementById("topicSelect").value = random.id;
    state.streak = 0;
    updateScoreboard();
    nextQuestion();
  });
  document.getElementById("resetProgress").addEventListener("click", resetProgress);
}

function init() {
  setCategoryOptions();
  setTopicOptions();
  updateDifficultyButtons();
  updateScoreboard();
  bindEvents();
  nextQuestion();
}

document.addEventListener("DOMContentLoaded", init);
