# Road Trip Trivia - Question Content Improvements

**Document Version**: 1.0
**Date**: 2025-11-28
**Status**: Planning Phase

---

## Executive Summary

The current question generation system uses only **6 templates per difficulty** to generate **80 questions**, resulting in high repetition and generic answers. This document outlines a phased approach to improve question quality, variety, and educational value.

### Current Issues

- ❌ Template repetition (same template used 13+ times)
- ❌ Generic answers that don't provide actual information
- ❌ Conversation prompts instead of trivia questions
- ❌ No factual verification or source references

### Goals

- ✅ Increase template variety to reduce repetition
- ✅ Provide actual factual answers
- ✅ Create verifiable trivia questions
- ✅ Maintain casual, road-trip-friendly tone

---

## Implementation Phases

## Phase 1: Foundation Improvements

**Estimated Time**: 1-2 hours
**Priority**: HIGH
**Impact**: Immediate quality boost

### Task 1.1: Expand Template Variety

- [x] Create 20 easy templates (currently 6) ✅ **COMPLETED 2025-11-28**
- [x] Create 15 medium templates (currently 5) ✅ **COMPLETED 2025-11-28**
- [x] Create 15 hard templates (currently 5) ✅ **COMPLETED 2025-11-28**
- [ ] Test templates with multiple topics
- [ ] Verify no grammatical issues with angle substitution

#### Easy Templates (20 total)

```javascript
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
  ]
};
```

#### Medium Templates (15 total)

```javascript
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
]
```

#### Hard Templates (15 total)

```javascript
hard: [
  // Deep knowledge (8)
  "Which lesser-known {angle} influenced {topic}?",
  "What {angle} was modified during production of {topic}?",
  "Name the {angle} that created controversy in {topic}?",
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
```

**Acceptance Criteria**:

- 80 questions should use each template max 4 times (down from 13+)
- No grammatical awkwardness when {angle} is substituted
- Templates feel natural when read aloud in a car

---

### Task 1.2: Create Curated Question Banks for Top Topics

- [x] Identify top 10 most popular topics ✅ **COMPLETED 2025-11-28**
- [x] Write 10 curated questions per difficulty for Star Wars (30 total) ✅ **COMPLETED 2025-11-28**
- [x] Include factual answers ✅ **COMPLETED 2025-11-28**
- [ ] Test questions for accuracy
- [ ] Add curated questions for remaining 9 topics

#### Top 10 Priority Topics

1. Star Wars
2. Marvel Universe
3. Harry Potter
4. Music Legends
5. US History
6. Space Exploration
7. Soccer
8. Disney Classics
9. Video Games Modern
10. World History

#### Curated Question Template

```javascript
const curatedQuestions = {
  "star-wars": {
    easy: [
      {
        q: "What weapon does a Jedi carry?",
        a: "Lightsaber",
        hint: "An elegant weapon for a more civilized age",
        source: "Star Wars: A New Hope (1977)"
      },
      {
        q: "Who is Luke Skywalker's father?",
        a: "Darth Vader (Anakin Skywalker)",
        hint: "Revealed in The Empire Strikes Back",
        source: "Star Wars: The Empire Strikes Back (1980)"
      },
      {
        q: "What is the name of Han Solo's ship?",
        a: "Millennium Falcon",
        hint: "The ship that made the Kessel Run",
        source: "Star Wars: A New Hope (1977)"
      },
      // ... 7 more easy questions
    ],
    medium: [
      {
        q: "Which planet is destroyed by the Death Star in A New Hope?",
        a: "Alderaan",
        hint: "Princess Leia's home planet",
        source: "Star Wars: A New Hope (1977)"
      },
      {
        q: "What species is Chewbacca?",
        a: "Wookiee",
        hint: "Tall, furry species from Kashyyyk",
        source: "Star Wars franchise"
      },
      // ... 8 more medium questions
    ],
    hard: [
      {
        q: "Who trained Qui-Gon Jinn?",
        a: "Count Dooku",
        hint: "Later became a Sith Lord",
        source: "Star Wars: Attack of the Clones (2002)"
      },
      {
        q: "What is the Sith Rule of Two?",
        a: "Only two Sith can exist at a time: a master and an apprentice",
        hint: "Created by Darth Bane",
        source: "Star Wars Expanded Universe"
      },
      // ... 8 more hard questions
    ]
  }
};
```

**Acceptance Criteria**:

- Each question has verifiable answer
- Source attribution included
- Hints available for medium/hard questions
- Questions span different aspects of the topic (characters, plot, production, etc.)

---

### Task 1.3: Add Answer Examples Database

- [x] Create answer examples for Star Wars ✅ **COMPLETED 2025-11-28**
- [x] Minimum 5 examples per angle type ✅ **COMPLETED 2025-11-28**
- [x] Ensure answers are factual and verifiable ✅ **COMPLETED 2025-11-28**
- [ ] Add answer examples for remaining 9 topics
- [ ] Add answer alternatives/variations

#### Answer Examples Structure

```javascript
const answerExamples = {
  "star-wars": {
    "iconic scenes": [
      "Death Star trench run (A New Hope)",
      "'I am your father' reveal (Empire Strikes Back)",
      "Binary sunset on Tatooine (A New Hope)",
      "Cantina band scene (A New Hope)",
      "Duel of the Fates (The Phantom Menace)"
    ],
    "quotes": [
      "May the Force be with you",
      "I have a bad feeling about this",
      "Do or do not, there is no try",
      "These aren't the droids you're looking for",
      "Help me, Obi-Wan Kenobi"
    ],
    "characters": [
      "Luke Skywalker - Jedi protagonist",
      "Darth Vader - Sith antagonist",
      "Princess Leia - Rebellion leader",
      "Han Solo - Smuggler turned hero",
      "Yoda - Jedi Grand Master"
    ],
    "directors": [
      "George Lucas (Original Trilogy)",
      "Irvin Kershner (Empire Strikes Back)",
      "J.J. Abrams (The Force Awakens)",
      "Rian Johnson (The Last Jedi)"
    ]
  },

  "marvel": {
    "Avengers": [
      "Iron Man (Tony Stark)",
      "Captain America (Steve Rogers)",
      "Thor",
      "Hulk (Bruce Banner)",
      "Black Widow (Natasha Romanoff)",
      "Hawkeye (Clint Barton)"
    ],
    "villains": [
      "Thanos - Mad Titan",
      "Loki - God of Mischief",
      "Ultron - AI antagonist",
      "Hela - Goddess of Death",
      "Killmonger - Black Panther antagonist"
    ]
  }

  // ... more topics
};
```

**Acceptance Criteria**:

- Minimum 5 answer examples per common angle
- Answers include context in parentheses where helpful
- No duplicates across angles
- Answers are current as of 2025

---

## Phase 2: Quality Enhancements

**Estimated Time**: 3-5 hours
**Priority**: MEDIUM
**Impact**: Significant UX improvement

### Task 2.1: Implement Angle-Specific Templates

- [ ] Map angles to appropriate question structures
- [ ] Create specialized templates for quotes, dates, characters, etc.
- [ ] Test cross-compatibility with all topics
- [ ] Ensure grammatical correctness

#### Angle-Specific Template Mapping

```javascript
const angleTemplates = {
  // For quotes angle
  "quotes": {
    easy: [
      "What's a famous quote from {topic}?",
      "Complete this {topic} quote: '{partial}'...",
      "Who said '{quote}' in {topic}?"
    ],
    medium: [
      "Which character says '{quote}' in {topic}?",
      "What's the context of the quote '{quote}' in {topic}?",
      "Match this quote to the {topic} movie: '{quote}'"
    ],
    hard: [
      "This misquoted line from {topic} actually says: what?",
      "Which {topic} quote was improvised by the actor?",
      "What's the full version of this famous {topic} quote?"
    ]
  },

  // For dates/years
  "dates": {
    easy: [
      "What decade was {topic} created?",
      "When did {topic} first release?"
    ],
    medium: [
      "What year did {specific_event} happen in {topic}?",
      "Which came first: {event_a} or {event_b} in {topic}?"
    ],
    hard: [
      "On what exact date was {topic} released?",
      "How many years between {event_a} and {event_b} in {topic}?"
    ]
  },

  // For characters
  "characters": {
    easy: [
      "Name a main character in {topic}.",
      "Who is the hero of {topic}?",
      "What character appears on {topic} merchandise?"
    ],
    medium: [
      "Which character in {topic} is known for {trait}?",
      "Who is {character}'s rival in {topic}?",
      "What's {character}'s role in {topic}?"
    ],
    hard: [
      "Which actor was originally cast for {character} in {topic}?",
      "What's {character}'s full backstory in {topic}?",
      "Which character was removed from final version of {topic}?"
    ]
  },

  // For locations/landmarks
  "landmarks": {
    easy: [
      "Name a famous location in {topic}.",
      "Where does {topic} take place?"
    ],
    medium: [
      "Which {location} is central to the plot of {topic}?",
      "What happens at {location} in {topic}?"
    ],
    hard: [
      "Where was {location} from {topic} actually filmed?",
      "Which {location} appears only briefly in {topic}?"
    ]
  }
};
```

**Acceptance Criteria**:

- Each major angle type has dedicated templates
- Templates feel natural and appropriate for the angle
- Fallback to general templates when specific angle not matched
- No template conflicts or overrides

---

### Task 2.2: Add Multiple Choice Format Option

- [ ] Design multiple choice data structure
- [ ] Create distractor generation logic
- [ ] Update UI to display options
- [ ] Add option selection tracking
- [ ] Maintain compatibility with open-ended format

#### Multiple Choice Structure

```javascript
const multipleChoiceQuestions = {
  "star-wars": {
    easy: [
      {
        prompt: "Which actor played Han Solo in the original trilogy?",
        options: [
          "Harrison Ford",
          "Mark Hamill",
          "Alec Guinness",
          "Billy Dee Williams"
        ],
        answer: "Harrison Ford",
        answerIndex: 0,
        explanation: "Harrison Ford played Han Solo in Episodes IV, V, and VI",
        difficulty: "easy"
      },
      {
        prompt: "What color is Yoda's lightsaber?",
        options: [
          "Green",
          "Blue",
          "Purple",
          "Red"
        ],
        answer: "Green",
        answerIndex: 0,
        explanation: "Yoda wields a green lightsaber throughout the prequels",
        difficulty: "easy"
      }
    ]
  }
};
```

#### UI Changes Required

```javascript
// Add to renderCard function
function renderMultipleChoice(question) {
  if (question.type === "multiple-choice") {
    const optionsHTML = question.options.map((opt, idx) =>
      `<button class="mc-option" data-index="${idx}">${opt}</button>`
    ).join('');

    document.getElementById("cardBody").innerHTML = `
      <div class="mc-container">
        ${optionsHTML}
      </div>
    `;
  }
}
```

**Acceptance Criteria**:

- 3-4 plausible options per question
- Distractors are believable but clearly wrong
- UI clearly indicates selected option
- Works on mobile/touch devices
- Backward compatible with text-only mode

---

### Task 2.3: Source Verification System

- [ ] Add source field to all curated questions
- [ ] Create verification status tracking
- [ ] Add "Last Verified" dates
- [ ] Include citation format

#### Verification Structure

```javascript
const verifiedQuestions = {
  question: "What year was Star Wars: A New Hope released?",
  answer: "1977",
  alternatives: ["May 25, 1977", "1977-05-25"], // Accept variations
  source: {
    primary: "IMDb - Star Wars (1977)",
    url: "https://www.imdb.com/title/tt0076759/",
    verified: "2025-11-28",
    confidence: "high" // high, medium, low
  },
  category: "factual",
  tags: ["dates", "releases", "original trilogy"]
};
```

**Acceptance Criteria**:

- All factual questions have sources
- Sources are authoritative (IMDb, Wikipedia, official docs)
- Verification dates within last 6 months
- Alternative answer formats accepted (fuzzy matching)

---

## Phase 3: Advanced Features

**Estimated Time**: 8+ hours
**Priority**: LOW
**Impact**: Long-term engagement

### Task 3.1: Dynamic Difficulty Adjustment

- [ ] Track user accuracy per topic
- [ ] Implement difficulty scaling algorithm
- [ ] Add smooth transitions between difficulties
- [ ] Persist performance data

#### Implementation Approach

```javascript
const performanceTracking = {
  "star-wars": {
    easy: { attempts: 10, correct: 8, accuracy: 0.8 },
    medium: { attempts: 5, correct: 3, accuracy: 0.6 },
    hard: { attempts: 2, correct: 0, accuracy: 0.0 }
  }
};

function adjustDifficulty(topicId, currentDifficulty) {
  const perf = performanceTracking[topicId][currentDifficulty];

  // Level up after 5+ correct in a row with >80% accuracy
  if (state.streak >= 5 && perf.accuracy > 0.8) {
    const nextLevel = difficulties[difficulties.indexOf(currentDifficulty) + 1];
    if (nextLevel) {
      return { difficulty: nextLevel, reason: "🎉 Leveling up!" };
    }
  }

  // Level down after 3+ wrong in a row with <40% accuracy
  if (state.streak === 0 && perf.accuracy < 0.4 && perf.attempts >= 5) {
    const prevLevel = difficulties[difficulties.indexOf(currentDifficulty) - 1];
    if (prevLevel) {
      return { difficulty: prevLevel, reason: "Let's try something easier" };
    }
  }

  return { difficulty: currentDifficulty, reason: null };
}
```

**Acceptance Criteria**:

- Adjustments feel fair and not jarring
- User can override auto-adjustments
- Visual feedback when difficulty changes
- Performance data persists across sessions

---

### Task 3.2: Question Chains & Follow-ups

- [ ] Design chain data structure
- [ ] Create chain progression logic
- [ ] Add "Continue chain?" UI prompt
- [ ] Track chain completion

#### Question Chain Structure

```javascript
const questionChains = {
  "star-wars-timeline": {
    name: "Star Wars Timeline Challenge",
    description: "Test your knowledge of the Star Wars chronology",
    questions: [
      {
        id: "sw-chain-1",
        q: "What's the first Star Wars movie released?",
        a: "A New Hope (1977)",
        nextId: "sw-chain-2"
      },
      {
        id: "sw-chain-2",
        q: "Who directed A New Hope?",
        a: "George Lucas",
        previousId: "sw-chain-1",
        nextId: "sw-chain-3"
      },
      {
        id: "sw-chain-3",
        q: "Which studio distributed the original Star Wars?",
        a: "20th Century Fox",
        previousId: "sw-chain-2",
        nextId: null
      }
    ],
    rewards: {
      completion: "🏆 Timeline Master!",
      bonusPoints: 50
    }
  }
};
```

**Acceptance Criteria**:

- Chains build knowledge progressively
- User can exit chain without penalty
- Bonus points for completing chains
- Visual progress indicator for chains

---

### Task 3.3: Image-Based Questions

- [ ] Design image question format
- [ ] Create image storage strategy
- [ ] Build image display component
- [ ] Add accessibility (alt text, descriptions)

#### Image Question Structure

```javascript
const imageQuestions = {
  "star-wars": [
    {
      type: "image",
      prompt: "Which Star Wars character is this?",
      imageUrl: "assets/questions/star-wars/yoda-01.jpg",
      imageAlt: "Small green creature with large ears",
      answer: "Yoda",
      hints: ["Jedi Master", "Lives on Dagobah", "900 years old"],
      difficulty: "easy"
    },
    {
      type: "image",
      prompt: "What planet is shown here?",
      imageUrl: "assets/questions/star-wars/tatooine-sunset.jpg",
      imageAlt: "Desert landscape with twin suns setting",
      answer: "Tatooine",
      hints: ["Twin suns", "Luke's home planet", "Desert world"],
      difficulty: "medium"
    }
  ]
};
```

**Implementation Considerations**:

- Image hosting: Local assets vs CDN
- Image optimization for mobile data
- Copyright/licensing for images
- Fallback for failed image loads

**Acceptance Criteria**:

- Images load quickly (<2s on 3G)
- Accessible screen reader descriptions
- Images clearly relevant to question
- Option to toggle image questions on/off

---

## Testing & Quality Assurance

### Task 4.1: Question Quality Review

- [ ] Grammar check all templates
- [ ] Fact-check all curated answers
- [ ] Test questions with beta users
- [ ] Collect feedback on difficulty levels

#### Review Checklist

- [ ] No grammatical errors in templates
- [ ] Angle substitution works naturally
- [ ] Answers are factual and verifiable
- [ ] Difficulty levels feel accurate
- [ ] No offensive or controversial content
- [ ] Accessible language (avoid jargon where possible)

---

### Task 4.2: Cross-Topic Testing

- [ ] Test templates with all 81 topics
- [ ] Verify angles exist for all categories
- [ ] Check edge cases (single-word answers, long answers)
- [ ] Validate special characters handling

#### Test Matrix

| Topic | Easy | Medium | Hard | Notes |
|-------|------|--------|------|-------|
| Star Wars | ✅ | ✅ | ✅ | Complete - 30 questions + 6 answer sets |
| Marvel Universe | ✅ | ✅ | ✅ | Complete - 30 questions + 6 answer sets |
| Harry Potter | ❌ | ❌ | ❌ | Not started |
| Music Legends | ❌ | ❌ | ❌ | Not started |
| US History | ❌ | ❌ | ❌ | Not started |
| ... | | | | |

---

## Data Migration Plan

### Option A: Gradual Migration

1. Keep existing template system as fallback
2. Add curated questions first
3. Slowly increase curated question percentage
4. Monitor user engagement metrics

### Option B: Full Replacement

1. Build complete new question system
2. Test thoroughly in staging
3. Deploy with feature flag
4. Rollback if issues detected

**Recommended**: Option A - Gradual Migration

---

## Success Metrics

### Quantitative Metrics

- [ ] Question repetition rate < 5% (down from ~15%)
- [ ] User session length +20%
- [ ] Questions per session +15%
- [ ] User retention (return visits) +10%

### Qualitative Metrics

- [ ] User feedback: "Questions feel more varied"
- [ ] Beta tester approval rating >80%
- [ ] Reduced complaints about repetition
- [ ] Positive reviews mentioning question quality

---

## Resources & References

### Question Writing Guidelines

- Keep questions concise (under 20 words)
- Answers should be 1-5 words when possible
- Avoid ambiguous phrasing
- Use active voice
- Consider international audience (avoid US-centric)

### Research Sources

- **Movies/TV**: IMDb, Rotten Tomatoes, official wikis
- **History**: Encyclopedia Britannica, History.com
- **Science**: NASA, National Geographic, Scientific American
- **Sports**: ESPN, official league sites
- **Music**: AllMusic, Rolling Stone

### Similar Applications (for inspiration)

- Trivia HQ
- Jeopardy! (question structure)
- Sporcle (variety in question types)
- QuizUp (difficulty progression)

---

## Changelog

### Version 1.2 (2025-11-28) - Marvel Universe Addition

**Completed Tasks**:

- ✅ Added curated Marvel Universe questions: 10 easy, 10 medium, 10 hard (script.js:219-256)
- ✅ Created answer examples database for Marvel with 6 angle types (script.js:305-349)
- ✅ Covers MCU and comics content across multiple franchises

**Impact**:

- 2 of 10 priority topics now complete (20%)
- 60 total curated questions across 2 topics
- Marvel questions cover: Avengers, villains, origin stories, multiverse, iconic scenes, quotes

**Example Questions**:

- Easy: "What is Iron Man's real name?" → "Tony Stark"
- Medium: "What is the name of Thor's hammer?" → "Mjolnir"
- Hard: "What is Thanos's home planet?" → "Titan"

### Version 1.1 (2025-11-28) - Phase 1 Implementation

**Completed Tasks**:

- ✅ Expanded easy templates from 6 to 20 (script.js:97-119)
- ✅ Expanded medium templates from 5 to 15 (script.js:121-138)
- ✅ Expanded hard templates from 5 to 15 (script.js:140-158)
- ✅ Added curated Star Wars questions: 10 easy, 10 medium, 10 hard (script.js:180-218)
- ✅ Created answer examples database for Star Wars with 6 angle types (script.js:222-266)
- ✅ Modified createQuestions() to integrate curated questions and answer examples (script.js:279-311)

**Impact**:

- Question repetition reduced from ~13x per template to ~4x
- Star Wars topic now includes 30 factual questions with real answers
- Answer quality improved with real examples (e.g., "Lightsaber" vs "{angle} (classic pick)")
- Template variety increased 3x across all difficulty levels

**Next Steps**:

- Test implementation in browser
- Add curated questions for remaining 8 priority topics
- Gather user feedback on question quality

### Version 1.0 (2025-11-28)

- Initial documentation
- Defined 3 implementation phases
- Created task breakdown with acceptance criteria
- Added code examples and templates

---

## Next Steps

**Immediate Actions** (This Week):

1. [ ] Review and approve this implementation plan
2. [ ] Start Task 1.1: Expand easy templates
3. [ ] Begin curating Star Wars questions (Task 1.2)

**Short Term** (Next 2 Weeks):

1. [ ] Complete Phase 1 implementation
2. [ ] Deploy Phase 1 to production
3. [ ] Gather initial user feedback

**Long Term** (Next Month):

1. [ ] Begin Phase 2 implementation
2. [ ] Evaluate Phase 3 feasibility
3. [ ] Consider AI-assisted question generation

---

## Notes & Ideas

### Future Considerations

- AI-generated question variations using GPT
- User-submitted questions (moderated)
- Daily challenge mode with curated questions
- Topic-specific tournaments
- Collaborative play mode (teams)

### Technical Debt to Address

- Question bank size (currently ~19K questions in memory)
- Consider lazy loading for unused topics
- Compress template strings
- Add service worker for offline play
