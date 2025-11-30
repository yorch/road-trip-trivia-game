
var difficulties = ["easy", "medium", "hard"];

var topicList = [
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

var categoryAngles = {
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

var promptTemplates = {
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

var answerTemplates = {
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
// Curated questions are loaded from curated-questions.js (declared as var there)

// Answer examples with real facts for common angles
var answerExamples = {
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
