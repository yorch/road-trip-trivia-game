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
    // Recognition-based (10)
    "What's a famous {angle} from {topic}?",
    "Name any {angle} you know from {topic}.",
    "Which {angle} would you recognize from {topic}?",
    "Give an example of a {angle} in {topic}.",
    "What {angle} is {topic} known for?",
    "Recall a popular {angle} from {topic}.",
    "Which {angle} stands out in {topic}?",
    "What {angle} do most people know from {topic}?",
    "Think of one {angle} associated with {topic}.",
    "What's a classic {angle} from {topic}?",
    // Quick-fire style (10)
    "Quick #{n}: Which {angle} is iconic in {topic}?",
    "Starter #{n}: Name a key {angle} for {topic}.",
    "Warm-up #{n}: What common {angle} fits {topic}?",
    "Roadside #{n}: Pick one well-known {angle} in {topic}.",
    "Spotlight #{n}: Call out a famous {angle} of {topic}.",
    "Soundbite #{n}: Give one signature {angle} from {topic}.",
    "Trivia #{n}: What {angle} appears in {topic}?",
    "Fast #{n}: Name a memorable {angle} from {topic}.",
    "Basic #{n}: Which {angle} is essential to {topic}?",
    "Easy #{n}: What {angle} defines {topic}?"
  ],
  medium: [
    // Context-requiring (8)
    "Which {angle} plays a pivotal role in {topic}?",
    "What {angle} is unique to {topic}?",
    "Name the {angle} that changed {topic}.",
    "Which {angle} is debated among {topic} fans?",
    "What {angle} connects different parts of {topic}?",
    "Which {angle} represents the theme of {topic}?",
    "What {angle} evolved throughout {topic}?",
    "Name a {angle} that surprised audiences in {topic}.",
    // Numbered style (7)
    "Round #{n}: Name a pivotal {angle} tied to {topic}.",
    "Challenge #{n}: Which defining {angle} marks {topic}?",
    "Checkpoint #{n}: Identify a memorable {angle} in {topic}.",
    "Explain #{n}: Point to a standout {angle} in {topic}.",
    "Describe #{n}: Choose a notable {angle} from {topic}.",
    "Detail #{n}: What significant {angle} shaped {topic}?",
    "Focus #{n}: Which {angle} received critical acclaim in {topic}?"
  ],
  hard: [
    // Deep knowledge (8)
    "Which lesser-known {angle} influenced {topic}?",
    "What {angle} was modified during production of {topic}?",
    "Name the {angle} that created controversy in {topic}.",
    "Which {angle} was inspired by real events in {topic}?",
    "What {angle} differs between versions of {topic}?",
    "Compare two {angle} interpretations in {topic}.",
    "Which {angle} references another work in {topic}?",
    "What {angle} only appears in extended content of {topic}?",
    // Numbered expert style (7)
    "Deep dive #{n}: Which debated {angle} sits in {topic}?",
    "Expert #{n}: Name a lesser-known {angle} of {topic}.",
    "Toughie #{n}: Cite a contested {angle} within {topic}.",
    "Brain burn #{n}: Call out a tricky {angle} of {topic}.",
    "Stretch #{n}: Identify a rare {angle} linked to {topic}.",
    "Advanced #{n}: Which obscure {angle} exists in {topic}?",
    "Challenge #{n}: What hidden {angle} did creators add to {topic}?"
  ]
};

const answerTemplates = {
  easy: [
    "{angle} (classic pick).",
    "{angle} is a safe bet.",
    "{angle} fits here."
  ],
  medium: [
    "{angle} — core to {topic}.",
    "{angle}, a defining element.",
    "{angle} stands out."
  ],
  hard: [
    "{angle}, often debated.",
    "{angle} — deep cut.",
    "{angle}, niche but valid."
  ]
};

// Curated questions with factual answers for top topics
const curatedQuestions = {
  "star-wars": {
    easy: [
      { q: "What weapon does a Jedi carry?", a: "Lightsaber", angle: "iconic scenes" },
      { q: "Who is Luke Skywalker's father?", a: "Darth Vader (Anakin Skywalker)", angle: "plot twists" },
      { q: "What is Han Solo's ship called?", a: "Millennium Falcon", angle: "sidekicks" },
      { q: "What do Jedi use to control the Force?", a: "Training and meditation", angle: "magic systems" },
      { q: "What is the evil empire called?", a: "The Galactic Empire", angle: "villains" },
      { q: "Who says 'May the Force be with you'?", a: "Multiple characters (especially Obi-Wan)", angle: "quotes" },
      { q: "What color is Luke's first lightsaber?", a: "Blue", angle: "iconic scenes" },
      { q: "Which droid beeps and whistles?", a: "R2-D2", angle: "sidekicks" },
      { q: "What planet has twin suns?", a: "Tatooine", angle: "directors" },
      { q: "Who trained Luke Skywalker?", a: "Obi-Wan Kenobi and Yoda", angle: "characters" }
    ],
    medium: [
      { q: "Which planet does the Death Star destroy?", a: "Alderaan", angle: "plot twists" },
      { q: "What species is Chewbacca?", a: "Wookiee", angle: "sidekicks" },
      { q: "Who is revealed to be Luke's sister?", a: "Princess Leia", angle: "plot twists" },
      { q: "What is a Sith Lord's weapon color?", a: "Red lightsaber", angle: "villains" },
      { q: "Who says 'I have a bad feeling about this'?", a: "Multiple characters throughout the series", angle: "quotes" },
      { q: "What is the name of Boba Fett's ship?", a: "Slave I", angle: "sidekicks" },
      { q: "Who directed the original Star Wars (1977)?", a: "George Lucas", angle: "directors" },
      { q: "What is the Jedi Council's home planet?", a: "Coruscant", angle: "directors" },
      { q: "Which bounty hunter captures Han Solo?", a: "Boba Fett", angle: "villains" },
      { q: "What year was Star Wars: A New Hope released?", a: "1977", angle: "soundtracks" }
    ],
    hard: [
      { q: "Who trained Qui-Gon Jinn?", a: "Count Dooku", angle: "plot twists" },
      { q: "What is the Sith Rule of Two?", a: "Only two Sith exist: a master and apprentice", angle: "villains" },
      { q: "Who composed the Star Wars music?", a: "John Williams", angle: "soundtracks" },
      { q: "What was Anakin's midi-chlorian count?", a: "Over 20,000", angle: "magic systems" },
      { q: "Which movie was originally titled 'Revenge of the Jedi'?", a: "Return of the Jedi", angle: "directors" },
      { q: "Who built C-3PO?", a: "Anakin Skywalker", angle: "sidekicks" },
      { q: "What is Yoda's species called?", a: "Unknown/unnamed", angle: "creatures" },
      { q: "Which actor played Darth Vader (body)?", a: "David Prowse", angle: "directors" },
      { q: "What was the original name of Star Wars?", a: "Adventures of Luke Starkiller", angle: "directors" },
      { q: "Who said 'I am your father' (the actual line)?", a: "Actually: 'No, I am your father'", angle: "quotes" }
    ]
  }
};

// Answer examples with real facts for common angles
const answerExamples = {
  "star-wars": {
    "iconic scenes": [
      "Death Star trench run (A New Hope)",
      "'I am your father' reveal (Empire Strikes Back)",
      "Binary sunset on Tatooine (A New Hope)",
      "Cantina band scene (A New Hope)",
      "Duel of the Fates lightsaber battle (The Phantom Menace)"
    ],
    "quotes": [
      "May the Force be with you",
      "I have a bad feeling about this",
      "Do or do not, there is no try",
      "These aren't the droids you're looking for",
      "Help me, Obi-Wan Kenobi, you're my only hope"
    ],
    "sidekicks": [
      "R2-D2 - astromech droid",
      "C-3PO - protocol droid",
      "Chewbacca - Wookiee co-pilot",
      "BB-8 - spherical droid",
      "Yoda - Jedi Master mentor"
    ],
    "directors": [
      "George Lucas (Original Trilogy creator)",
      "Irvin Kershner (The Empire Strikes Back)",
      "J.J. Abrams (The Force Awakens)",
      "Rian Johnson (The Last Jedi)",
      "Dave Filoni (The Mandalorian)"
    ],
    "plot twists": [
      "Darth Vader is Luke's father",
      "Leia is Luke's twin sister",
      "Palpatine is the Sith Lord",
      "Kylo Ren is Han and Leia's son",
      "Rey is Palpatine's granddaughter"
    ],
    "soundtracks": [
      "Imperial March theme",
      "Main Title theme",
      "Duel of the Fates",
      "Cantina Band song",
      "Force Theme"
    ]
  }
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

  // Get curated questions if available
  const curated = curatedQuestions[topic.id]?.[difficulty] || [];
  const examples = answerExamples[topic.id] || {};

  // Add curated questions first
  curated.forEach((cq) => {
    bank.push({ prompt: cq.q, answer: cq.a, angle: cq.angle });
  });

  // Fill remaining slots with generated questions
  const remaining = 80 - curated.length;
  for (let i = 0; i < remaining; i += 1) {
    const angle = angles[i % angles.length];
    const prompt = fillTemplate(prompts[i % prompts.length], topic.name, angle, i);

    // Use real answer examples if available for this angle
    let answer;
    if (examples[angle] && examples[angle].length > 0) {
      answer = examples[angle][i % examples[angle].length];
    } else {
      answer = fillTemplate(answers[i % answers.length], topic.name, angle, i);
    }

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
  document.getElementById("cardBody").textContent = "Give a short, precise answer, then reveal.";
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
