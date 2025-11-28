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
      { q: "Who trained Luke Skywalker?", a: "Obi-Wan Kenobi and Yoda", angle: "character" }
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
      { q: "What year was Star Wars: A New Hope released?", a: "1977", angle: "soundtrack" }
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
      { q: "Who said 'I am your father' (the actual line)?", a: "Actually: 'No, I am your father'", angle: "quote" }
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
      { q: "Who is Tony Stark's AI assistant?", a: "JARVIS (later Vision)", angle: "origin story" }
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
      { q: "Who is the leader of S.H.I.E.L.D.?", a: "Nick Fury", angle: "Avengers" }
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
      { q: "Who is the voice of Groot?", a: "Vin Diesel", angle: "Avengers" }
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
      { q: "Who is the headmaster of Hogwarts (most of the series)?", a: "Albus Dumbledore", angle: "Hogwarts" }
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
      { q: "Who is the Half-Blood Prince?", a: "Severus Snape", angle: "prophecy" }
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
      { q: "What year was the first Harry Potter book published?", a: "1997", angle: "author" }
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
  }
};

// Answer examples with real facts for common angles
const answerExamples = {
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
    "wand": [
      "Harry's wand - holly and phoenix feather",
      "Hermione's wand - vine wood and dragon heartstring",
      "Elder Wand - most powerful wand",
      "Ron's wand - ash and unicorn hair",
      "Voldemort's wand - yew and phoenix feather"
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
      "J.K. Rowling wrote all 7 books",
      "First book: Philosopher's Stone (1997)",
      "Screenplays expanded the wizarding world",
      "Pottermore/Wizarding World digital platform"
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

function createQuestions(topic, difficulty) {
  const prompts = promptTemplates[difficulty];
  const answers = answerTemplates[difficulty];
  const allAngles = buildAngles(topic);
  const bank = [];

  // Get curated questions if available
  const curated = curatedQuestions[topic.id]?.[difficulty] || [];
  const examples = answerExamples[topic.id] || {};

  // Filter to only use angles that have real answer examples
  const anglesWithExamples = allAngles.filter(angle => examples[angle] && examples[angle].length > 0);

  // Use filtered angles if available, otherwise fall back to all angles
  const angles = anglesWithExamples.length > 0 ? anglesWithExamples : allAngles;

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
  updateDifficultyButtons();
  updateScoreboard();
  populateTopicPicker();
  bindEvents();

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
