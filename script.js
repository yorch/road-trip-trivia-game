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
  "Movies & TV": ["iconic scene", "quote", "director", "soundtrack", "plot twist", "sidekick"],
  "Books & Lore": ["author", "chapter", "magic system", "creature", "library", "prophecy"],
  Music: ["chorus", "hook", "era", "genre", "album", "tour moment"],
  Theater: ["character", "stagecraft", "ensemble", "overture", "spotlight", "intermission"],
  History: ["date", "turning point", "leader", "movement", "document", "milestone"],
  "Science & Nature": ["experiment", "habitat", "cycle", "discovery", "phenomenon", "pattern"],
  "Sports & Games": ["rule", "position", "championship", "record", "legend", "rival"],
  "Travel & Places": ["landmark", "tradition", "food", "route", "landscape", "custom"],
  "Lifestyle & Fun": ["gear", "ritual", "hack", "daily move", "myth", "tiny win"]
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
      { q: "What weapon does a Jedi carry?", a: "Lightsaber", angle: "iconic scene" },
      { q: "Who is Luke Skywalker's father?", a: "Darth Vader (Anakin Skywalker)", angle: "plot twist" },
      { q: "What is Han Solo's ship called?", a: "Millennium Falcon", angle: "sidekick" },
      { q: "What do Jedi use to control the Force?", a: "Training and meditation", angle: "magic system" },
      { q: "What is the evil empire called?", a: "The Galactic Empire", angle: "villain" },
      { q: "Who says 'May the Force be with you'?", a: "Multiple characters (especially Obi-Wan)", angle: "quote" },
      { q: "What color is Luke's first lightsaber?", a: "Blue", angle: "iconic scene" },
      { q: "Which droid beeps and whistles?", a: "R2-D2", angle: "sidekick" },
      { q: "What planet has twin suns?", a: "Tatooine", angle: "director" },
      { q: "Who trained Luke Skywalker?", a: "Obi-Wan Kenobi and Yoda", angle: "character" },
      { q: "What is Baby Yoda's real name?", a: "Grogu", angle: "sidekick" },
      { q: "Who is Han Solo's co-pilot?", a: "Chewbacca", angle: "sidekick" },
      { q: "What color is Darth Vader's lightsaber?", a: "Red", angle: "villain" },
      { q: "What do Stormtroopers wear?", a: "White armor", angle: "villain" },
      { q: "Who is Princess Leia's brother?", a: "Luke Skywalker", angle: "plot twist" },
      { q: "What small green Jedi Master trained Luke?", a: "Yoda", angle: "character" },
      { q: "What planet is covered in ice?", a: "Hoth", angle: "iconic scene" },
      { q: "What does Han Solo get frozen in?", a: "Carbonite", angle: "plot twist" },
      { q: "Who is the protocol droid?", a: "C-3PO", angle: "sidekick" },
      { q: "What is the dark side of the Force associated with?", a: "Evil and anger", angle: "villain" }
    ],
    medium: [
      { q: "Which planet does the Death Star destroy?", a: "Alderaan", angle: "plot twist" },
      { q: "What species is Chewbacca?", a: "Wookiee", angle: "sidekick" },
      { q: "Who is revealed to be Luke's sister?", a: "Princess Leia", angle: "plot twist" },
      { q: "What is a Sith Lord's weapon color?", a: "Red lightsaber", angle: "villain" },
      { q: "Who says 'I have a bad feeling about this'?", a: "Multiple characters throughout the series", angle: "quote" },
      { q: "What is the name of Boba Fett's ship?", a: "Slave I", angle: "sidekick" },
      { q: "Who directed the original Star Wars (1977)?", a: "George Lucas", angle: "director" },
      { q: "What is the Jedi Council's home planet?", a: "Coruscant", angle: "director" },
      { q: "Which bounty hunter captures Han Solo?", a: "Boba Fett", angle: "villain" },
      { q: "What year was Star Wars: A New Hope released?", a: "1977", angle: "soundtrack" },
      { q: "What is the name of Han Solo's friend who owns Cloud City?", a: "Lando Calrissian", angle: "character" },
      { q: "Who is Anakin Skywalker's wife?", a: "Padmé Amidala", angle: "plot twist" },
      { q: "What is the Emperor's Sith name?", a: "Darth Sidious", angle: "villain" },
      { q: "What planet do Rey and Finn first meet on?", a: "Jakku", angle: "director" },
      { q: "Who is Kylo Ren's father?", a: "Han Solo", angle: "plot twist" },
      { q: "What species is Ahsoka Tano?", a: "Togruta", angle: "character" },
      { q: "What is the Mandalorian's real name?", a: "Din Djarin", angle: "character" },
      { q: "Who cut off Anakin's arm in Attack of the Clones?", a: "Count Dooku", angle: "plot twist" },
      { q: "What is Finn's Stormtrooper designation?", a: "FN-2187", angle: "character" },
      { q: "What forest moon was the second Death Star near?", a: "Endor", angle: "iconic scene" }
    ],
    hard: [
      { q: "Who trained Qui-Gon Jinn?", a: "Count Dooku", angle: "plot twist" },
      { q: "What is the Sith Rule of Two?", a: "Only two Sith exist: a master and apprentice", angle: "villain" },
      { q: "Who composed the Star Wars music?", a: "John Williams", angle: "soundtrack" },
      { q: "What was Anakin's midi-chlorian count?", a: "Over 20,000", angle: "magic system" },
      { q: "Which movie was originally titled 'Revenge of the Jedi'?", a: "Return of the Jedi", angle: "director" },
      { q: "Who built C-3PO?", a: "Anakin Skywalker", angle: "sidekick" },
      { q: "What is Yoda's species called?", a: "Unknown/unnamed", angle: "creature" },
      { q: "Which actor played Darth Vader (body)?", a: "David Prowse", angle: "director" },
      { q: "What was the original name of Star Wars?", a: "Adventures of Luke Starkiller", angle: "director" },
      { q: "Who said 'I am your father' (the actual line)?", a: "Actually: 'No, I am your father'", angle: "quote" },
      { q: "What is Count Dooku's Sith name?", a: "Darth Tyranus", angle: "villain" },
      { q: "Who was the first to use Force lightning in the films?", a: "Emperor Palpatine", angle: "villain" },
      { q: "What is the name of the Clone Trooper who betrayed Order 66?", a: "Captain Rex (in Clone Wars)", angle: "plot twist" },
      { q: "Who voices Darth Vader?", a: "James Earl Jones", angle: "director" },
      { q: "What is the home planet of the Wookiees?", a: "Kashyyyk", angle: "sidekick" },
      { q: "Who is Anakin's mother?", a: "Shmi Skywalker", angle: "character" },
      { q: "What is the Darksaber?", a: "Ancient black-bladed lightsaber of Mandalore", angle: "magic system" },
      { q: "Who killed Qui-Gon Jinn?", a: "Darth Maul", angle: "plot twist" },
      { q: "What is the planet where Obi-Wan hides Luke?", a: "Tatooine (with Owen and Beru Lars)", angle: "character" },
      { q: "What year did The Phantom Menace release?", a: "1999", angle: "director" }
    ]
  },
  "marvel": {
    easy: [
      { q: "What is Iron Man's real name?", a: "Tony Stark", angle: "origin story" },
      { q: "What is Captain America's shield made of?", a: "Vibranium", angle: "Avengers" },
      { q: "Who is the God of Thunder?", a: "Thor", angle: "Avengers" },
      { q: "What color is the Hulk?", a: "Green", angle: "Avengers" },
      { q: "What is Spider-Man's real name?", a: "Peter Parker", angle: "origin story" },
      { q: "Who snaps the Infinity Gauntlet in Endgame?", a: "Tony Stark / Iron Man", angle: "Avengers" },
      { q: "What is Black Widow's real name?", a: "Natasha Romanoff", angle: "Avengers" },
      { q: "Which Avenger uses a bow and arrow?", a: "Hawkeye / Clint Barton", angle: "Avengers" },
      { q: "What planet is Thor from?", a: "Asgard", angle: "multiverse" },
      { q: "Who is Tony Stark's AI assistant?", a: "JARVIS (later Vision)", angle: "origin story" },
      { q: "What does Hulk smash?", a: "Everything when angry", angle: "Avengers" },
      { q: "Who wears the suit of armor?", a: "Iron Man / Tony Stark", angle: "origin story" },
      { q: "What is Thor's weapon called?", a: "Hammer (Mjolnir)", angle: "Avengers" },
      { q: "Who can climb walls?", a: "Spider-Man", angle: "origin story" },
      { q: "What team do the heroes join?", a: "The Avengers", angle: "Avengers" },
      { q: "Who is the big purple villain?", a: "Thanos", angle: "villain" },
      { q: "What does Captain America throw?", a: "His shield", angle: "Avengers" },
      { q: "Who says 'I am Iron Man'?", a: "Tony Stark", angle: "origin story" },
      { q: "What insect-sized hero can grow big?", a: "Ant-Man", angle: "origin story" },
      { q: "Who is the king of Wakanda?", a: "Black Panther / T'Challa", angle: "origin story" }
    ],
    medium: [
      { q: "What is the name of Thor's hammer?", a: "Mjolnir", angle: "Avengers" },
      { q: "Who is the villain in the first Avengers movie?", a: "Loki", angle: "villain" },
      { q: "What is the name of Black Panther's home country?", a: "Wakanda", angle: "origin story" },
      { q: "Who plays Tony Stark in the MCU?", a: "Robert Downey Jr.", angle: "origin story" },
      { q: "What are the six Infinity Stones?", a: "Space, Mind, Reality, Power, Time, Soul", angle: "multiverse" },
      { q: "Who is Peter Quill's father?", a: "Ego the Living Planet", angle: "origin story" },
      { q: "What is Doctor Strange's first name?", a: "Stephen", angle: "multiverse" },
      { q: "Which Avenger is a master spy and assassin?", a: "Black Widow / Natasha Romanoff", angle: "Avengers" },
      { q: "What year was the first Iron Man movie released?", a: "2008", angle: "origin story" },
      { q: "Who is the leader of S.H.I.E.L.D.?", a: "Nick Fury", angle: "Avengers" },
      { q: "What is Captain America's real name?", a: "Steve Rogers", angle: "origin story" },
      { q: "Who is Thor's brother?", a: "Loki", angle: "villain" },
      { q: "What does Peter Parker do for a living?", a: "Photographer / High school student", angle: "origin story" },
      { q: "Who is the purple stone in Vision's forehead?", a: "Mind Stone", angle: "multiverse" },
      { q: "What is Hawkeye's special skill?", a: "Archery / Never misses", angle: "Avengers" },
      { q: "Who plays Spider-Man in the MCU?", a: "Tom Holland", angle: "origin story" },
      { q: "What is Hulk's alter ego's profession?", a: "Scientist (Bruce Banner)", angle: "origin story" },
      { q: "Who is the talking raccoon?", a: "Rocket", angle: "Avengers" },
      { q: "What planet are the Guardians from originally?", a: "Various (Peter Quill from Earth)", angle: "multiverse" },
      { q: "Who can shrink and talk to ants?", a: "Ant-Man / Scott Lang", angle: "origin story" }
    ],
    hard: [
      { q: "What is the name of Tony Stark's father?", a: "Howard Stark", angle: "origin story" },
      { q: "Who created the Infinity Stones in the comics?", a: "The Cosmic Entities", angle: "multiverse" },
      { q: "What is Thanos's home planet?", a: "Titan", angle: "villain" },
      { q: "Who is the Winter Soldier?", a: "Bucky Barnes", angle: "villain" },
      { q: "What is the name of Thor's axe in Infinity War?", a: "Stormbreaker", angle: "Avengers" },
      { q: "Who directed the first two Avengers movies?", a: "Joss Whedon", angle: "origin story" },
      { q: "What is the real name of Scarlet Witch?", a: "Wanda Maximoff", angle: "Avengers" },
      { q: "Which infinity stone is inside Vision's head?", a: "Mind Stone", angle: "multiverse" },
      { q: "What is Ant-Man's real name?", a: "Scott Lang (or Hank Pym in comics)", angle: "origin story" },
      { q: "Who is the voice of Groot?", a: "Vin Diesel", angle: "Avengers" },
      { q: "What is the name of Peter Parker's aunt?", a: "May Parker (Aunt May)", angle: "origin story" },
      { q: "Who created the Ultron program?", a: "Tony Stark and Bruce Banner", angle: "villain" },
      { q: "What is the Hulk's maximum lifting capacity?", a: "Unlimited when angry enough", angle: "Avengers" },
      { q: "Who directed Avengers: Endgame?", a: "Russo Brothers (Anthony and Joe)", angle: "multiverse" },
      { q: "What is Captain Marvel's real name?", a: "Carol Danvers", angle: "origin story" },
      { q: "Who is T'Challa's sister in Black Panther?", a: "Shuri", angle: "origin story" },
      { q: "What organization does Hydra infiltrate?", a: "S.H.I.E.L.D.", angle: "villain" },
      { q: "What is the name of Pepper Potts's superhero identity?", a: "Rescue", angle: "origin story" },
      { q: "Who wields the Reality Stone as the Aether?", a: "Malekith (originally)", angle: "villain" },
      { q: "What planet does the Soul Stone reside on?", a: "Vormir", angle: "multiverse" }
    ]
  },
  "harry-potter": {
    easy: [
      { q: "What school does Harry Potter attend?", a: "Hogwarts School of Witchcraft and Wizardry", angle: "Hogwarts" },
      { q: "What position does Harry play in Quidditch?", a: "Seeker", angle: "spell" },
      { q: "What is Harry's pet owl's name?", a: "Hedwig", angle: "creature" },
      { q: "What are the four Hogwarts houses?", a: "Gryffindor, Slytherin, Ravenclaw, Hufflepuff", angle: "house" },
      { q: "Who is Harry Potter's best friend (boy)?", a: "Ron Weasley", angle: "Hogwarts" },
      { q: "Who is Harry Potter's best friend (girl)?", a: "Hermione Granger", angle: "Hogwarts" },
      { q: "What is Voldemort's real name?", a: "Tom Marvolo Riddle", angle: "magic system" },
      { q: "What type of creature is Dobby?", a: "House-elf", angle: "creature" },
      { q: "What platform does the Hogwarts Express leave from?", a: "Platform 9¾", angle: "Hogwarts" },
      { q: "Who is the headmaster of Hogwarts (most of the series)?", a: "Albus Dumbledore", angle: "Hogwarts" },
      { q: "What house is Harry in?", a: "Gryffindor", angle: "house" },
      { q: "What scar does Harry have?", a: "Lightning bolt on forehead", angle: "magic system" },
      { q: "Who is Harry's godfather?", a: "Sirius Black", angle: "Hogwarts" },
      { q: "What sport do wizards play on broomsticks?", a: "Quidditch", angle: "spell" },
      { q: "Who is the giant half-human keeper of keys?", a: "Hagrid", angle: "creature" },
      { q: "What color is Gryffindor?", a: "Red and gold", angle: "house" },
      { q: "What do wizards use to cast spells?", a: "Wands", angle: "wand" },
      { q: "Who killed Harry's parents?", a: "Voldemort", angle: "prophecy" },
      { q: "What creature guards the wizard bank?", a: "Goblins (at Gringotts)", angle: "creature" },
      { q: "What do Muggles mean?", a: "Non-magical people", angle: "Hogwarts" }
    ],
    medium: [
      { q: "What spell is used to disarm an opponent?", a: "Expelliarmus", angle: "spell" },
      { q: "What are the three Deathly Hallows?", a: "Elder Wand, Resurrection Stone, Invisibility Cloak", angle: "magic system" },
      { q: "Who killed Dumbledore?", a: "Severus Snape", angle: "prophecy" },
      { q: "What is the name of Hagrid's three-headed dog?", a: "Fluffy", angle: "creature" },
      { q: "What house is Draco Malfoy in?", a: "Slytherin", angle: "house" },
      { q: "What is a Horcrux?", a: "An object containing a piece of someone's soul", angle: "magic system" },
      { q: "Who wrote the Harry Potter books?", a: "J.K. Rowling", angle: "author" },
      { q: "What is the killing curse called?", a: "Avada Kedavra", angle: "spell" },
      { q: "What is the name of the Weasley family home?", a: "The Burrow", angle: "Hogwarts" },
      { q: "Who is the Half-Blood Prince?", a: "Severus Snape", angle: "prophecy" },
      { q: "What patronus does Harry have?", a: "A stag", angle: "spell" },
      { q: "Who is the ghost of Gryffindor?", a: "Nearly Headless Nick", angle: "house" },
      { q: "What spell summons objects?", a: "Accio", angle: "spell" },
      { q: "Who does Hermione marry?", a: "Ron Weasley", angle: "Hogwarts" },
      { q: "What does Hermione turn into with Polyjuice Potion?", a: "A cat (accidentally)", angle: "spell" },
      { q: "What are the Unforgivable Curses?", a: "Avada Kedavra, Crucio, Imperio", angle: "spell" },
      { q: "Who is the potions master in book 1?", a: "Severus Snape", angle: "Hogwarts" },
      { q: "What creature can only be seen by those who've seen death?", a: "Thestrals", angle: "creature" },
      { q: "What's the name of the wizard prison?", a: "Azkaban", angle: "magic system" },
      { q: "Who does Harry kiss first?", a: "Cho Chang", angle: "Hogwarts" }
    ],
    hard: [
      { q: "What is Dumbledore's full name?", a: "Albus Percival Wulfric Brian Dumbledore", angle: "author" },
      { q: "What type of wood is Harry's wand made from?", a: "Holly", angle: "wand" },
      { q: "What are the names of James Potter's friends (Marauders)?", a: "Sirius Black, Remus Lupin, Peter Pettigrew", angle: "prophecy" },
      { q: "What is the prophecy about Harry and Voldemort?", a: "Neither can live while the other survives", angle: "prophecy" },
      { q: "What potion gives good luck?", a: "Felix Felicis", angle: "spell" },
      { q: "What is Hermione's cat's name?", a: "Crookshanks", angle: "creature" },
      { q: "How many Horcruxes did Voldemort create?", a: "7 (including Harry)", angle: "magic system" },
      { q: "What is the core of Harry's wand?", a: "Phoenix feather", angle: "wand" },
      { q: "Who gave Harry the Marauder's Map?", a: "Fred and George Weasley", angle: "Hogwarts" },
      { q: "What year was the first Harry Potter book published?", a: "1997", angle: "author" },
      { q: "What are the Marauders' nicknames?", a: "Moony, Wormtail, Padfoot, Prongs", angle: "prophecy" },
      { q: "What is Voldemort's mother's name?", a: "Merope Gaunt", angle: "magic system" },
      { q: "What is the name of the Weasley's owl?", a: "Errol", angle: "creature" },
      { q: "Who is R.A.B. who stole the locket Horcrux?", a: "Regulus Arcturus Black", angle: "magic system" },
      { q: "What creature is Aragog?", a: "Acromantula (giant spider)", angle: "creature" },
      { q: "What is Snape's Patronus?", a: "A doe (same as Lily's)", angle: "spell" },
      { q: "What position did James Potter play in Quidditch?", a: "Chaser", angle: "Hogwarts" },
      { q: "What are the ingredients of Polyjuice Potion?", a: "Lacewing flies, leeches, powdered bicorn horn, knotgrass, fluxweed, shredded boomslang skin, and a bit of the person", angle: "spell" },
      { q: "Who founded Hogwarts with Godric Gryffindor?", a: "Salazar Slytherin, Rowena Ravenclaw, Helga Hufflepuff", angle: "Hogwarts" },
      { q: "What is the name of Neville's toad?", a: "Trevor", angle: "creature" }
    ]
  },
  "music-legends": {
    easy: [
      { q: "Who is known as the King of Pop?", a: "Michael Jackson", angle: "iconic tour" },
      { q: "What band were John, Paul, George, and Ringo in?", a: "The Beatles", angle: "chart topper" },
      { q: "Who sang 'Purple Rain'?", a: "Prince", angle: "signature song" },
      { q: "What instrument does a drummer play?", a: "Drums", angle: "guitar solo" },
      { q: "Who is the Queen of Soul?", a: "Aretha Franklin", angle: "signature song" },
      { q: "What city is known as the birthplace of jazz?", a: "New Orleans", angle: "chart topper" },
      { q: "Who sang 'Imagine'?", a: "John Lennon", angle: "signature song" },
      { q: "What does 'LP' stand for in music?", a: "Long Play (album)", angle: "classic album" },
      { q: "Who is known as 'The Boss'?", a: "Bruce Springsteen", angle: "iconic tour" },
      { q: "What genre is Bob Marley famous for?", a: "Reggae", angle: "signature song" }
    ],
    medium: [
      { q: "What year did Elvis Presley die?", a: "1977", angle: "chart topper" },
      { q: "Who performed at the first Super Bowl halftime show?", a: "University marching bands (not a music legend until 1991)", angle: "iconic tour" },
      { q: "What was The Beatles' first #1 hit in America?", a: "I Want to Hold Your Hand", angle: "chart topper" },
      { q: "Who wrote 'Bohemian Rhapsody'?", a: "Freddie Mercury", angle: "signature song" },
      { q: "What is Elvis Presley's middle name?", a: "Aaron", angle: "chart topper" },
      { q: "Who is the best-selling female artist of all time?", a: "Madonna", angle: "chart topper" },
      { q: "What band was Freddie Mercury in?", a: "Queen", angle: "iconic tour" },
      { q: "Who played guitar left-handed?", a: "Jimi Hendrix (among others)", angle: "guitar solo" },
      { q: "What decade is known as the birth of rock and roll?", a: "1950s", angle: "classic album" },
      { q: "Who sang 'Respect'?", a: "Aretha Franklin", angle: "signature song" }
    ],
    hard: [
      { q: "What was David Bowie's real name?", a: "David Robert Jones", angle: "chart topper" },
      { q: "How many Grammy Awards did Michael Jackson win in 1984?", a: "8", angle: "iconic tour" },
      { q: "What album is the best-selling of all time?", a: "Thriller by Michael Jackson", angle: "classic album" },
      { q: "Who was the first woman inducted into the Rock and Roll Hall of Fame?", a: "Aretha Franklin", angle: "chart topper" },
      { q: "What guitar did B.B. King famously name 'Lucille'?", a: "Gibson ES-355", angle: "guitar solo" },
      { q: "What year did Woodstock take place?", a: "1969", angle: "iconic tour" },
      { q: "Who wrote 'Stairway to Heaven'?", a: "Jimmy Page and Robert Plant (Led Zeppelin)", angle: "classic album" },
      { q: "What was Prince's symbol called?", a: "Love Symbol", angle: "signature song" },
      { q: "Who was known as the 'Godfather of Soul'?", a: "James Brown", angle: "signature song" },
      { q: "What year was the MTV launched?", a: "1981", angle: "chart topper" }
    ]
  },
  "us-history": {
    easy: [
      { q: "Who was the first President of the United States?", a: "George Washington", angle: "founding" },
      { q: "What year did America declare independence?", a: "1776", angle: "revolution" },
      { q: "How many stars are on the American flag?", a: "50", angle: "amendment" },
      { q: "What is the capital of the United States?", a: "Washington, D.C.", angle: "milestone" },
      { q: "Who wrote the Declaration of Independence?", a: "Thomas Jefferson", angle: "founding" },
      { q: "What war was fought between the North and South?", a: "The Civil War", angle: "conflict" },
      { q: "Who was president during the Civil War?", a: "Abraham Lincoln", angle: "founding" },
      { q: "What document freed the slaves?", a: "Emancipation Proclamation", angle: "amendment" },
      { q: "How many amendments are in the Bill of Rights?", a: "10", angle: "amendment" },
      { q: "What country did America gain independence from?", a: "Great Britain (England)", angle: "revolution" }
    ],
    medium: [
      { q: "What year did the United States land on the moon?", a: "1969", angle: "milestone" },
      { q: "Who was the longest-serving US President?", a: "Franklin D. Roosevelt", angle: "founding" },
      { q: "What purchase doubled the size of the US in 1803?", a: "Louisiana Purchase", angle: "milestone" },
      { q: "Who assassinated Abraham Lincoln?", a: "John Wilkes Booth", angle: "conflict" },
      { q: "What amendment gave women the right to vote?", a: "19th Amendment", angle: "amendment" },
      { q: "What year did the Great Depression begin?", a: "1929", angle: "milestone" },
      { q: "Who was the first man on the moon?", a: "Neil Armstrong", angle: "milestone" },
      { q: "What war began in 1861?", a: "The American Civil War", angle: "conflict" },
      { q: "What city was the first US capital?", a: "New York City (then Philadelphia)", angle: "founding" },
      { q: "Who invented the light bulb?", a: "Thomas Edison", angle: "milestone" }
    ],
    hard: [
      { q: "What Supreme Court case ended segregation in schools?", a: "Brown v. Board of Education", angle: "amendment" },
      { q: "Who was president during the Louisiana Purchase?", a: "Thomas Jefferson", angle: "milestone" },
      { q: "What year was the Constitution ratified?", a: "1788", angle: "founding" },
      { q: "Who was the only president to resign?", a: "Richard Nixon", angle: "founding" },
      { q: "What amendment abolished slavery?", a: "13th Amendment", angle: "amendment" },
      { q: "What treaty ended the American Revolution?", a: "Treaty of Paris (1783)", angle: "revolution" },
      { q: "Who was president during World War I?", a: "Woodwood Wilson", angle: "conflict" },
      { q: "What year did Alaska become a state?", a: "1959", angle: "milestone" },
      { q: "Who wrote the Federalist Papers with Hamilton and Jay?", a: "James Madison", angle: "founding" },
      { q: "What scandal led to Nixon's resignation?", a: "Watergate", angle: "founding" }
    ]
  },
  "space-exploration": {
    easy: [
      { q: "What planet is known as the Red Planet?", a: "Mars", angle: "planet" },
      { q: "Who was the first person in space?", a: "Yuri Gagarin", angle: "astronaut" },
      { q: "What does NASA stand for?", a: "National Aeronautics and Space Administration", angle: "mission" },
      { q: "How many planets are in our solar system?", a: "8", angle: "planet" },
      { q: "What is the largest planet?", a: "Jupiter", angle: "planet" },
      { q: "What spacecraft landed on Mars?", a: "Rovers like Curiosity and Perseverance", angle: "rover" },
      { q: "What is Earth's only natural satellite?", a: "The Moon", angle: "moon" },
      { q: "Who was the first American in space?", a: "Alan Shepard", angle: "astronaut" },
      { q: "What is the closest planet to the Sun?", a: "Mercury", angle: "planet" },
      { q: "What galaxy do we live in?", a: "The Milky Way", angle: "planet" }
    ],
    medium: [
      { q: "What year did humans first land on the moon?", a: "1969", angle: "mission" },
      { q: "What is the name of NASA's moon program?", a: "Apollo Program", angle: "mission" },
      { q: "How long does it take Earth to orbit the Sun?", a: "365.25 days (1 year)", angle: "orbit" },
      { q: "What is the International Space Station's abbreviation?", a: "ISS", angle: "mission" },
      { q: "Which planet has the most moons?", a: "Saturn (or Jupiter, depending on recent discoveries)", angle: "moon" },
      { q: "What space telescope launched in 1990?", a: "Hubble Space Telescope", angle: "telescope" },
      { q: "What is a rover?", a: "A robotic vehicle designed to explore planetary surfaces", angle: "rover" },
      { q: "Who said 'That's one small step for man'?", a: "Neil Armstrong", angle: "astronaut" },
      { q: "What planet has the Great Red Spot?", a: "Jupiter", angle: "planet" },
      { q: "What company does Elon Musk own for space travel?", a: "SpaceX", angle: "mission" }
    ],
    hard: [
      { q: "What was the first artificial satellite?", a: "Sputnik 1", angle: "mission" },
      { q: "Which Apollo mission successfully landed on the moon?", a: "Apollo 11", angle: "mission" },
      { q: "What year did the Challenger disaster occur?", a: "1986", angle: "mission" },
      { q: "How many people have walked on the moon?", a: "12", angle: "astronaut" },
      { q: "What is the Voyager spacecraft's mission?", a: "To explore the outer solar system and beyond", angle: "mission" },
      { q: "What dwarf planet was reclassified in 2006?", a: "Pluto", angle: "planet" },
      { q: "Who was the first woman in space?", a: "Valentina Tereshkova", angle: "astronaut" },
      { q: "What is the Karman line?", a: "The boundary between Earth's atmosphere and outer space (100 km)", angle: "mission" },
      { q: "What Mars rover lasted 15 years?", a: "Opportunity", angle: "rover" },
      { q: "What telescope replaced Hubble?", a: "James Webb Space Telescope", angle: "telescope" }
    ]
  },
  "soccer": {
    easy: [
      { q: "How many players are on a soccer team on the field?", a: "11", angle: "position" },
      { q: "What is it called when a player scores three goals in one game?", a: "Hat trick", angle: "record" },
      { q: "Who wears the number 10 jersey traditionally?", a: "The team's playmaker/star player", angle: "legend" },
      { q: "What body part can't touch the ball (except goalkeeper)?", a: "Hands and arms", angle: "rule" },
      { q: "What is the World Cup trophy called?", a: "FIFA World Cup Trophy", angle: "World Cup" },
      { q: "How long is a professional soccer match?", a: "90 minutes (two 45-minute halves)", angle: "rule" },
      { q: "What color card sends a player off the field?", a: "Red card", angle: "rule" },
      { q: "What is a goalkeeper's job?", a: "To stop the ball from entering the goal", angle: "position" },
      { q: "How often is the World Cup held?", a: "Every 4 years", angle: "World Cup" },
      { q: "What is it called when the ball goes out on the sideline?", a: "Throw-in", angle: "rule" }
    ],
    medium: [
      { q: "Who has won the most World Cups?", a: "Brazil (5 titles)", angle: "World Cup" },
      { q: "What is Lionel Messi's nationality?", a: "Argentine", angle: "legend" },
      { q: "What club is known as 'The Red Devils'?", a: "Manchester United", angle: "club" },
      { q: "What is a 'derby' match?", a: "A match between two local rival teams", angle: "club" },
      { q: "Who is considered the greatest soccer player of all time by many?", a: "Pelé or Diego Maradona (debated)", angle: "legend" },
      { q: "What does UEFA stand for?", a: "Union of European Football Associations", angle: "World Cup" },
      { q: "What position is between defender and forward?", a: "Midfielder", angle: "position" },
      { q: "What is the biggest club competition in Europe?", a: "UEFA Champions League", angle: "club" },
      { q: "What country hosted the 2022 World Cup?", a: "Qatar", angle: "World Cup" },
      { q: "What is a 'nutmeg' in soccer?", a: "Kicking the ball between an opponent's legs", angle: "rule" }
    ],
    hard: [
      { q: "Who scored the 'Hand of God' goal?", a: "Diego Maradona", angle: "legend" },
      { q: "What year was the first World Cup held?", a: "1930", angle: "World Cup" },
      { q: "Who has scored the most goals in World Cup history?", a: "Miroslav Klose (16 goals)", angle: "record" },
      { q: "What is the transfer record fee paid for a player?", a: "€222 million (Neymar to PSG, 2017)", angle: "club" },
      { q: "How many Ballon d'Or awards has Lionel Messi won?", a: "8 (as of 2023)", angle: "legend" },
      { q: "What stadium is known as 'The Theatre of Dreams'?", a: "Old Trafford (Manchester United)", angle: "club" },
      { q: "Who won the first World Cup?", a: "Uruguay", angle: "World Cup" },
      { q: "What is the offside rule?", a: "A player is offside if closer to goal than second-to-last opponent when ball is played", angle: "rule" },
      { q: "Who is the all-time top scorer in Champions League?", a: "Cristiano Ronaldo", angle: "record" },
      { q: "What year did women's soccer become an Olympic sport?", a: "1996", angle: "World Cup" }
    ]
  },
  "disney-classics": {
    easy: [
      { q: "What was Disney's first full-length animated film?", a: "Snow White and the Seven Dwarfs", angle: "animation" },
      { q: "What type of animal is Mickey Mouse?", a: "Mouse", angle: "sidekick" },
      { q: "What princess has long magical hair?", a: "Rapunzel", angle: "castle" },
      { q: "Who is Simba's father in The Lion King?", a: "Mufasa", angle: "sidekick" },
      { q: "What does Cinderella lose at the ball?", a: "Her glass slipper", angle: "song" },
      { q: "What is the name of Aladdin's monkey?", a: "Abu", angle: "sidekick" },
      { q: "Who is the snowman in Frozen?", a: "Olaf", angle: "sidekick" },
      { q: "What color is Snow White's bow?", a: "Red", angle: "animation" },
      { q: "What does Ariel want to be in The Little Mermaid?", a: "Human", angle: "song" },
      { q: "Who is Belle's father in Beauty and the Beast?", a: "Maurice", angle: "castle" }
    ],
    medium: [
      { q: "What year was The Lion King released?", a: "1994", angle: "animation" },
      { q: "Who voices Woody in Toy Story?", a: "Tom Hanks", angle: "sidekick" },
      { q: "What song does Elsa sing in Frozen?", a: "Let It Go", angle: "song" },
      { q: "What is the name of Mulan's dragon sidekick?", a: "Mushu", angle: "sidekick" },
      { q: "What castle is at Disney World?", a: "Cinderella Castle", angle: "castle" },
      { q: "Who is the villain in Sleeping Beauty?", a: "Maleficent", angle: "animation" },
      { q: "What does 'Hakuna Matata' mean?", a: "No worries", angle: "song" },
      { q: "What is the name of Andy's neighbor in Toy Story?", a: "Sid", angle: "sidekick" },
      { q: "How many dwarfs are in Snow White?", a: "Seven", angle: "animation" },
      { q: "What is Moana's pet rooster named?", a: "Heihei", angle: "sidekick" }
    ],
    hard: [
      { q: "What was the first Pixar movie?", a: "Toy Story (1995)", angle: "animation" },
      { q: "Who composed the music for The Lion King?", a: "Hans Zimmer (with songs by Elton John)", angle: "song" },
      { q: "What year did Disneyland open?", a: "1955", angle: "castle" },
      { q: "What is the name of Ariel's father?", a: "King Triton", angle: "animation" },
      { q: "How many Disney princesses are there officially?", a: "13 (as of 2023)", angle: "animation" },
      { q: "What was Disney's first animated sequel?", a: "The Rescuers Down Under (1990)", angle: "animation" },
      { q: "Who voiced Genie in the original Aladdin?", a: "Robin Williams", angle: "sidekick" },
      { q: "What is the longest Disney animated film?", a: "Fantasia (126 minutes)", angle: "animation" },
      { q: "What castle is at Disneyland?", a: "Sleeping Beauty Castle", angle: "castle" },
      { q: "Who is the oldest Disney princess?", a: "Snow White (first created in 1937)", angle: "animation" }
    ]
  },
  "modern-games": {
    easy: [
      { q: "What game features Steve and blocky graphics?", a: "Minecraft", angle: "crafting" },
      { q: "What battle royale game has a Victory Royale?", a: "Fortnite", angle: "online squad" },
      { q: "What company makes PlayStation?", a: "Sony", angle: "open world" },
      { q: "What game series features Master Chief?", a: "Halo", angle: "boss fight" },
      { q: "What is the main character in The Legend of Zelda?", a: "Link", angle: "boss fight" },
      { q: "What sport is FIFA about?", a: "Soccer/Football", angle: "online squad" },
      { q: "What color is Sonic the Hedgehog?", a: "Blue", angle: "boss fight" },
      { q: "What game has Creepers that explode?", a: "Minecraft", angle: "crafting" },
      { q: "What does RPG stand for in gaming?", a: "Role-Playing Game", angle: "open world" },
      { q: "What company makes Xbox?", a: "Microsoft", angle: "online squad" }
    ],
    medium: [
      { q: "What year was Minecraft released?", a: "2011", angle: "crafting" },
      { q: "What game won Game of the Year in 2023?", a: "Baldur's Gate 3", angle: "open world" },
      { q: "Who is the main character in The Witcher games?", a: "Geralt of Rivia", angle: "open world" },
      { q: "What does 'GG' mean in gaming?", a: "Good Game", angle: "online squad" },
      { q: "What game series features the Dragonborn?", a: "The Elder Scrolls (Skyrim)", angle: "open world" },
      { q: "What battle royale game is set in Apex Games?", a: "Apex Legends", angle: "online squad" },
      { q: "What is the highest-selling video game of all time?", a: "Minecraft", angle: "crafting" },
      { q: "What company developed The Last of Us?", a: "Naughty Dog", angle: "boss fight" },
      { q: "What game popularized battle royale genre?", a: "PlayerUnknown's Battlegrounds (PUBG)", angle: "online squad" },
      { q: "What is the crafting table used for in Minecraft?", a: "Creating items and tools", angle: "crafting" }
    ],
    hard: [
      { q: "Who created Minecraft?", a: "Markus 'Notch' Persson", angle: "crafting" },
      { q: "What game engine does Fortnite use?", a: "Unreal Engine", angle: "online squad" },
      { q: "What year did Fortnite Battle Royale launch?", a: "2017", angle: "online squad" },
      { q: "What is the max level in Elden Ring?", a: "713", angle: "boss fight" },
      { q: "Who developed Red Dead Redemption 2?", a: "Rockstar Games", angle: "open world" },
      { q: "What does 'FromSoftware' develop?", a: "Dark Souls, Elden Ring, Bloodborne series", angle: "boss fight" },
      { q: "What year did the Nintendo Switch launch?", a: "2017", angle: "open world" },
      { q: "What is the currency in Minecraft?", a: "Emeralds (trading with villagers)", angle: "crafting" },
      { q: "Who won The Game Awards 2018?", a: "God of War", angle: "boss fight" },
      { q: "What game has sold over 200 million copies?", a: "Minecraft", angle: "crafting" }
    ]
  },
  "lotr": {
    easy: [
      { q: "Who wrote The Lord of the Rings?", a: "J.R.R. Tolkien", angle: "author" },
      { q: "What is the name of the ring that must be destroyed?", a: "The One Ring", angle: "quest" },
      { q: "Who is Frodo's gardener and companion?", a: "Samwise Gamgee (Sam)", angle: "fellowship" },
      { q: "What creatures are Gandalf and Saruman?", a: "Wizards (Istari)", angle: "magic system" },
      { q: "What is the dark land where the ring must be destroyed?", a: "Mordor", angle: "Middle-earth" },
      { q: "What type of creature is Gimli?", a: "Dwarf", angle: "fellowship" },
      { q: "What type of creature is Legolas?", a: "Elf", angle: "fellowship" },
      { q: "Who is the heir to the throne of Gondor?", a: "Aragorn", angle: "fellowship" },
      { q: "What creature was Gollum originally?", a: "Hobbit-like creature (Stoor)", angle: "creature" },
      { q: "What is Frodo's last name?", a: "Baggins", angle: "fellowship" },
      { q: "What is the peaceful land where hobbits live?", a: "The Shire", angle: "Middle-earth" },
      { q: "Who is the Dark Lord?", a: "Sauron", angle: "quest" },
      { q: "What color is Gandalf the Grey's robes?", a: "Grey (later becomes white)", angle: "magic system" },
      { q: "What are the tall tree creatures called?", a: "Ents", angle: "creature" },
      { q: "Who is Bilbo to Frodo?", a: "Uncle (actually cousin)", angle: "fellowship" },
      { q: "What is precious to Gollum?", a: "The Ring", angle: "ring" },
      { q: "What do hobbits love to eat?", a: "Multiple meals a day", angle: "Middle-earth" },
      { q: "What race is Aragorn?", a: "Human (Man)", angle: "fellowship" },
      { q: "Who is Gimli's best friend?", a: "Legolas the Elf", angle: "fellowship" },
      { q: "What creatures chase Frodo at the beginning?", a: "Nazgûl / Ringwraiths", angle: "creature" }
    ],
    medium: [
      { q: "What is the name of Gandalf's horse?", a: "Shadowfax", angle: "creature" },
      { q: "What is the Elvish name for the One Ring?", a: "The Ruling Ring / Ash Nazg", angle: "ring" },
      { q: "Who is the leader of the Nine Riders?", a: "The Witch-king of Angmar", angle: "creature" },
      { q: "What is the name of Aragorn's sword?", a: "Andúril (reforged from Narsil)", angle: "quest" },
      { q: "What forest do the Ents live in?", a: "Fangorn Forest", angle: "Middle-earth" },
      { q: "Who is the Lady of Lothlórien?", a: "Galadriel", angle: "fellowship" },
      { q: "What is the name of the volcano where the ring is destroyed?", a: "Mount Doom (Orodruin)", angle: "quest" },
      { q: "How many rings of power were made for Men?", a: "Nine", angle: "ring" },
      { q: "What is the Shire's closest neighbor kingdom?", a: "Bree", angle: "Middle-earth" },
      { q: "Who kills the Witch-king?", a: "Éowyn (with Merry's help)", angle: "quest" },
      { q: "Who are Merry and Pippin?", a: "Frodo's hobbit friends", angle: "fellowship" },
      { q: "What is the name of the inn where Frodo meets Aragorn?", a: "The Prancing Pony", angle: "Middle-earth" },
      { q: "Who is Arwen?", a: "Elven princess (Aragorn's love)", angle: "fellowship" },
      { q: "What is the White City called?", a: "Minas Tirith", angle: "Middle-earth" },
      { q: "Who is Boromir's brother?", a: "Faramir", angle: "fellowship" },
      { q: "What creature attacks the Fellowship in Moria?", a: "The Balrog", angle: "creature" },
      { q: "How many rings were made for Dwarves?", a: "Seven", angle: "ring" },
      { q: "Who plays Gandalf in the films?", a: "Ian McKellen", angle: "author" },
      { q: "What is Legolas's weapon of choice?", a: "Bow and arrows", angle: "quest" },
      { q: "What is Gimli's weapon of choice?", a: "Axe", angle: "quest" }
    ],
    hard: [
      { q: "What is Gandalf's original name in Valinor?", a: "Olórin", angle: "magic system" },
      { q: "How many members were in the Fellowship originally?", a: "Nine", angle: "fellowship" },
      { q: "What is Gollum's real name?", a: "Sméagol", angle: "creature" },
      { q: "What year was The Fellowship of the Ring published?", a: "1954", angle: "author" },
      { q: "What is the prophecy about the Witch-king?", a: "No man can kill him", angle: "prophecy" },
      { q: "Who is Tom Bombadil?", a: "A mysterious nature spirit (origins unclear)", angle: "creature" },
      { q: "What is the name of Frodo's Elvish blade?", a: "Sting", angle: "quest" },
      { q: "How many rings were made for the Elves?", a: "Three", angle: "ring" },
      { q: "What is the name of Saruman's tower?", a: "Orthanc (in Isengard)", angle: "Middle-earth" },
      { q: "Who carries Frodo up Mount Doom?", a: "Samwise Gamgee", angle: "fellowship" },
      { q: "What is the inscription on the One Ring?", a: "One Ring to rule them all...", angle: "ring" },
      { q: "Who is Elrond?", a: "Elf lord of Rivendell (Arwen's father)", angle: "fellowship" },
      { q: "What are the three Elven rings called?", a: "Vilya, Narya, Nenya", angle: "ring" },
      { q: "Who directed the LOTR film trilogy?", a: "Peter Jackson", angle: "author" },
      { q: "What is Aragorn's ranger name?", a: "Strider", angle: "fellowship" },
      { q: "What is the name of Treebeard's race?", a: "Ents", angle: "creature" },
      { q: "Who is the Steward of Gondor?", a: "Denethor", angle: "Middle-earth" },
      { q: "What does 'Gandalf' mean in Elvish?", a: "Elf of the Wand", angle: "magic system" },
      { q: "What year did the film trilogy begin?", a: "2001", angle: "author" },
      { q: "What is Sam's wife's name?", a: "Rosie Cotton", angle: "fellowship" }
    ]
  },
  "world-history": {
    easy: [
      { q: "What ancient wonder is in Egypt?", a: "The Pyramids (Great Pyramid of Giza)", angle: "ancient empire" },
      { q: "Who was the first emperor of Rome?", a: "Augustus Caesar", angle: "ancient empire" },
      { q: "What famous wall is often incorrectly said to be visible from space?", a: "The Great Wall of China", angle: "ancient empire" },
      { q: "Who painted the Mona Lisa?", a: "Leonardo da Vinci", angle: "ancient empire" },
      { q: "What ship sank in 1912?", a: "The Titanic", angle: "conflict" },
      { q: "What country did Napoleon rule?", a: "France", angle: "conflict" },
      { q: "What is the oldest religion?", a: "Hinduism (generally considered)", angle: "ancient empire" },
      { q: "Who discovered America in 1492?", a: "Christopher Columbus", angle: "trade route" },
      { q: "What event started World War I?", a: "Assassination of Archduke Franz Ferdinand", angle: "conflict" },
      { q: "What was the deadliest plague in history?", a: "The Black Death (Bubonic Plague)", angle: "conflict" }
    ],
    medium: [
      { q: "What year did the Roman Empire fall?", a: "476 AD (Western Roman Empire)", angle: "ancient empire" },
      { q: "Who was the longest-reigning British monarch?", a: "Queen Elizabeth II", angle: "ancient empire" },
      { q: "What route connected Europe and Asia for trade?", a: "The Silk Road", angle: "trade route" },
      { q: "What year did World War II end?", a: "1945", angle: "conflict" },
      { q: "Who was the first person to circumnavigate the globe?", a: "Ferdinand Magellan's expedition (completed by Juan Sebastián Elcano)", angle: "trade route" },
      { q: "What empire did Genghis Khan create?", a: "The Mongol Empire", angle: "ancient empire" },
      { q: "What treaty ended World War I?", a: "Treaty of Versailles", angle: "peace accord" },
      { q: "What year did the Berlin Wall fall?", a: "1989", angle: "conflict" },
      { q: "Who wrote 'The Communist Manifesto'?", a: "Karl Marx and Friedrich Engels", angle: "conflict" },
      { q: "What was the Renaissance?", a: "A period of cultural rebirth in Europe (14th-17th century)", angle: "ancient empire" }
    ],
    hard: [
      { q: "What year was the Magna Carta signed?", a: "1215", angle: "peace accord" },
      { q: "Who was the last Tsar of Russia?", a: "Nicholas II", angle: "ancient empire" },
      { q: "What empire was ruled by Suleiman the Magnificent?", a: "Ottoman Empire", angle: "ancient empire" },
      { q: "What year did the French Revolution begin?", a: "1789", angle: "conflict" },
      { q: "Who unified Germany in 1871?", a: "Otto von Bismarck", angle: "peace accord" },
      { q: "What was the Hanseatic League?", a: "Medieval commercial alliance of merchant guilds", angle: "trade route" },
      { q: "What year did Constantinople fall?", a: "1453", angle: "conflict" },
      { q: "Who was the first Holy Roman Emperor?", a: "Charlemagne (800 AD)", angle: "ancient empire" },
      { q: "What treaty divided the New World between Spain and Portugal?", a: "Treaty of Tordesillas (1494)", angle: "peace accord" },
      { q: "What was the Thirty Years' War fought over?", a: "Religious conflict between Catholics and Protestants", angle: "conflict" }
    ]
  },
  "kpop-demon-hunters": {
    easy: [
      { q: "What is the name of the K-pop girl group that hunts demons?", a: "Huntrix (stylized as HUNTR/X)", angle: "idols" },
      { q: "What streaming service released KPop Demon Hunters?", a: "Netflix", angle: "stage battles" },
      { q: "What year was KPop Demon Hunters released?", a: "2025 (June 20)", angle: "idols" },
      { q: "Who is the leader and lead vocalist of Huntrix?", a: "Rumi", angle: "idols" },
      { q: "What is the name of the demon boy band?", a: "Saja Boys", angle: "mythic rivals" },
      { q: "What type of film is KPop Demon Hunters?", a: "Animated musical urban fantasy", angle: "stage battles" },
      { q: "How many members are in Huntrix?", a: "Three (Rumi, Mira, Zoey)", angle: "idols" },
      { q: "Who voices Rumi in the English version?", a: "Arden Cho", angle: "idols" },
      { q: "What weapon does Rumi use in combat?", a: "Saingeom sword", angle: "stage battles" },
      { q: "Who is Huntrix's energetic manager?", a: "Bobby (voiced by Ken Jeong)", angle: "idols" },
      { q: "What type of animation is the film?", a: "Animated (musical)", angle: "stage battles" },
      { q: "Who do Huntrix fight against?", a: "Demons / Saja Boys", angle: "mythic rivals" },
      { q: "What company produced the film?", a: "Sony Pictures Animation", angle: "stage battles" },
      { q: "What genre is the music in the film?", a: "K-pop", angle: "dance breaks" },
      { q: "How many members are in Saja Boys?", a: "Five (Jinu, Mystery, Abby, Baby, Romance)", angle: "mythic rivals" },
      { q: "Who is the main character?", a: "Rumi", angle: "idols" },
      { q: "What is the film's main theme?", a: "K-pop idols hunting demons", angle: "stage battles" },
      { q: "Who is Rumi's mentor?", a: "Celine", angle: "idols" },
      { q: "What makes Huntrix special?", a: "They're demon hunters and K-pop idols", angle: "stage battles" },
      { q: "Is the film a comedy or drama?", a: "Musical action fantasy", angle: "dance breaks" }
    ],
    medium: [
      { q: "What secret does Rumi hide from her group?", a: "She is half-demon", angle: "mythic rivals" },
      { q: "Who is Jinu, the leader of Saja Boys?", a: "A human-turned-demon who leads the boy band", angle: "mythic rivals" },
      { q: "What weapon does Mira wield in combat?", a: "Gokdo polearm", angle: "stage battles" },
      { q: "What weapon does Zoey use to fight demons?", a: "Shinkal throwing knives", angle: "stage battles" },
      { q: "Who trained and fostered Rumi after her mother died?", a: "Celine, a former demon hunter and K-pop idol", angle: "idols" },
      { q: "What Grammy-nominated song topped the charts?", a: "Golden", angle: "dance breaks" },
      { q: "What pet accompanies Jinu?", a: "A blue tiger and a six-eyed magpie", angle: "mythic rivals" },
      { q: "What role does Zoey have in Huntrix?", a: "Main rapper, lyricist, and maknae (youngest)", angle: "idols" },
      { q: "What role does Mira have in Huntrix?", a: "Visual and main dancer", angle: "dance breaks" },
      { q: "Who is the demon king in the film?", a: "Gwi-Ma, who takes the form of a giant fiery mouth", angle: "mythic rivals" },
      { q: "Who voices Mira?", a: "May Hong", angle: "idols" },
      { q: "Who voices Zoey?", a: "Ji-young Yoo", angle: "idols" },
      { q: "Who voices Jinu?", a: "Ahn Hyo-seop", angle: "mythic rivals" },
      { q: "Who voices Celine?", a: "Yunjin Kim", angle: "idols" },
      { q: "What is Rumi's parentage?", a: "Half-human, half-demon", angle: "mythic rivals" },
      { q: "What happens to Jinu at the end?", a: "He sacrifices himself to save Rumi", angle: "mythic rivals" },
      { q: "Who is the villain voice actor?", a: "Lee Byung-hun (Gwi-Ma)", angle: "mythic rivals" },
      { q: "What did Celine used to be?", a: "Demon hunter and K-pop idol", angle: "idols" },
      { q: "What is Rumi's main weapon type?", a: "Korean sword (saingeom)", angle: "stage battles" },
      { q: "What genre blends does the film combine?", a: "K-pop, urban fantasy, action, musical", angle: "dance breaks" }
    ],
    hard: [
      { q: "What are the four KPop Demon Hunters songs that charted in Billboard's top ten?", a: "Golden, Your Idol, Soda Pop, How It's Done", angle: "dance breaks" },
      { q: "What historic Billboard achievement did the soundtrack accomplish?", a: "First film soundtrack with four songs in top ten simultaneously", angle: "dance breaks" },
      { q: "How many Grammy nominations did KPop Demon Hunters receive?", a: "Five (including Song of the Year for 'Golden')", angle: "dance breaks" },
      { q: "What sacrifice does Jinu make in the climax?", a: "He sacrifices himself to save Rumi from Gwi-Ma's attack", angle: "mythic rivals" },
      { q: "What animation studio produced KPop Demon Hunters?", a: "Sony Pictures Animation", angle: "stage battles" },
      { q: "Who are the other members of Saja Boys besides Jinu?", a: "Mystery, Abby, Baby, and Romance", angle: "mythic rivals" },
      { q: "What is the Honmoon that Saja Boys try to weaken?", a: "A mystical seal/barrier that Huntrix protects by maintaining their fanbase", angle: "stage battles" },
      { q: "Who directed KPop Demon Hunters?", a: "Maggie Kang and Chris Appelhans", angle: "stage battles" },
      { q: "What Rotten Tomatoes score did the film receive from critics?", a: "95% Certified Fresh", angle: "idols" },
      { q: "How many views made it Netflix's most popular English film?", a: "Over 325.1 million views", angle: "idols" },
      { q: "Who voices the supporting character Healer Han?", a: "Daniel Dae Kim", angle: "idols" },
      { q: "What award category did 'Golden' get nominated for?", a: "Song of the Year (Grammy)", angle: "dance breaks" },
      { q: "What is unique about this soundtrack's Grammy nominations?", a: "First K-pop group nomination in general field", angle: "dance breaks" },
      { q: "How many countries did the film reach top 10 in?", a: "93 countries", angle: "idols" },
      { q: "What is the RIAA certification for the soundtrack?", a: "Platinum (October 2025)", angle: "dance breaks" },
      { q: "What viewers rating did the film get on Rotten Tomatoes?", a: "99% (audience score)", angle: "idols" },
      { q: "Where did the film have limited theatrical release?", a: "California and New York", angle: "stage battles" },
      { q: "What does Jinu want Gwi-Ma to erase?", a: "His painful human memories", angle: "mythic rivals" },
      { q: "Who co-wrote the screenplay with the directors?", a: "Danya Jimenez and Hannah McMechan", angle: "stage battles" },
      { q: "What is the highest Billboard 200 debut position for soundtracks in 2025?", a: "KPop Demon Hunters soundtrack", angle: "dance breaks" }
    ]
  },
  "disney-classics": {
    easy: [
      { q: "What is the name of the mouse who started it all?", a: "Mickey Mouse", angle: "sidekick" },
      { q: "What does Cinderella lose at midnight?", a: "Her glass slipper", angle: "animation" },
      { q: "What animal is Simba in The Lion King?", a: "Lion", angle: "animation" },
      { q: "Who has long magical hair in Tangled?", a: "Rapunzel", angle: "animation" },
      { q: "What is the name of the snowman in Frozen?", a: "Olaf", angle: "sidekick" },
      { q: "What does Ariel want to have in The Little Mermaid?", a: "Legs / to be human", angle: "songs" },
      { q: "What is Belle's favorite thing to do in Beauty and the Beast?", a: "Read books", angle: "castles" },
      { q: "Who is Mickey Mouse's girlfriend?", a: "Minnie Mouse", angle: "sidekick" },
      { q: "What vegetable does Cinderella's carriage come from?", a: "Pumpkin", angle: "animation" },
      { q: "What color is Donald Duck?", a: "White (with blue outfit)", angle: "sidekick" },
      { q: "Who is the forgetful fish?", a: "Dory (Finding Nemo)", angle: "sidekick" },
      { q: "What does Elsa have power over?", a: "Ice and snow", angle: "animation" },
      { q: "Who is the villain in Aladdin?", a: "Jafar", angle: "castles" },
      { q: "What animal is Dumbo?", a: "Elephant", angle: "animation" },
      { q: "Who sings 'Let It Go'?", a: "Elsa (Idina Menzel)", angle: "songs" },
      { q: "What does Pinocchio's nose do when he lies?", a: "It grows", angle: "animation" },
      { q: "Who is the cowboy in Toy Story?", a: "Woody", angle: "sidekick" },
      { q: "What color is Tinker Bell's dress?", a: "Green", angle: "sidekick" },
      { q: "Who lives with seven dwarfs?", a: "Snow White", angle: "animation" },
      { q: "What does Sleeping Beauty prick her finger on?", a: "A spinning wheel/spindle", angle: "castles" }
    ],
    medium: [
      { q: "What year did Snow White and the Seven Dwarfs premiere?", a: "1937", angle: "animation" },
      { q: "Who composed most of the classic Disney songs?", a: "Various, including Alan Menken and Sherman Brothers", angle: "songs" },
      { q: "What is the Beast's real name in Beauty and the Beast?", a: "Prince Adam", angle: "castles" },
      { q: "Which Disney film features the song 'A Whole New World'?", a: "Aladdin", angle: "songs" },
      { q: "What is Goofy's son's name?", a: "Max", angle: "sidekick" },
      { q: "Who is the villain in Sleeping Beauty?", a: "Maleficent", angle: "castles" },
      { q: "What is the name of Ariel's father?", a: "King Triton", angle: "animation" },
      { q: "Which Disney princess has a tiger as a pet?", a: "Jasmine", angle: "sidekick" },
      { q: "What was Walt Disney's first full-length animated film?", a: "Snow White and the Seven Dwarfs", angle: "animation" },
      { q: "Who voices Genie in the original Aladdin?", a: "Robin Williams", angle: "songs" },
      { q: "What is Mulan's dragon sidekick's name?", a: "Mushu", angle: "sidekick" },
      { q: "Who are Cinderella's stepsisters?", a: "Anastasia and Drizella", angle: "castles" },
      { q: "What is the name of Pocahontas's raccoon?", a: "Meeko", angle: "sidekick" },
      { q: "Who voices Buzz Lightyear?", a: "Tim Allen", angle: "animation" },
      { q: "What is the opening song of The Lion King?", a: "Circle of Life", angle: "songs" },
      { q: "Who is Ariel's best fish friend?", a: "Flounder", angle: "sidekick" },
      { q: "What year did Frozen release?", a: "2013", angle: "animation" },
      { q: "Who is the fashion designer in The Incredibles?", a: "Edna Mode", angle: "sidekick" },
      { q: "What is Moana's pet rooster's name?", a: "Heihei", angle: "sidekick" },
      { q: "Who composed the Frozen soundtrack?", a: "Kristen Anderson-Lopez and Robert Lopez", angle: "songs" }
    ],
    hard: [
      { q: "What was Mickey Mouse's original name?", a: "Mortimer Mouse", angle: "sidekick" },
      { q: "Which Disney film was the first to use CGI?", a: "The Great Mouse Detective (one scene)", angle: "animation" },
      { q: "What is the name of Bambi's rabbit friend?", a: "Thumper", angle: "sidekick" },
      { q: "Which Disney film took the longest to make?", a: "Sleeping Beauty (nearly 10 years)", angle: "castles" },
      { q: "What was the first Disney animated sequel?", a: "The Rescuers Down Under (1990)", angle: "animation" },
      { q: "Who wrote the music for The Lion King?", a: "Elton John and Hans Zimmer", angle: "songs" },
      { q: "What castle is Disney's logo based on?", a: "Neuschwanstein Castle in Germany", angle: "castles" },
      { q: "Which film saved Disney from bankruptcy?", a: "Cinderella (1950)", angle: "animation" },
      { q: "What was Pixar's first feature film?", a: "Toy Story (1995)", angle: "animation" },
      { q: "Who is the only Disney princess with a tattoo?", a: "Pocahontas", angle: "animation" },
      { q: "What are the names of all seven dwarfs?", a: "Doc, Grumpy, Happy, Sleepy, Bashful, Sneezy, Dopey", angle: "animation" },
      { q: "What year was Walt Disney born?", a: "1901", angle: "animation" },
      { q: "What is the name of Sleeping Beauty?", a: "Aurora (Princess Aurora)", angle: "castles" },
      { q: "Who was the first Disney princess?", a: "Snow White", angle: "castles" },
      { q: "What is the highest-grossing Disney animated film?", a: "Frozen II (as of 2024)", angle: "animation" },
      { q: "Who voices Elsa in Frozen?", a: "Idina Menzel", angle: "songs" },
      { q: "What was the first Disney film to win Best Picture Oscar?", a: "None (though Beauty and the Beast was nominated)", angle: "animation" },
      { q: "What is Donald Duck's middle name?", a: "Fauntleroy", angle: "sidekick" },
      { q: "Who is the only Disney princess with brothers?", a: "Merida (from Brave)", angle: "animation" },
      { q: "What year did Disneyland open?", a: "1955", angle: "castles" }
    ]
  },
  "anime-heroes": {
    easy: [
      { q: "What ninja wants to become Hokage?", a: "Naruto Uzumaki", angle: "power-ups" },
      { q: "What food does Goku love?", a: "Food in general (especially rice and meat)", angle: "rivals" },
      { q: "What do ninjas in Naruto use for jutsu?", a: "Hand signs and chakra", angle: "power-ups" },
      { q: "What is a Super Saiyan transformation?", a: "A power-up in Dragon Ball with golden hair", angle: "power-ups" },
      { q: "What does Pikachu say?", a: "Pikachu!", angle: "teams" },
      { q: "What is the name of the notebook in Death Note?", a: "Death Note", angle: "arcs" },
      { q: "What do heroes in My Hero Academia have?", a: "Quirks (superpowers)", angle: "power-ups" },
      { q: "What is Luffy's dream in One Piece?", a: "To become King of the Pirates", angle: "arcs" },
      { q: "What color is Sailor Moon's outfit?", a: "White and blue (with red)", angle: "teams" },
      { q: "What does Ash want to be in Pokémon?", a: "Pokémon Master", angle: "arcs" }
    ],
    medium: [
      { q: "What is Vegeta's relationship to Goku?", a: "Rival (and fellow Saiyan)", angle: "rivals" },
      { q: "What is the Survey Corps fighting in Attack on Titan?", a: "Titans", angle: "teams" },
      { q: "What is Kakashi's signature jutsu?", a: "Chidori / Lightning Blade", angle: "power-ups" },
      { q: "What type of fruit gives Luffy his powers?", a: "Gum-Gum Fruit (Devil Fruit)", angle: "power-ups" },
      { q: "Who is the main rival in Pokémon?", a: "Gary Oak (originally)", angle: "rivals" },
      { q: "What is the name of the exam to become a Hunter?", a: "Hunter Exam (Hunter x Hunter)", angle: "arcs" },
      { q: "What does Deku inherit from All Might?", a: "One For All (quirk)", angle: "power-ups" },
      { q: "What organization does Light fight against?", a: "L and the Task Force", angle: "rivals" },
      { q: "What is the Chunin Exam in Naruto?", a: "A test to advance ninja rank", angle: "arcs" },
      { q: "Who is Edward Elric's brother?", a: "Alphonse Elric", angle: "teams" }
    ],
    hard: [
      { q: "What is the true nature of Goku's Ultra Instinct?", a: "Body moves independently of thought", angle: "power-ups" },
      { q: "What happened to Nina Tucker in Fullmetal Alchemist?", a: "Fused with her dog by her father", angle: "arcs" },
      { q: "What is the Will of D in One Piece?", a: "A mysterious inherited will (still unexplained)", angle: "arcs" },
      { q: "Who voices Spike Spiegel in Cowboy Bebop (English)?", a: "Steve Blum", angle: "teams" },
      { q: "What is the true identity of Tobi?", a: "Obito Uchiha", angle: "rivals" },
      { q: "What does 'Neon Genesis Evangelion' critique?", a: "Human connection and existentialism", angle: "arcs" },
      { q: "Who created the first Pokémon?", a: "Arceus (in Pokémon lore)", angle: "power-ups" },
      { q: "What is Lelouch's Geass power?", a: "Absolute obedience command", angle: "power-ups" },
      { q: "What year did Dragon Ball first air?", a: "1986", angle: "arcs" },
      { q: "What is the Philosopher's Stone made from?", a: "Human souls", angle: "power-ups" }
    ]
  },
  "soccer": {
    easy: [
      { q: "How many players are on a soccer team on the field?", a: "11 players", angle: "rule" },
      { q: "What is it called when you score in soccer?", a: "A goal", angle: "championship" },
      { q: "What body part can't touch the ball (except goalkeeper)?", a: "Hands and arms", angle: "rule" },
      { q: "What is the biggest soccer tournament?", a: "FIFA World Cup", angle: "world cups" },
      { q: "Who guards the goal?", a: "Goalkeeper / Goalie", angle: "position" },
      { q: "What color card means you're sent off?", a: "Red card", angle: "rule" },
      { q: "What is Messi's first name?", a: "Lionel", angle: "legends" },
      { q: "What shape is a soccer field?", a: "Rectangle", angle: "rule" },
      { q: "How long is a professional soccer match?", a: "90 minutes (two 45-minute halves)", angle: "rule" },
      { q: "What country won the most World Cups?", a: "Brazil (5 World Cups)", angle: "world cups" }
    ],
    medium: [
      { q: "What is the 'hat trick' in soccer?", a: "Scoring three goals in one game", angle: "record" },
      { q: "What club has Cristiano Ronaldo NOT played for?", a: "Barcelona (among many others)", angle: "clubs" },
      { q: "What does VAR stand for?", a: "Video Assistant Referee", angle: "rule" },
      { q: "Which position is known as 'number 10'?", a: "Attacking midfielder / Playmaker", angle: "position" },
      { q: "What year was the first World Cup held?", a: "1930", angle: "world cups" },
      { q: "What is the penalty area also called?", a: "The box / 18-yard box", angle: "rule" },
      { q: "Who is considered the greatest soccer player ever?", a: "Pelé or Diego Maradona (debated)", angle: "legends" },
      { q: "What club did Pelé play for?", a: "Santos FC (Brazil)", angle: "clubs" },
      { q: "What is 'offside' in soccer?", a: "Being ahead of the last defender when ball is played", angle: "rule" },
      { q: "Which country hosted the 2018 World Cup?", a: "Russia", angle: "world cups" }
    ],
    hard: [
      { q: "Who scored the 'Hand of God' goal?", a: "Diego Maradona (1986)", angle: "legends" },
      { q: "What is the record for most goals in a World Cup tournament?", a: "13 goals by Just Fontaine (1958)", angle: "record" },
      { q: "Which club has won the most Champions League titles?", a: "Real Madrid (14 titles)", angle: "clubs" },
      { q: "What was the first country to win the World Cup?", a: "Uruguay (1930)", angle: "world cups" },
      { q: "Who is the all-time top scorer in World Cup history?", a: "Miroslav Klose (16 goals)", angle: "record" },
      { q: "What is the 'Total Football' philosophy?", a: "Dutch tactical system where players interchange positions", angle: "position" },
      { q: "Which goalkeeper saved the most penalties in World Cups?", a: "Multiple tied at 4 (including Neuer, Casillas)", angle: "legends" },
      { q: "What is the 'Panenka' penalty kick?", a: "A chipped penalty down the middle", angle: "record" },
      { q: "Who is the youngest World Cup winner?", a: "Pelé (17 years old in 1958)", angle: "legends" },
      { q: "What year did the backpass rule change?", a: "1992", angle: "rule" }
    ]
  },
  "retro-games": {
    easy: [
      { q: "What plumber jumps on turtles?", a: "Mario", angle: "platformers" },
      { q: "What does Pac-Man eat?", a: "Dots / Pellets", angle: "arcades" },
      { q: "What color is Sonic the Hedgehog?", a: "Blue", angle: "platformers" },
      { q: "What game features falling blocks you must arrange?", a: "Tetris", angle: "arcades" },
      { q: "Who is Mario's brother?", a: "Luigi", angle: "platformers" },
      { q: "What do you collect in Sonic games?", a: "Rings", angle: "platformers" },
      { q: "What game has a yellow circle eating dots?", a: "Pac-Man", angle: "arcades" },
      { q: "What does Mario hit to get coins?", a: "? Blocks / Question blocks", angle: "platformers" },
      { q: "What console was the NES?", a: "Nintendo Entertainment System", angle: "8-bit" },
      { q: "Who is Link trying to save?", a: "Princess Zelda", angle: "platformers" }
    ],
    medium: [
      { q: "What was the first home video game console?", a: "Magnavox Odyssey (1972)", angle: "8-bit" },
      { q: "What code gives you 30 lives in Contra?", a: "Up, Up, Down, Down, Left, Right, Left, Right, B, A", angle: "cheat codes" },
      { q: "What year did the NES launch in North America?", a: "1985", angle: "8-bit" },
      { q: "What is Mario's original profession?", a: "Carpenter (in Donkey Kong)", angle: "platformers" },
      { q: "What game caused the 1983 video game crash?", a: "E.T. the Extra-Terrestrial (among others)", angle: "arcades" },
      { q: "What company created Donkey Kong?", a: "Nintendo", angle: "platformers" },
      { q: "What does the Konami Code unlock?", a: "Extra lives / power-ups (varies by game)", angle: "cheat codes" },
      { q: "What was Sega's first console?", a: "SG-1000 (1983)", angle: "8-bit" },
      { q: "Who is the main villain in Mega Man?", a: "Dr. Wily", angle: "platformers" },
      { q: "What arcade game features a frog crossing traffic?", a: "Frogger", angle: "arcades" }
    ],
    hard: [
      { q: "What was the Game Boy's screen resolution?", a: "160 × 144 pixels", angle: "8-bit" },
      { q: "What year did the arcade game Pong release?", a: "1972", angle: "arcades" },
      { q: "What is the highest score possible in Pac-Man?", a: "3,333,360 points", angle: "arcades" },
      { q: "Who created Pac-Man?", a: "Toru Iwatani", angle: "arcades" },
      { q: "What was the first game with a cheat code?", a: "Gradius (Konami Code, 1986)", angle: "cheat codes" },
      { q: "What does 'IDDQD' do in Doom?", a: "God mode / invincibility", angle: "cheat codes" },
      { q: "What was Mario's original name?", a: "Jumpman", angle: "platformers" },
      { q: "How many copies did E.T. for Atari sell?", a: "About 1.5 million (but 4 million were made)", angle: "8-bit" },
      { q: "What is the fastest speedrun time for Super Mario Bros.?", a: "Under 5 minutes (world record constantly improving)", angle: "platformers" },
      { q: "What arcade game had a secret 'kill screen' at level 256?", a: "Pac-Man", angle: "arcades" }
    ]
  },
  "dc-comics": {
    easy: [
      { q: "What is Batman's real name?", a: "Bruce Wayne", angle: "Gotham" },
      { q: "What city does Batman protect?", a: "Gotham City", angle: "Gotham" },
      { q: "What is Superman's weakness?", a: "Kryptonite", angle: "metropolis" },
      { q: "What is Wonder Woman's weapon?", a: "Lasso of Truth", angle: "Justice League" },
      { q: "Who is the Flash?", a: "Barry Allen (most common)", angle: "Justice League" },
      { q: "What is Superman's symbol?", a: "S (House of El symbol)", angle: "metropolis" },
      { q: "Who is Batman's sidekick?", a: "Robin", angle: "Gotham" },
      { q: "What is the Joker's real name?", a: "Unknown / Multiple origins", angle: "rogues gallery" },
      { q: "Where is Superman from?", a: "Planet Krypton", angle: "metropolis" },
      { q: "What does Aquaman control?", a: "Sea creatures / The ocean", angle: "Justice League" },
      { q: "Who is Batman's greatest enemy?", a: "The Joker", angle: "rogues gallery" },
      { q: "What is Superman's civilian name?", a: "Clark Kent", angle: "metropolis" },
      { q: "What team does Batman belong to?", a: "Justice League", angle: "Justice League" },
      { q: "What is the color of Superman's cape?", a: "Red", angle: "metropolis" },
      { q: "Who wears the power ring?", a: "Green Lantern", angle: "Justice League" },
      { q: "What animal is Batman's symbol?", a: "Bat", angle: "Gotham" },
      { q: "Who is Superman's girlfriend?", a: "Lois Lane", angle: "metropolis" },
      { q: "What is Batman's cave headquarters called?", a: "Batcave", angle: "Gotham" },
      { q: "Who can run super fast?", a: "The Flash", angle: "Justice League" },
      { q: "What gender is Wonder Woman?", a: "Female/Woman", angle: "Justice League" }
    ],
    medium: [
      { q: "What is Batman's butler's name?", a: "Alfred Pennyworth", angle: "Gotham" },
      { q: "What is the Flash's superpower?", a: "Super speed", angle: "Justice League" },
      { q: "Who is Superman's arch-nemesis?", a: "Lex Luthor", angle: "rogues gallery" },
      { q: "What is Wonder Woman's home?", a: "Themyscira / Paradise Island", angle: "Justice League" },
      { q: "Who created Batman?", a: "Bob Kane and Bill Finger", angle: "Gotham" },
      { q: "What is Green Lantern's power source?", a: "Power ring fueled by willpower", angle: "Justice League" },
      { q: "Who is Harley Quinn's boyfriend?", a: "The Joker", angle: "rogues gallery" },
      { q: "What is Batman's vehicle called?", a: "Batmobile", angle: "Gotham" },
      { q: "Who paralyzed Barbara Gordon?", a: "The Joker", angle: "rogues gallery" },
      { q: "What year did Superman first appear?", a: "1938", angle: "metropolis" },
      { q: "Who is the Penguin?", a: "Batman villain (Oswald Cobblepot)", angle: "rogues gallery" },
      { q: "What is Aquaman's real name?", a: "Arthur Curry", angle: "Justice League" },
      { q: "Who is Catwoman?", a: "Selina Kyle (Batman's frenemy)", angle: "Gotham" },
      { q: "What is the Green Lantern oath first line?", a: "In brightest day, in blackest night", angle: "Justice League" },
      { q: "Who is Batman's son?", a: "Damian Wayne", angle: "Gotham" },
      { q: "What is Superman's home city?", a: "Metropolis", angle: "metropolis" },
      { q: "Who is the Riddler?", a: "Edward Nygma (Batman villain)", angle: "rogues gallery" },
      { q: "What is Wonder Woman's tiara made of?", a: "Indestructible metal", angle: "Justice League" },
      { q: "Who is Batman's first Robin?", a: "Dick Grayson", angle: "Gotham" },
      { q: "What is the Flash's real job?", a: "Forensic scientist", angle: "Justice League" }
    ],
    hard: [
      { q: "What is the real name of the current Robin?", a: "Damian Wayne (varies by era)", angle: "Gotham" },
      { q: "What is the Speed Force?", a: "Energy field that gives speedsters their powers", angle: "Justice League" },
      { q: "Who is the villain in 'The Killing Joke'?", a: "The Joker", angle: "rogues gallery" },
      { q: "What is Superman's Kryptonian name?", a: "Kal-El", angle: "metropolis" },
      { q: "Who is the first Green Lantern?", a: "Alan Scott (Golden Age)", angle: "Justice League" },
      { q: "What is Batman's contingency plan for the Justice League?", a: "Tower of Babel protocols", angle: "Justice League" },
      { q: "Who is the main villain in 'Crisis on Infinite Earths'?", a: "Anti-Monitor", angle: "rogues gallery" },
      { q: "What is Wonder Woman's secret identity?", a: "Diana Prince", angle: "Justice League" },
      { q: "Who killed Jason Todd (second Robin)?", a: "The Joker", angle: "Gotham" },
      { q: "What is the Phantom Zone?", a: "Kryptonian prison dimension", angle: "metropolis" },
      { q: "What is the Court of Owls?", a: "Secret society controlling Gotham", angle: "Gotham" },
      { q: "Who becomes the second Flash?", a: "Barry Allen (after Jay Garrick)", angle: "Justice League" },
      { q: "What is Darkseid searching for?", a: "The Anti-Life Equation", angle: "rogues gallery" },
      { q: "Who is the Black Adam?", a: "Shazam's nemesis (Teth-Adam)", angle: "rogues gallery" },
      { q: "What is Batman's IQ?", a: "192 (genius level)", angle: "Gotham" },
      { q: "Who voices Batman in the animated series?", a: "Kevin Conroy", angle: "Gotham" },
      { q: "What is the Mobius Chair?", a: "All-knowing chair from New Gods", angle: "Justice League" },
      { q: "Who is Oracle?", a: "Barbara Gordon after being paralyzed", angle: "Gotham" },
      { q: "What is Superman's Fortress of Solitude location?", a: "Arctic/North Pole", angle: "metropolis" },
      { q: "Who created Wonder Woman (in real life)?", a: "William Moulton Marston", angle: "Justice League" }
    ]
  },
  "90s-cartoons": {
    easy: [
      { q: "What does Scooby-Doo always want?", a: "Scooby Snacks", angle: "theme songs" },
      { q: "What are the Teenage Mutant Ninja Turtles named after?", a: "Renaissance artists", angle: "retro heroes" },
      { q: "What color is the PowerPuff Girls' logo?", a: "Pink (with blue and green)", angle: "toy tie-ins" },
      { q: "What does Dexter have in his basement?", a: "A secret laboratory", angle: "morning shows" },
      { q: "Who lives in a pineapple under the sea?", a: "SpongeBob SquarePants", angle: "theme songs" },
      { q: "What are the Rugrats babies always doing?", a: "Going on adventures", angle: "morning shows" },
      { q: "What does Hey Arnold's head look like?", a: "Football-shaped", angle: "retro heroes" },
      { q: "Who says 'What's up, Doc?'", a: "Bugs Bunny", angle: "theme songs" },
      { q: "What is Pokémon short for?", a: "Pocket Monsters", angle: "toy tie-ins" },
      { q: "What are the three PowerPuff Girls named?", a: "Blossom, Bubbles, and Buttercup", angle: "retro heroes" }
    ],
    medium: [
      { q: "Who created The PowerPuff Girls?", a: "Craig McCracken", angle: "retro heroes" },
      { q: "What is the name of Johnny Bravo's neighbor?", a: "Carl and Little Suzy", angle: "morning shows" },
      { q: "What network aired most 90s Nickelodeon cartoons?", a: "Nickelodeon", angle: "morning shows" },
      { q: "What are the Animaniacs' names?", a: "Yakko, Wakko, and Dot", angle: "theme songs" },
      { q: "Who is Dexter's annoying sister?", a: "Dee Dee", angle: "morning shows" },
      { q: "What is the name of the villain in Captain Planet?", a: "Various eco-villains (Hoggish Greedly, etc.)", angle: "retro heroes" },
      { q: "What year did Pokémon first air in the US?", a: "1998", angle: "toy tie-ins" },
      { q: "Who voices Rocko in Rocko's Modern Life?", a: "Carlos Alazraqui", angle: "morning shows" },
      { q: "What is Courage the Cowardly Dog afraid of?", a: "Everything", angle: "theme songs" },
      { q: "What company produced most Cartoon Network originals?", a: "Cartoon Network Studios", angle: "retro heroes" }
    ],
    hard: [
      { q: "What year did Cartoon Network launch?", a: "1992", angle: "morning shows" },
      { q: "Who created Ren & Stimpy?", a: "John Kricfalusi", angle: "retro heroes" },
      { q: "What is the name of Ed, Edd n Eddy's cul-de-sac?", a: "Peach Creek", angle: "morning shows" },
      { q: "What were the original Ninja Turtles' weapons?", a: "Katanas, Bo staff, Sai, Nunchucks", angle: "toy tie-ins" },
      { q: "Who composed the X-Men animated series theme?", a: "Ron Wasserman", angle: "theme songs" },
      { q: "What is Professor Utonium's first name?", a: "Never officially revealed", angle: "retro heroes" },
      { q: "What year did Doug first air?", a: "1991", angle: "morning shows" },
      { q: "What is the name of Invader Zim's robot?", a: "GIR", angle: "retro heroes" },
      { q: "Who created Avatar: The Last Airbender?", a: "Michael Dante DiMartino and Bryan Konietzko", angle: "retro heroes" },
      { q: "What was the first Cartoon Network original series?", a: "The Moxy Show (1993)", angle: "morning shows" }
    ]
  },
  "basketball": {
    easy: [
      { q: "How many players are on a basketball team on the court?", a: "5 players", angle: "rule" },
      { q: "What is it called when you score in basketball?", a: "A basket / field goal", angle: "championship" },
      { q: "Who is considered the greatest basketball player?", a: "Michael Jordan (commonly)", angle: "legends" },
      { q: "How many points is a free throw worth?", a: "1 point", angle: "rule" },
      { q: "What does NBA stand for?", a: "National Basketball Association", angle: "dynasties" },
      { q: "How many quarters are in an NBA game?", a: "4 quarters", angle: "rule" },
      { q: "What team did Michael Jordan play for?", a: "Chicago Bulls (mostly)", angle: "dynasties" },
      { q: "What is a slam dunk?", a: "Jumping and forcefully putting ball through hoop", angle: "dunks" },
      { q: "What position did Shaquille O'Neal play?", a: "Center", angle: "point guards" },
      { q: "How many points is a shot from behind the arc?", a: "3 points", angle: "rule" }
    ],
    medium: [
      { q: "Who holds the record for most points in a single game?", a: "Wilt Chamberlain (100 points)", angle: "record" },
      { q: "What year was the NBA founded?", a: "1946", angle: "dynasties" },
      { q: "Which team has won the most championships?", a: "Boston Celtics (17 titles)", angle: "dynasties" },
      { q: "What is a triple-double?", a: "Double digits in three statistical categories", angle: "record" },
      { q: "Who is the NBA's all-time leading scorer?", a: "LeBron James (passed Kareem Abdul-Jabbar)", angle: "legends" },
      { q: "What does traveling mean?", a: "Moving without dribbling the ball", angle: "rule" },
      { q: "What position did Magic Johnson play?", a: "Point guard", angle: "point guards" },
      { q: "How long is an NBA shot clock?", a: "24 seconds", angle: "rule" },
      { q: "Who is known as 'The King'?", a: "LeBron James", angle: "legends" },
      { q: "What team is in Los Angeles with purple and gold?", a: "Los Angeles Lakers", angle: "dynasties" }
    ],
    hard: [
      { q: "Who has the most assists in NBA history?", a: "John Stockton", angle: "record" },
      { q: "What is the vertical distance from floor to rim?", a: "10 feet", angle: "rule" },
      { q: "Who won the first NBA championship?", a: "Philadelphia Warriors (1947)", angle: "dynasties" },
      { q: "What is the 'Shaq Rule'?", a: "Zone defense change allowing hand-checking", angle: "legends" },
      { q: "Who has the most career rebounds?", a: "Wilt Chamberlain", angle: "record" },
      { q: "What year did the 3-point line debut in NBA?", a: "1979-80 season", angle: "rule" },
      { q: "Who was the shortest player to win a dunk contest?", a: "Spud Webb (5'6\")", angle: "dunks" },
      { q: "What is a clear path foul?", a: "Defensive foul with no defender between offensive player and basket", angle: "rule" },
      { q: "Who scored 13 points in 35 seconds?", a: "Tracy McGrady", angle: "record" },
      { q: "What team had the best regular season record?", a: "2015-16 Golden State Warriors (73-9)", angle: "dynasties" }
    ]
  },
  "dinosaurs": {
    easy: [
      { q: "What is the most famous dinosaur?", a: "Tyrannosaurus Rex (T-Rex)", angle: "predators" },
      { q: "What does 'dinosaur' mean?", a: "Terrible lizard", angle: "fossils" },
      { q: "Were dinosaurs reptiles or mammals?", a: "Reptiles", angle: "eras" },
      { q: "What killed the dinosaurs?", a: "Asteroid impact (most likely)", angle: "eras" },
      { q: "What do we call dinosaur bones we find today?", a: "Fossils", angle: "fossils" },
      { q: "What did herbivore dinosaurs eat?", a: "Plants", angle: "herbivores" },
      { q: "What dinosaur had a long neck?", a: "Brachiosaurus / Diplodocus / Sauropods", angle: "herbivores" },
      { q: "Did humans and dinosaurs live together?", a: "No", angle: "eras" },
      { q: "What dinosaur had three horns?", a: "Triceratops", angle: "herbivores" },
      { q: "What does 'T-Rex' stand for?", a: "Tyrannosaurus Rex", angle: "predators" }
    ],
    medium: [
      { q: "What era did dinosaurs live in?", a: "Mesozoic Era", angle: "eras" },
      { q: "What are the three periods of the Mesozoic Era?", a: "Triassic, Jurassic, Cretaceous", angle: "eras" },
      { q: "What was the largest dinosaur?", a: "Argentinosaurus (possibly)", angle: "herbivores" },
      { q: "What dinosaur had the smallest brain?", a: "Stegosaurus (for its size)", angle: "herbivores" },
      { q: "Were pterodactyls dinosaurs?", a: "No, they were flying reptiles", angle: "eras" },
      { q: "What dinosaur name means 'swift thief'?", a: "Velociraptor", angle: "predators" },
      { q: "How many teeth did T-Rex have?", a: "About 50-60 teeth", angle: "predators" },
      { q: "What is paleontology?", a: "The study of fossils and prehistoric life", angle: "fossils" },
      { q: "What dinosaur had the longest tail?", a: "Diplodocus", angle: "herbivores" },
      { q: "What does the word 'fossil' mean?", a: "Dug up", angle: "fossils" }
    ],
    hard: [
      { q: "What year did dinosaurs go extinct?", a: "65 million years ago (end of Cretaceous)", angle: "eras" },
      { q: "Who named the first dinosaur?", a: "Richard Owen coined 'Dinosauria' (1842)", angle: "fossils" },
      { q: "What was the fastest dinosaur?", a: "Possibly ornithomimids (ostrich-like, 50 mph)", angle: "predators" },
      { q: "What is the smallest known dinosaur?", a: "Microraptor (crow-sized)", angle: "predators" },
      { q: "What dinosaur had the most teeth?", a: "Hadrosaurs (duck-bills, up to 1000)", angle: "herbivores" },
      { q: "What is the study of trace fossils called?", a: "Ichnology", angle: "fossils" },
      { q: "What dinosaur was discovered in 1824?", a: "Megalosaurus (first formally described)", angle: "fossils" },
      { q: "What is the Chicxulub crater?", a: "Impact site that killed dinosaurs (Mexico)", angle: "eras" },
      { q: "What does 'Allosaurus' mean?", a: "Different lizard / other lizard", angle: "predators" },
      { q: "What percent of dinosaurs were carnivores?", a: "About 35% were meat-eaters", angle: "predators" }
    ]
  },
  "space-exploration": {
    easy: [
      { q: "Who was the first person in space?", a: "Yuri Gagarin (1961)", angle: "astronauts" },
      { q: "Who was the first person on the moon?", a: "Neil Armstrong", angle: "astronauts" },
      { q: "What spacecraft took humans to the moon?", a: "Apollo (Apollo 11)", angle: "missions" },
      { q: "What is NASA?", a: "National Aeronautics and Space Administration", angle: "missions" },
      { q: "What planet have we sent rovers to?", a: "Mars", angle: "rovers" },
      { q: "What is the ISS?", a: "International Space Station", angle: "missions" },
      { q: "What year did humans first land on the moon?", a: "1969", angle: "missions" },
      { q: "What is the name of NASA's most famous telescope?", a: "Hubble Space Telescope", angle: "telescopes" },
      { q: "What country launched the first satellite?", a: "Soviet Union (Sputnik)", angle: "missions" },
      { q: "What do astronauts wear in space?", a: "Spacesuits", angle: "astronauts" }
    ],
    medium: [
      { q: "What was the first animal in space?", a: "Fruit flies (1947) / Laika the dog (orbit, 1957)", angle: "missions" },
      { q: "What is the name of Mars rover launched in 2020?", a: "Perseverance", angle: "rovers" },
      { q: "How long does it take to get to Mars?", a: "6-9 months", angle: "planets" },
      { q: "What was the Space Shuttle program?", a: "Reusable spacecraft program (1981-2011)", angle: "missions" },
      { q: "Who was the first American in space?", a: "Alan Shepard", angle: "astronauts" },
      { q: "What telescope replaced Hubble?", a: "James Webb Space Telescope", angle: "telescopes" },
      { q: "What is SpaceX?", a: "Private space exploration company", angle: "missions" },
      { q: "What planet has the Curiosity rover explored?", a: "Mars", angle: "rovers" },
      { q: "How many people have walked on the moon?", a: "12 people", angle: "astronauts" },
      { q: "What is Voyager 1?", a: "Farthest human-made object from Earth", angle: "missions" }
    ],
    hard: [
      { q: "What was the Challenger disaster?", a: "1986 Space Shuttle explosion", angle: "missions" },
      { q: "What is the Great Observatory program?", a: "Four space telescopes (Hubble, Compton, Chandra, Spitzer)", angle: "telescopes" },
      { q: "Who was the first woman in space?", a: "Valentina Tereshkova (1963)", angle: "astronauts" },
      { q: "What does EVA stand for?", a: "Extravehicular Activity (spacewalk)", angle: "astronauts" },
      { q: "What was Apollo 13's problem?", a: "Oxygen tank explosion", angle: "missions" },
      { q: "What is the Karman line?", a: "Boundary of space (100 km altitude)", angle: "missions" },
      { q: "What was the first Mars rover?", a: "Sojourner (1997)", angle: "rovers" },
      { q: "Who commanded the first moon landing?", a: "Neil Armstrong", angle: "astronauts" },
      { q: "What is the New Horizons mission?", a: "First spacecraft to visit Pluto", angle: "missions" },
      { q: "What year did Voyager 1 enter interstellar space?", a: "2012", angle: "missions" }
    ]
  },
  "ancient-egypt": {
    easy: [
      { q: "What are the large triangle structures called?", a: "Pyramids", angle: "pyramids" },
      { q: "What river runs through Egypt?", a: "Nile River", angle: "nile" },
      { q: "What is a pharaoh?", a: "An ancient Egyptian king", angle: "pharaohs" },
      { q: "What is a mummy?", a: "A preserved dead body", angle: "pharaohs" },
      { q: "What animal has a human head in Egyptian statues?", a: "Sphinx", angle: "pyramids" },
      { q: "What did Egyptians write on?", a: "Papyrus", angle: "nile" },
      { q: "What is the Egyptian sun god called?", a: "Ra", angle: "myths" },
      { q: "What is the Great Pyramid of Giza?", a: "Largest Egyptian pyramid", angle: "pyramids" },
      { q: "Who was the boy king of Egypt?", a: "Tutankhamun (King Tut)", angle: "pharaohs" },
      { q: "What animal was sacred to Egyptians?", a: "Cats (among others)", angle: "myths" }
    ],
    medium: [
      { q: "What are Egyptian picture writings called?", a: "Hieroglyphics", angle: "pharaohs" },
      { q: "Who was the last pharaoh of Egypt?", a: "Cleopatra VII", angle: "pharaohs" },
      { q: "What stone helped decode hieroglyphics?", a: "Rosetta Stone", angle: "pyramids" },
      { q: "What organs were removed during mummification?", a: "Liver, lungs, stomach, intestines (not heart)", angle: "pharaohs" },
      { q: "What is the Egyptian god of the dead called?", a: "Anubis", angle: "myths" },
      { q: "What are canopic jars?", a: "Jars for storing mummified organs", angle: "pharaohs" },
      { q: "What city was the ancient capital?", a: "Memphis / Thebes (different periods)", angle: "nile" },
      { q: "What is the afterlife judgment scene called?", a: "Weighing of the Heart", angle: "myths" },
      { q: "Who built the Great Pyramid?", a: "Pharaoh Khufu (Cheops)", angle: "pyramids" },
      { q: "What were Egyptian workers called?", a: "Peasants / farmers (not slaves for pyramids)", angle: "nile" }
    ],
    hard: [
      { q: "What year did Tutankhamun's tomb get discovered?", a: "1922 (by Howard Carter)", angle: "pharaohs" },
      { q: "What is the Egyptian Book of the Dead?", a: "Collection of funerary texts and spells", angle: "myths" },
      { q: "How long did it take to build the Great Pyramid?", a: "About 20 years", angle: "pyramids" },
      { q: "What dynasty was Cleopatra from?", a: "Ptolemaic Dynasty", angle: "pharaohs" },
      { q: "What is Ma'at?", a: "Egyptian concept of truth, balance, and order", angle: "myths" },
      { q: "What caused the Nile's annual floods?", a: "Ethiopian highlands monsoon rains", angle: "nile" },
      { q: "Who was the female pharaoh who dressed as male?", a: "Hatshepsut", angle: "pharaohs" },
      { q: "What is the Step Pyramid of Djoser?", a: "First pyramid built (oldest)", angle: "pyramids" },
      { q: "What animal represents the god Thoth?", a: "Ibis bird (or baboon)", angle: "myths" },
      { q: "What was the 'inundation' season?", a: "Annual Nile flooding season", angle: "nile" }
    ]
  },
  "ancient-greece": {
    easy: [
      { q: "What games did ancient Greece create?", a: "Olympic Games", angle: "olympics" },
      { q: "Who was the king of the Greek gods?", a: "Zeus", angle: "gods" },
      { q: "What city-state was known for warriors?", a: "Sparta", angle: "city-states" },
      { q: "What building is on the Acropolis?", a: "Parthenon", angle: "city-states" },
      { q: "Who was the goddess of wisdom?", a: "Athena", angle: "gods" },
      { q: "What is Greek mythology?", a: "Ancient Greek religious stories and legends", angle: "gods" },
      { q: "What is a city-state?", a: "Independent city with its own government", angle: "city-states" },
      { q: "Who was the god of the sea?", a: "Poseidon", angle: "gods" },
      { q: "What did ancient Greeks wear?", a: "Togas / Tunics", angle: "city-states" },
      { q: "Who was the Greek hero with great strength?", a: "Hercules (Heracles)", angle: "gods" }
    ],
    medium: [
      { q: "What was the Trojan War about?", a: "War between Greeks and Troy (Helen of Troy)", angle: "city-states" },
      { q: "Who wrote the Iliad and Odyssey?", a: "Homer", angle: "philosophers" },
      { q: "What was an agora?", a: "Public gathering place / marketplace", angle: "city-states" },
      { q: "Who was Socrates?", a: "Ancient Greek philosopher", angle: "philosophers" },
      { q: "What did the Oracle of Delphi do?", a: "Give prophecies and advice", angle: "gods" },
      { q: "What is democracy?", a: "Government by the people", angle: "city-states" },
      { q: "Who was Alexander the Great?", a: "Macedonian king who conquered much of known world", angle: "city-states" },
      { q: "What were Greek theaters shaped like?", a: "Semi-circles / amphitheaters", angle: "olympics" },
      { q: "Who taught Alexander the Great?", a: "Aristotle", angle: "philosophers" },
      { q: "What mountain did the gods live on?", a: "Mount Olympus", angle: "gods" }
    ],
    hard: [
      { q: "What year were the first Olympics?", a: "776 BC", angle: "olympics" },
      { q: "What was Plato's famous school?", a: "The Academy", angle: "philosophers" },
      { q: "What was the Peloponnesian War?", a: "War between Athens and Sparta (431-404 BC)", angle: "city-states" },
      { q: "What did Pythagoras study?", a: "Mathematics (Pythagorean theorem)", angle: "philosophers" },
      { q: "What was the Spartan military training called?", a: "Agoge", angle: "city-states" },
      { q: "Who was the goddess born from sea foam?", a: "Aphrodite", angle: "gods" },
      { q: "What is the Parthenon dedicated to?", a: "Athena (goddess)", angle: "city-states" },
      { q: "What was Greek fire?", a: "Ancient incendiary weapon", angle: "city-states" },
      { q: "Who wrote 'The Republic'?", a: "Plato", angle: "philosophers" },
      { q: "What was a hoplite?", a: "Greek citizen-soldier", angle: "city-states" }
    ]
  },
  "modern-games": {
    easy: [
      { q: "What game involves building with blocks?", a: "Minecraft", angle: "crafting" },
      { q: "What battle royale game has building?", a: "Fortnite", angle: "online squads" },
      { q: "What is Mario Kart?", a: "Racing game with Mario characters", angle: "boss fights" },
      { q: "What game has Creepers?", a: "Minecraft", angle: "crafting" },
      { q: "What company makes PlayStation?", a: "Sony", angle: "online squads" },
      { q: "What company makes Xbox?", a: "Microsoft", angle: "online squads" },
      { q: "What is Zelda's main character name?", a: "Link", angle: "open worlds" },
      { q: "What game series has Master Chief?", a: "Halo", angle: "boss fights" },
      { q: "What is the Pokemon game goal?", a: "Catch them all / Become Pokemon Master", angle: "crafting" },
      { q: "What game has Steve as default character?", a: "Minecraft", angle: "open worlds" }
    ],
    medium: [
      { q: "What year did Minecraft release?", a: "2011", angle: "crafting" },
      { q: "What is the Ender Dragon?", a: "Final boss in Minecraft", angle: "boss fights" },
      { q: "What game series features Kratos?", a: "God of War", angle: "boss fights" },
      { q: "What is the highest-selling game of all time?", a: "Minecraft (over 300 million)", angle: "crafting" },
      { q: "What company created Fortnite?", a: "Epic Games", angle: "online squads" },
      { q: "What is GTA short for?", a: "Grand Theft Auto", angle: "open worlds" },
      { q: "What game popularized battle royale genre?", a: "PlayerUnknown's Battlegrounds (PUBG)", angle: "online squads" },
      { q: "What is The Witcher 3's main character?", a: "Geralt of Rivia", angle: "open worlds" },
      { q: "What does NPC stand for?", a: "Non-Player Character", angle: "open worlds" },
      { q: "What game has the Covenant as enemies?", a: "Halo", angle: "boss fights" }
    ],
    hard: [
      { q: "What engine does Fortnite use?", a: "Unreal Engine", angle: "online squads" },
      { q: "What year did the Nintendo Switch release?", a: "2017", angle: "crafting" },
      { q: "What is Minecraft's original creator's name?", a: "Markus Persson (Notch)", angle: "crafting" },
      { q: "What is FromSoftware known for?", a: "Dark Souls / Elden Ring (hard games)", angle: "boss fights" },
      { q: "What was the first open-world game?", a: "Debated (Elite 1984 or earlier)", angle: "open worlds" },
      { q: "What does MMORPG stand for?", a: "Massively Multiplayer Online Role-Playing Game", angle: "online squads" },
      { q: "What game won most Game of the Year 2023?", a: "Baldur's Gate 3", angle: "open worlds" },
      { q: "What is speedrunning?", a: "Completing games as fast as possible", angle: "boss fights" },
      { q: "What was the first battle royale game?", a: "DayZ Battle Royale mod (2013)", angle: "online squads" },
      { q: "What does RNG mean in gaming?", a: "Random Number Generator", angle: "crafting" }
    ]
  },
  "music-legends": {
    easy: [
      { q: "Who is the 'King of Pop'?", a: "Michael Jackson", angle: "signature songs" },
      { q: "Who sang 'Purple Rain'?", a: "Prince", angle: "signature songs" },
      { q: "What band had John Lennon?", a: "The Beatles", angle: "iconic tours" },
      { q: "Who is known as 'The Queen of Soul'?", a: "Aretha Franklin", angle: "signature songs" },
      { q: "Who sang 'Like a Rolling Stone'?", a: "Bob Dylan", angle: "signature songs" },
      { q: "What instrument did Jimi Hendrix play?", a: "Guitar", angle: "guitar solos" },
      { q: "Who is the 'King of Rock and Roll'?", a: "Elvis Presley", angle: "chart toppers" },
      { q: "Who sang 'Imagine'?", a: "John Lennon", angle: "signature songs" },
      { q: "What band had Freddie Mercury?", a: "Queen", angle: "iconic tours" },
      { q: "Who sang 'Respect'?", a: "Aretha Franklin", angle: "signature songs" }
    ],
    medium: [
      { q: "What year did Michael Jackson release 'Thriller'?", a: "1982", angle: "chart toppers" },
      { q: "Who played guitar at Woodstock 1969?", a: "Jimi Hendrix (among others)", angle: "iconic tours" },
      { q: "What was Elvis Presley's first hit?", a: "Heartbreak Hotel (1956)", angle: "chart toppers" },
      { q: "Who wrote 'Bohemian Rhapsody'?", a: "Freddie Mercury", angle: "signature songs" },
      { q: "What is David Bowie's alter ego?", a: "Ziggy Stardust", angle: "iconic tours" },
      { q: "Who is 'The Boss' in music?", a: "Bruce Springsteen", angle: "signature songs" },
      { q: "What band did Paul McCartney form after Beatles?", a: "Wings", angle: "chart toppers" },
      { q: "Who sang 'What's Going On'?", a: "Marvin Gaye", angle: "signature songs" },
      { q: "What year did Elvis die?", a: "1977", angle: "chart toppers" },
      { q: "Who is known for the moonwalk?", a: "Michael Jackson", angle: "iconic tours" }
    ],
    hard: [
      { q: "What was The Beatles' first US number one?", a: "I Want to Hold Your Hand", angle: "chart toppers" },
      { q: "Who played the guitar solo in 'Beat It'?", a: "Eddie Van Halen", angle: "guitar solos" },
      { q: "What year was Woodstock festival?", a: "1969", angle: "iconic tours" },
      { q: "What was Prince's birth name?", a: "Prince Rogers Nelson", angle: "signature songs" },
      { q: "Who wrote 'Stairway to Heaven'?", a: "Jimmy Page and Robert Plant (Led Zeppelin)", angle: "signature songs" },
      { q: "What was the best-selling album of all time?", a: "Thriller by Michael Jackson", angle: "chart toppers" },
      { q: "Who performed at Live Aid for 20 minutes?", a: "Queen", angle: "iconic tours" },
      { q: "What was Bob Dylan's birth name?", a: "Robert Zimmerman", angle: "signature songs" },
      { q: "What year did Jimi Hendrix die?", a: "1970", angle: "guitar solos" },
      { q: "Who had the most Billboard Hot 100 hits?", a: "The Beatles (20 number-one hits)", angle: "chart toppers" }
    ]
  },
  "pop-hits": {
    easy: [
      { q: "Who sang 'Shake It Off'?", a: "Taylor Swift", angle: "choruses" },
      { q: "What does 'pop music' stand for?", a: "Popular music", angle: "radio moments" },
      { q: "Who sang 'Happy'?", a: "Pharrell Williams", angle: "hooks" },
      { q: "Who is known as the 'Princess of Pop'?", a: "Britney Spears", angle: "dance tracks" },
      { q: "Who sang 'Rolling in the Deep'?", a: "Adele", angle: "hooks" },
      { q: "What boy band had Harry Styles?", a: "One Direction", angle: "choruses" },
      { q: "Who sang 'Bad Guy'?", a: "Billie Eilish", angle: "hooks" },
      { q: "Who sang 'Uptown Funk'?", a: "Bruno Mars (featuring Mark Ronson)", angle: "dance tracks" },
      { q: "Who sang 'Blank Space'?", a: "Taylor Swift", angle: "radio moments" },
      { q: "What artist goes by 'The Weeknd'?", a: "Abel Tesfaye", angle: "hooks" }
    ],
    medium: [
      { q: "What year did 'Despacito' become a hit?", a: "2017", angle: "radio moments" },
      { q: "Who has the most Grammy wins?", a: "Beyoncé (32 wins as of 2023)", angle: "radio moments" },
      { q: "What was the first K-pop song to hit #1 in US?", a: "Dynamite by BTS", angle: "dance tracks" },
      { q: "Who sang 'Someone Like You'?", a: "Adele", angle: "hooks" },
      { q: "What is the most-streamed song on Spotify?", a: "Blinding Lights by The Weeknd (as of 2024)", angle: "radio moments" },
      { q: "Who sang 'Call Me Maybe'?", a: "Carly Rae Jepsen", angle: "choruses" },
      { q: "What was Katy Perry's first number-one hit?", a: "I Kissed a Girl (2008)", angle: "radio moments" },
      { q: "Who features on 'Perfect Duet'?", a: "Ed Sheeran and Beyoncé", angle: "hooks" },
      { q: "What year did Lady Gaga release 'Bad Romance'?", a: "2009", angle: "dance tracks" },
      { q: "Who sang 'Thinking Out Loud'?", a: "Ed Sheeran", angle: "choruses" }
    ],
    hard: [
      { q: "What song spent the most weeks at #1 on Billboard?", a: "Old Town Road by Lil Nas X (19 weeks)", angle: "radio moments" },
      { q: "Who wrote 'Baby One More Time'?", a: "Max Martin", angle: "hooks" },
      { q: "What was the first video on MTV?", a: "Video Killed the Radio Star", angle: "radio moments" },
      { q: "What year did Auto-Tune become popular?", a: "Late 1990s (popularized by Cher's 'Believe' 1998)", angle: "hooks" },
      { q: "Who has sold the most records ever?", a: "The Beatles (over 600 million)", angle: "radio moments" },
      { q: "What was Rihanna's first number-one single?", a: "SOS (2006)", angle: "dance tracks" },
      { q: "Who wrote 'Irreplaceable' for Beyoncé?", a: "Ne-Yo", angle: "hooks" },
      { q: "What is the best-selling single of all time?", a: "White Christmas by Bing Crosby", angle: "radio moments" },
      { q: "What year did MTV launch?", a: "1981", angle: "radio moments" },
      { q: "Who has the most Diamond certifications?", a: "The Beatles (6 albums)", angle: "radio moments" }
    ]
  }
};

// Answer examples with real facts for common angles
const answerExamples = {
  "lotr": {
    "author": [
      "J.R.R. Tolkien - philologist and professor",
      "The Hobbit (1937) came first",
      "LOTR published 1954-1955 in three volumes",
      "Created entire languages for Middle-earth"
    ],
    "Middle-earth": [
      "The Shire - peaceful hobbit homeland",
      "Rivendell - Elven refuge",
      "Mordor - Sauron's dark realm",
      "Gondor - kingdom of men",
      "Rohan - land of horse-lords"
    ],
    "fellowship": [
      "Frodo Baggins - ring bearer",
      "Gandalf - wizard guide",
      "Aragorn - ranger and heir",
      "Legolas - Elven archer",
      "Gimli - Dwarf warrior",
      "Sam, Merry, Pippin - hobbit companions",
      "Boromir - man of Gondor"
    ],
    "quest": [
      "Destroy the One Ring in Mount Doom",
      "Journey from Shire to Mordor",
      "Battle of Helm's Deep",
      "Siege of Minas Tirith",
      "Breaking of the Fellowship"
    ],
    "ring": [
      "One Ring to rule them all",
      "Forged by Sauron in Mount Doom",
      "19 Rings of Power total",
      "Three for Elves, Seven for Dwarves, Nine for Men",
      "Inscription appears in fire"
    ],
    "creature": [
      "Balrog - fire demon of ancient times",
      "Ents - tree shepherds",
      "Nazgûl - nine ringwraiths",
      "Shelob - giant spider",
      "Gollum - corrupted by the ring",
      "Eagles - great messengers"
    ],
    "magic system": [
      "Wizards sent from Valinor",
      "Five Istari (wizards) in Middle-earth",
      "Elven rings preserve realms",
      "Palantíri - seeing stones",
      "Light of Eärendil"
    ]
  },
  "star-wars": {
    "iconic scene": [
      "Death Star trench run (A New Hope)",
      "'I am your father' reveal (Empire Strikes Back)",
      "Binary sunset on Tatooine (A New Hope)",
      "Cantina band scene (A New Hope)",
      "Duel of the Fates lightsaber battle (The Phantom Menace)"
    ],
    "quote": [
      "May the Force be with you",
      "I have a bad feeling about this",
      "Do or do not, there is no try",
      "These aren't the droids you're looking for",
      "Help me, Obi-Wan Kenobi, you're my only hope"
    ],
    "sidekick": [
      "R2-D2 - astromech droid",
      "C-3PO - protocol droid",
      "Chewbacca - Wookiee co-pilot",
      "BB-8 - spherical droid",
      "Yoda - Jedi Master mentor"
    ],
    "director": [
      "George Lucas (Original Trilogy creator)",
      "Irvin Kershner (The Empire Strikes Back)",
      "J.J. Abrams (The Force Awakens)",
      "Rian Johnson (The Last Jedi)",
      "Dave Filoni (The Mandalorian)"
    ],
    "plot twist": [
      "Darth Vader is Luke's father",
      "Leia is Luke's twin sister",
      "Palpatine is the Sith Lord",
      "Kylo Ren is Han and Leia's son",
      "Rey is Palpatine's granddaughter"
    ],
    "soundtrack": [
      "Imperial March theme",
      "Main Title theme",
      "Duel of the Fates",
      "Cantina Band song",
      "Force Theme"
    ]
  },
  "marvel": {
    "Avengers": [
      "Iron Man - genius billionaire",
      "Captain America - super soldier",
      "Thor - God of Thunder",
      "Hulk - gamma-powered hero",
      "Black Widow - master spy",
      "Hawkeye - expert archer"
    ],
    "villain": [
      "Thanos - Mad Titan seeking Infinity Stones",
      "Loki - God of Mischief",
      "Ultron - rogue AI antagonist",
      "Hela - Goddess of Death",
      "Killmonger - Black Panther's rival"
    ],
    "origin story": [
      "Tony Stark creates Iron Man suit in a cave",
      "Steve Rogers receives super soldier serum",
      "Peter Parker bitten by radioactive spider",
      "Bruce Banner exposed to gamma radiation",
      "Black Panther inherits Wakandan throne"
    ],
    "multiverse": [
      "Doctor Strange guards the Time Stone",
      "Infinity Stones control aspects of reality",
      "TVA monitors the Sacred Timeline",
      "Spider-Verse connects multiple realities",
      "What If...? explores alternate timelines"
    ],
    "iconic scene": [
      "Avengers assemble circle shot (2012)",
      "I am Iron Man snap (Endgame)",
      "Captain America lifts Mjolnir (Endgame)",
      "Portals scene in Endgame",
      "Thanos snap (Infinity War)"
    ],
    "quote": [
      "I am Iron Man",
      "I can do this all day",
      "Avengers, assemble!",
      "I am Groot",
      "With great power comes great responsibility"
    ]
  },
  "harry-potter": {
    "Hogwarts": [
      "Gryffindor - house of the brave",
      "Slytherin - house of the ambitious",
      "Ravenclaw - house of the wise",
      "Hufflepuff - house of the loyal",
      "Great Hall - dining and ceremonies",
      "Forbidden Forest - dangerous magical creatures"
    ],
    "spell": [
      "Expelliarmus - disarming charm",
      "Expecto Patronum - produces a Patronus",
      "Lumos - creates light",
      "Wingardium Leviosa - levitation charm",
      "Avada Kedavra - killing curse"
    ],
    "house": [
      "Gryffindor (Harry's house)",
      "Slytherin (Malfoy's house)",
      "Ravenclaw (Luna's house)",
      "Hufflepuff (Cedric's house)"
    ],
    "houses": [
      "Gryffindor - house of the brave",
      "Slytherin - house of the ambitious",
      "Ravenclaw - house of the wise",
      "Hufflepuff - house of the loyal"
    ],
    "wand": [
      "Harry's wand - holly and phoenix feather",
      "Hermione's wand - vine wood and dragon heartstring",
      "Elder Wand - most powerful wand",
      "Ron's wand - ash and unicorn hair",
      "Voldemort's wand - yew and phoenix feather"
    ],
    "wands": [
      "Holly and phoenix feather (Harry)",
      "Vine wood and dragon heartstring (Hermione)",
      "Elder Wand - Deathly Hallow",
      "Blackthorn wand (Voldemort's backup)"
    ],
    "creature": [
      "Hedwig - Harry's snowy owl",
      "Fawkes - Dumbledore's phoenix",
      "Buckbeak - hippogriff",
      "Dobby - house-elf",
      "Nagini - Voldemort's snake",
      "Fluffy - three-headed dog"
    ],
    "magic system": [
      "Horcrux - object containing soul fragment",
      "Deathly Hallows - three magical objects",
      "Patronus - protective spirit guardian",
      "Unforgivable Curses - illegal dark magic",
      "Felix Felicis - liquid luck potion"
    ],
    "author": [
      "J.K. Rowling",
      "J.K. Rowling (Joanne Rowling)",
      "J.K. Rowling wrote all seven books",
      "J.K. Rowling, British author"
    ],
    "chapter": [
      "The Boy Who Lived (first chapter)",
      "The Forbidden Forest",
      "The Mirror of Erised",
      "The Deathly Hallows",
      "The Prince's Tale"
    ],
    "library": [
      "Hogwarts Library - Madam Pince",
      "Restricted Section - forbidden books",
      "Room of Requirement's hidden books",
      "Dumbledore's private collection"
    ],
    "prophecy": [
      "The Boy Who Lived prophecy",
      "Neither can live while the other survives",
      "Trelawney's prediction about Voldemort",
      "Half-Blood Prince identity revelation",
      "Snape's true allegiance reveal"
    ]
  },
  "music-legends": {
    "iconic tour": [
      "The Rolling Stones - Steel Wheels Tour (1989)",
      "U2 - Joshua Tree Tour",
      "Madonna - Blonde Ambition Tour",
      "Michael Jackson - Bad World Tour",
      "Pink Floyd - The Wall Tour"
    ],
    "chart topper": [
      "The Beatles - Hey Jude",
      "Elvis Presley - Hound Dog",
      "Michael Jackson - Thriller",
      "Whitney Houston - I Will Always Love You",
      "Queen - Bohemian Rhapsody"
    ],
    "signature song": [
      "Frank Sinatra - My Way",
      "Aretha Franklin - Respect",
      "Bob Dylan - Like a Rolling Stone",
      "David Bowie - Space Oddity",
      "Prince - Purple Rain"
    ],
    "guitar solo": [
      "Jimi Hendrix - Purple Haze solo",
      "Eric Clapton - Layla outro",
      "Eddie Van Halen - Eruption",
      "Carlos Santana - Black Magic Woman",
      "Stevie Ray Vaughan - Texas Flood"
    ],
    "classic album": [
      "Pink Floyd - Dark Side of the Moon (1973)",
      "The Beatles - Sgt. Pepper's (1967)",
      "Fleetwood Mac - Rumours (1977)",
      "Led Zeppelin IV (1971)",
      "Nirvana - Nevermind (1991)"
    ],
    "modern artist": [
      "Beyoncé - 32 Grammy awards",
      "Taylor Swift - record-breaking tours",
      "BTS - global K-pop phenomenon",
      "Bad Bunny - Latin music icon",
      "Adele - powerful ballads"
    ],
    "streaming hit": [
      "Drake - most-streamed artist",
      "Ed Sheeran - Shape of You record",
      "Billie Eilish - youngest Grammy sweep",
      "The Weeknd - Blinding Lights longevity",
      "Ariana Grande - thank u, next era"
    ]
  },
  "us-history": {
    "founding": [
      "George Washington - first president",
      "Thomas Jefferson - wrote Declaration",
      "Benjamin Franklin - inventor and diplomat",
      "John Adams - second president",
      "Alexander Hamilton - first Treasury Secretary"
    ],
    "revolution": [
      "American Revolution (1775-1783)",
      "Boston Tea Party (1773)",
      "Declaration of Independence (1776)",
      "Battle of Yorktown (1781)",
      "Continental Congress meetings"
    ],
    "amendment": [
      "1st Amendment - freedom of speech",
      "2nd Amendment - right to bear arms",
      "13th Amendment - abolished slavery",
      "19th Amendment - women's suffrage",
      "Bill of Rights - first 10 amendments"
    ],
    "milestone": [
      "Louisiana Purchase doubled U.S. size (1803)",
      "First moon landing (1969)",
      "Civil Rights Act (1964)",
      "Women's voting rights (1920)",
      "End of slavery (1865)"
    ],
    "conflict": [
      "Civil War (1861-1865)",
      "World War II (1941-1945)",
      "Vietnam War (1955-1975)",
      "Korean War (1950-1953)",
      "War of 1812"
    ]
  },
  "space-exploration": {
    "mission": [
      "Apollo 11 - first moon landing (1969)",
      "Voyager missions - outer solar system",
      "Mars rovers - exploring red planet",
      "Hubble Space Telescope launch (1990)",
      "International Space Station construction"
    ],
    "planet": [
      "Mars - red planet, potential for life",
      "Jupiter - largest planet, Great Red Spot",
      "Saturn - ringed gas giant",
      "Venus - hottest planet",
      "Mercury - closest to the Sun"
    ],
    "astronaut": [
      "Neil Armstrong - first on the moon",
      "Buzz Aldrin - second on the moon",
      "Sally Ride - first American woman in space",
      "Yuri Gagarin - first human in space",
      "John Glenn - first American to orbit Earth"
    ],
    "rover": [
      "Curiosity - studying Mars geology",
      "Perseverance - searching for ancient life",
      "Opportunity - operated 15 years on Mars",
      "Spirit - twin of Opportunity",
      "Sojourner - first Mars rover"
    ],
    "telescope": [
      "James Webb - infrared space observatory",
      "Hubble - visible light telescope",
      "Chandra - X-ray observatory",
      "Spitzer - infrared telescope",
      "Kepler - planet-hunting telescope"
    ],
    "moon": [
      "Europa - Jupiter's icy moon",
      "Titan - Saturn's largest moon",
      "Ganymede - largest moon in solar system",
      "Enceladus - Saturn moon with geysers",
      "Io - Jupiter's volcanic moon"
    ]
  },
  "soccer": {
    "World Cup": [
      "Brazil won 5 World Cups (most)",
      "2022 World Cup in Qatar",
      "Maradona's 'Hand of God' goal (1986)",
      "Germany 7-1 Brazil semifinal (2014)",
      "First World Cup in Uruguay (1930)"
    ],
    "club": [
      "Real Madrid - most Champions League titles",
      "FC Barcelona - Messi's club",
      "Manchester United - English powerhouse",
      "Bayern Munich - German giants",
      "AC Milan - Italian legends"
    ],
    "legend": [
      "Pelé - Brazilian icon, 3 World Cups",
      "Diego Maradona - Argentine genius",
      "Lionel Messi - 8 Ballon d'Or awards",
      "Cristiano Ronaldo - 5 Ballon d'Or awards",
      "Johan Cruyff - Total Football pioneer"
    ],
    "position": [
      "Goalkeeper - last line of defense",
      "Striker - main goal scorer",
      "Midfielder - controls the game",
      "Defender - protects the goal",
      "Winger - attacks from sides"
    ],
    "record": [
      "Messi - most Ballon d'Or awards",
      "Cristiano Ronaldo - most international goals",
      "Real Madrid - 14 Champions League titles",
      "Josef Bican - 805 career goals",
      "Lev Yashin - only goalkeeper to win Ballon d'Or"
    ],
    "rule": [
      "Offside rule prevents goal hanging",
      "Yellow card - caution warning",
      "Red card - ejection from game",
      "Penalty kick - 12 yards from goal",
      "90 minutes plus stoppage time"
    ]
  },
  "disney-classics": {
    "animation": [
      "Snow White - first feature film (1937)",
      "The Lion King - Circle of Life",
      "Frozen - Let It Go phenomenon",
      "Beauty and the Beast - tale as old as time",
      "Aladdin - magic carpet rides"
    ],
    "song": [
      "A Whole New World (Aladdin)",
      "Let It Go (Frozen)",
      "Circle of Life (The Lion King)",
      "Under the Sea (The Little Mermaid)",
      "Be Our Guest (Beauty and the Beast)"
    ],
    "sidekick": [
      "Genie - Aladdin's wish granter",
      "Olaf - Frozen's snowman",
      "Timon and Pumbaa - Lion King duo",
      "Sebastian - Little Mermaid's crab",
      "Lumiere - Beauty's candlestick"
    ],
    "castle": [
      "Cinderella Castle at Magic Kingdom",
      "Sleeping Beauty Castle at Disneyland",
      "Beast's enchanted castle",
      "Elsa's ice palace",
      "Prince Eric's seaside castle"
    ],
    "villain": [
      "Maleficent - Sleeping Beauty's dark fairy",
      "Ursula - Little Mermaid's sea witch",
      "Scar - Lion King's treacherous uncle",
      "Jafar - Aladdin's power-hungry vizier",
      "Cruella de Vil - 101 Dalmatians villain"
    ],
    "quote": [
      "Let it go, let it go! (Frozen)",
      "Hakuna Matata - no worries (Lion King)",
      "To infinity and beyond! (Toy Story)",
      "Just keep swimming (Finding Nemo)",
      "The past can hurt, but you can run from it or learn from it (Lion King)"
    ]
  },
  "modern-games": {
    "crafting": [
      "Minecraft - building with blocks",
      "Terraria - 2D mining and crafting",
      "Valheim - Viking survival crafting",
      "Stardew Valley - farm crafting",
      "Subnautica - underwater crafting"
    ],
    "online squad": [
      "Fortnite - battle royale squads",
      "Apex Legends - 3-player teams",
      "Overwatch - 6v6 team battles",
      "Valorant - tactical 5v5",
      "Call of Duty - multiplayer teams"
    ],
    "open world": [
      "Zelda: Breath of the Wild - Hyrule",
      "Elden Ring - FromSoftware's masterpiece",
      "Red Dead Redemption 2 - Wild West",
      "The Witcher 3 - monster hunting",
      "GTA V - Los Santos city"
    ],
    "boss fight": [
      "Elden Ring - Malenia, Blade of Miquella",
      "Dark Souls - Ornstein and Smough",
      "Sekiro - Isshin, the Sword Saint",
      "God of War - Baldur fights",
      "Hollow Knight - Radiance battle"
    ],
    "indie game": [
      "Hades - roguelike dungeon crawler",
      "Celeste - precision platformer",
      "Stardew Valley - farming simulator",
      "Hollow Knight - metroidvania masterpiece",
      "Among Us - social deduction game"
    ],
    "game theme": [
      "Undertale - Megalovania boss theme",
      "The Legend of Zelda - main theme",
      "Halo - iconic choir theme",
      "Super Mario Bros - overworld theme",
      "Skyrim - Dragonborn theme"
    ]
  },
  "world-history": {
    "ancient empire": [
      "Roman Empire - lasted 1000+ years",
      "Egyptian pharaohs - built pyramids",
      "Mongol Empire - largest contiguous empire",
      "Ottoman Empire - controlled Mediterranean",
      "Persian Empire - ancient superpower"
    ],
    "trade route": [
      "Silk Road - connected East and West",
      "Spice Route - valuable commodity trade",
      "Trans-Saharan - African gold trade",
      "Amber Road - prehistoric trade path",
      "Incense Route - Arabian Peninsula"
    ],
    "conflict": [
      "World War I (1914-1918)",
      "World War II (1939-1945)",
      "Napoleonic Wars (1803-1815)",
      "Hundred Years' War (1337-1453)",
      "Crusades - religious wars"
    ],
    "peace accord": [
      "Treaty of Versailles (1919)",
      "Peace of Westphalia (1648)",
      "Congress of Vienna (1815)",
      "Camp David Accords (1978)",
      "Good Friday Agreement (1998)"
    ]
  }
};

function buildAngles(topic) {
  const base = categoryAngles[topic.category] || [];
  const general = ["origin", "favorite", "legend", "rival", "surprise", "underdog"];
  return [...new Set([...topic.tags, ...base, ...general])];
}

function fillTemplate(template, topicName, angle, index) {
  return template.replace("{topic}", topicName).replace("{angle}", angle).replace("{n}", index + 1);
}

function createQuestions(topic, difficulty, mode = "all") {
  const prompts = promptTemplates[difficulty];
  const answers = answerTemplates[difficulty];
  const allAngles = buildAngles(topic);
  const bank = [];

  // Get curated questions if available
  const curated = curatedQuestions[topic.id]?.[difficulty] || [];
  const examples = answerExamples[topic.id] || {};

  // If curated-only mode and no curated questions exist, return empty
  if (mode === "curated" && curated.length === 0) {
    return [];
  }

  // Add curated questions first
  curated.forEach((cq) => {
    bank.push({ prompt: cq.q, answer: cq.a, angle: cq.angle });
  });

  // If curated-only mode, return only curated questions
  if (mode === "curated") {
    return bank;
  }

  // For "all" mode, fill remaining slots with generated questions
  // Filter to only use angles that have real answer examples
  const anglesWithExamples = allAngles.filter(angle => examples[angle] && examples[angle].length > 0);

  // Use filtered angles if available, otherwise fall back to all angles
  const angles = anglesWithExamples.length > 0 ? anglesWithExamples : allAngles;

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

function buildQuestionBank(mode = "all") {
  const bank = {};
  topicList.forEach((topic) => {
    bank[topic.id] = {};
    difficulties.forEach((diff) => {
      bank[topic.id][diff] = createQuestions(topic, diff, mode);
    });
  });
  return bank;
}

let questionBank = buildQuestionBank("all");

let progress = {};
const state = {
  topicId: topicList[0].id,
  difficulty: "easy",
  questionMode: "all", // "all" or "curated"
  score: 0,
  streak: 0,
  asked: 0,
  revealed: false
};

// LocalStorage helpers
function saveLastTopic(topicId) {
  try {
    localStorage.setItem("lastTopicId", topicId);
  } catch (e) {
    // Ignore localStorage errors
  }
}

function loadLastTopic() {
  try {
    return localStorage.getItem("lastTopicId");
  } catch (e) {
    return null;
  }
}

function clearLastTopic() {
  try {
    localStorage.removeItem("lastTopicId");
  } catch (e) {
    // Ignore localStorage errors
  }
}

function saveProgress() {
  try {
    localStorage.setItem("questionProgress", JSON.stringify(progress));
  } catch (e) {
    // Ignore localStorage errors
  }
}

function loadProgress() {
  try {
    const saved = localStorage.getItem("questionProgress");
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
}

function clearProgress() {
  try {
    localStorage.removeItem("questionProgress");
  } catch (e) {
    // Ignore localStorage errors
  }
}

function saveQuestionMode(mode) {
  try {
    localStorage.setItem("questionMode", mode);
  } catch (e) {
    // Ignore localStorage errors
  }
}

function loadQuestionMode() {
  try {
    return localStorage.getItem("questionMode") || "all";
  } catch (e) {
    return "all";
  }
}

function saveDifficulty(difficulty) {
  try {
    localStorage.setItem("difficulty", difficulty);
  } catch (e) {
    // Ignore localStorage errors
  }
}

function loadDifficulty() {
  try {
    return localStorage.getItem("difficulty") || "easy";
  } catch (e) {
    return "easy";
  }
}

function saveScoreboard() {
  try {
    localStorage.setItem("scoreboard", JSON.stringify({
      score: state.score,
      streak: state.streak,
      asked: state.asked
    }));
  } catch (e) {
    // Ignore localStorage errors
  }
}

function loadScoreboard() {
  try {
    const saved = localStorage.getItem("scoreboard");
    if (saved) {
      const data = JSON.parse(saved);
      state.score = data.score || 0;
      state.streak = data.streak || 0;
      state.asked = data.asked || 0;
    }
  } catch (e) {
    // Ignore localStorage errors
  }
}

function shuffleIndices(length, seedBase = 1) {
  if (length === 0) return [];
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
    const bank = questionBank[topicId]?.[difficulty] || [];
    const bankSize = bank.length;
    if (bankSize === 0) {
      return { order: [], cursor: 0 };
    }
    const seed = Math.floor(Math.random() * 2147483647);
    progress[topicId][difficulty] = { order: shuffleIndices(bankSize, seed), cursor: 0 };
    saveProgress();
  }
  return progress[topicId][difficulty];
}


function updateDifficultyButtons() {
  document.querySelectorAll(".difficulty").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.difficulty === state.difficulty);
  });
}

function updateQuestionModeButtons() {
  document.querySelectorAll(".question-mode").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === state.questionMode);
  });
}

function rebuildQuestionBank() {
  questionBank = buildQuestionBank(state.questionMode);
  // Clear progress when switching modes
  progress = {};
  saveProgress();
}

function updateScoreboard() {
  document.getElementById("scoreValue").textContent = state.score;
  document.getElementById("streakValue").textContent = state.streak;
  document.getElementById("askedValue").textContent = state.asked;
  saveScoreboard();
}

function renderCard(question) {
  const topic = topicList.find((t) => t.id === state.topicId);
  const cardEl = document.querySelector(".card");
  const nextEl = document.querySelector(".next");

  // Remove end-state class and show next button for regular questions
  cardEl.classList.remove("card-complete");
  nextEl.style.display = "flex";

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

  // Check if topic has no questions in current mode
  if (!bank || bank.length === 0) {
    const cardEl = document.querySelector(".card");
    const nextEl = document.querySelector(".next");
    const answerEl = document.getElementById("cardAnswer");
    cardEl.classList.add("card-complete");
    nextEl.style.display = "none";
    answerEl.classList.remove("visible");

    document.getElementById("cardTitle").textContent = "No curated questions available!";
    document.getElementById("cardBody").textContent = "This topic doesn't have curated questions yet. Switch to 'All questions' mode.";
    return;
  }

  if (prog.cursor >= bank.length) {
    const cardEl = document.querySelector(".card");
    const nextEl = document.querySelector(".next");
    const answerEl = document.getElementById("cardAnswer");
    cardEl.classList.add("card-complete");
    nextEl.style.display = "none";
    answerEl.classList.remove("visible");

    document.getElementById("cardTitle").textContent = "All questions used up!";
    document.getElementById("cardBody").textContent = "Reset progress or switch difficulty to keep rolling.";
    return;
  }

  const idx = prog.order[prog.cursor];
  prog.cursor += 1;
  state.asked += 1;
  state.revealed = false;
  saveProgress();
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
      const seed = Math.floor(Math.random() * 2147483647);
      progress[topicId][diff] = { order: shuffleIndices(80, seed), cursor: 0 };
    });
  });
  state.score = 0;
  state.streak = 0;
  state.asked = 0;
  saveProgress();
  updateScoreboard();
  nextQuestion();
}

function populateTopicPicker() {
  const container = document.getElementById("topicPickerContent");
  const categories = [...new Set(topicList.map((t) => t.category))].sort();

  container.innerHTML = categories.map((category) => {
    const categoryTopics = topicList.filter((t) => t.category === category);
    return `
      <div class="topic-category" data-category="${category}">
        <div class="topic-category-header">
          <h3>${category}</h3>
          <span class="topic-category-count">${categoryTopics.length}</span>
        </div>
        <div class="topic-grid">
          ${categoryTopics.map((topic) => `
            <div class="topic-card" data-topic-id="${topic.id}" data-topic-name="${topic.name.toLowerCase()}">
              <div class="topic-card-name">${topic.name}</div>
              <div class="topic-card-tags">
                ${topic.tags.slice(0, 3).map((tag) => `<span class="topic-tag">${tag}</span>`).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");

  // Add click handlers to topic cards
  container.querySelectorAll(".topic-card").forEach((card) => {
    card.addEventListener("click", () => {
      const topicId = card.dataset.topicId;
      selectTopicAndStart(topicId);
    });
  });
}

function selectTopicAndStart(topicId) {
  state.topicId = topicId;
  state.streak = 0;
  updateScoreboard();
  saveLastTopic(topicId);
  hideTopicPicker();
  nextQuestion();
}

function showTopicPicker() {
  document.getElementById("topicPicker").classList.remove("hidden");
}

function hideTopicPicker() {
  document.getElementById("topicPicker").classList.add("hidden");
}

function handleTopicSearch(searchTerm) {
  const term = searchTerm.toLowerCase();
  const allCards = document.querySelectorAll(".topic-card");
  const allCategories = document.querySelectorAll(".topic-category");

  allCards.forEach((card) => {
    const topicName = card.dataset.topicName;
    const matches = topicName.includes(term);
    card.classList.toggle("hidden", !matches);
  });

  // Hide categories with no visible topics
  allCategories.forEach((category) => {
    const visibleCards = category.querySelectorAll(".topic-card:not(.hidden)");
    category.style.display = visibleCards.length > 0 ? "block" : "none";
  });
}

function bindEvents() {
  document.querySelectorAll(".difficulty").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.difficulty = btn.dataset.difficulty;
      state.streak = 0;
      saveDifficulty(state.difficulty);
      updateDifficultyButtons();
      updateScoreboard();
      nextQuestion();
    });
  });

  document.querySelectorAll(".question-mode").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.questionMode = btn.dataset.mode;
      state.streak = 0;
      saveQuestionMode(state.questionMode);
      updateQuestionModeButtons();
      rebuildQuestionBank();
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
    state.streak = 0;
    saveLastTopic(random.id);
    updateScoreboard();
    nextQuestion();
  });
  document.getElementById("resetProgress").addEventListener("click", resetProgress);

  // Topic picker events
  document.getElementById("chooseTopic").addEventListener("click", showTopicPicker);
  document.getElementById("closePicker").addEventListener("click", hideTopicPicker);
  document.getElementById("topicSearch").addEventListener("input", (e) => {
    handleTopicSearch(e.target.value);
  });
}

function init() {
  // Load saved preferences from localStorage
  progress = loadProgress();
  state.questionMode = loadQuestionMode();
  state.difficulty = loadDifficulty();
  loadScoreboard();

  // Rebuild question bank with saved mode
  questionBank = buildQuestionBank(state.questionMode);

  updateDifficultyButtons();
  updateQuestionModeButtons();
  updateScoreboard();
  populateTopicPicker();
  bindEvents();

  // Show the UI now that preferences are loaded
  document.querySelector(".controls").style.opacity = "1";
  document.querySelector(".board").style.opacity = "1";

  // Check if there's a saved topic from last session
  const lastTopic = loadLastTopic();
  if (lastTopic && topicList.find((t) => t.id === lastTopic)) {
    // Resume with saved topic
    state.topicId = lastTopic;
    nextQuestion();
  } else {
    // First visit or invalid saved topic - show picker
    showTopicPicker();
  }
}

document.addEventListener("DOMContentLoaded", init);
