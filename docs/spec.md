# French Language Preparator - Specification Document

## Project Overview

A web-based French language learning application that covers all CEFR levels (A1-C2) with structured lessons and certification tests modeled after **TEF Canada** and **TCF Canada** formats.

### Goals
- Guide learners from absolute beginner (A1) to mastery (C2)
- Provide level-appropriate content following CEFR guidelines
- Certify proficiency at each level with TEF/TCF-style tests
- Track progress and award level certificates
- Provide user accounts (sign up / login) so each learner sees their own progress and current level
- Include pronunciation training through audio examples, phonetics, and speech practice

---

## Competitor Analysis

Research into leading language-learning platforms (Duolingo, Babbel, Rosetta Stone, Busuu, Pimsleur, Memrise, Mondly) identified the features below. Strong, feasible features are adopted into this specification; features that are weak, outdated, or out of scope (e.g., AR/VR immersion) are noted but excluded.

### Feature Comparison

| Feature | Duolingo | Babbel | Rosetta Stone | Busuu | Pimsleur | Status for this App |
|---------|----------|--------|---------------|-------|----------|---------------------|
| Gamification (streaks, XP, leaderboards) | Yes | Minimal | No | No | No | Adopted |
| Spaced repetition (review manager) | Limited | Yes | No | Limited | Yes | Adopted |
| Grammar explanations | Minimal | Strong | None | Strong | Minimal | Adopted (strong) |
| Speech recognition / pronunciation | Basic | Yes | TruAccent (best) | Yes | Audio-only | Adopted (advanced) |
| AI conversation / roleplay | Yes (Max) | Yes | Developing | Yes | No | Adopted |
| AI "Explain My Answer" | Yes | No | No | No | No | Adopted |
| Interactive stories / dialogue scenarios | Yes | Situational | Stories | No | No | Adopted |
| Community corrections (native speakers) | No | No | No | Yes | No | Adopted (optional) |
| CEFR-aligned certification | No | No | No | Yes (McGraw-Hill) | No | Adopted (core) |
| Offline access | Paid | Yes | Yes | Yes | Yes | Optional (PWA) |
| Live classes with tutors | No | Yes | Add-on | No | No | Deferred (future) |
| Immersion-only (no translation) | No | No | Yes | No | No | Excluded |
| AR/VR lessons | No | No | No | No | No | Excluded (out of scope) |
| Daily goals & reminders | Yes | Limited | No | No | No | Adopted |

### Key Insights from Competitor Research
- **Gamification drives habit** (Duolingo) but can create "streak guilt" — implement streaks + streak-freezes with optional, non-punishing hearts system. Never block learning behind ads.
- **Spaced repetition is proven for retention** (Pimsleur/Babbel) — vocabulary and grammar reviews must be scheduled and personalized.
- **Strong grammar explanations** (Babbel) lead to better long-term sentence formation than pure pattern recognition.
- **Pronunciation quality is a differentiator** (Rosetta Stone TruAccent) — our TEF/TCF focus makes speech-recognition pronunciation scoring a core feature.
- **AI conversation unlocks real speaking practice** (Duolingo Max / Babbel AI) — simulated roleplays will be core; AI must be backed by structured grammar data to avoid confident-wrong-answers.
- **Community corrections** (Busuu) provide human feedback AI cannot fully replace — implement as an optional native-speaker review layer.
- **Advanced-level content thins out in most apps** (Babbel B2/C1 gap) — our C1/C2 levels are a competitive strength.

---

## CEFR Level Structure

### Level A1 - Beginner (Découverte)

**Grammar:**
- Nouns: gender (masculine/feminine), number (singular/plural)
- Articles: definite (le, la, l', les), indefinite (un, une, des), partitive (du, de la, de l', des)
- Subject pronouns (je, tu, il/elle, nous, vous, ils/elles)
- Present tense of regular verbs (-er, -ir, -re)
- être (to be) and avoir (to have)
- Negation (ne...pas)
- Interrogative forms
- Demonstrative adjectives (ce, cet, cette, ces)
- Possessive adjectives (mon, ma, mes, etc.)
- Prepositions of place (à, dans, sur, sous, devant, derrière)
- Numbers (1-1000)
- Telling time
- Days, months, seasons

**Vocabulary Themes:**
- Greetings and introductions
- Family and relationships
- Numbers, colors, dates
- Food and drink
- Daily routine
- Weather
- Clothing
- Home and furniture
- Jobs and professions
- Time expressions

**Skills:**
- **Listening:** Understand slow, clear speech on familiar topics
- **Reading:** Read simple signs, menus, schedules, short messages
- **Writing:** Fill forms, write postcards, simple personal descriptions
- **Speaking:** Introduce yourself, ask/answer basic questions
- **Pronunciation:** French alphabet and letter-sound mapping, nasal vowels (on, an, in), silent letters (e muet), accent marks (é, è, ê, ç), basic intonation for statements and questions

---

### Level A2 - Elementary (Survie)

**Grammar:**
- Passé composé with avoir and être
- Imperative mood (tu, vous, nous forms)
- Object pronouns (me, te, le, la, lui, nous, vous, les, leur)
- Adjective agreement and placement
- Comparative and superlative (plus, moins, aussi)
- Demonstrative pronouns (celui, celle, ceux, celles)
- Interrogative adjectives and pronouns (quel, qui, que, quoi, où)
- Future proche (aller + infinitif)
- Conditional with si (present + present)
- Partitive articles in context
- Reflexive verbs (se lever, se coucher, etc.)
- Relative pronouns (qui, que, où)
- Adverbs of frequency and manner

**Vocabulary Themes:**
- Travel and transportation
- Shopping and money
- Health and body
- Hobbies and leisure
- City and directions
- Restaurant ordering
- Accommodation
- Technology basics
- Emotions and feelings
- Celebrations and traditions

**Skills:**
- **Listening:** Understand short conversations on familiar topics
- **Reading:** Understand personal letters, short articles, advertisements
- **Writing:** Write short personal letters, describe experiences, make simple lists
- **Speaking:** Describe experiences, express opinions simply, handle travel situations
- **Pronunciation:** Common phoneme contrasts (é/è, u/ou), pronunciation of final consonants, basic liaison (les amis, nous avons), rhythmic group and stress on the final syllable, intonation in questions

---

### Level B1 - Intermediate (Seuil)

**Grammar:**
- Passé composé vs Imparfait (distinction and usage)
- Plus-que-parfait (pluperfect)
- Passé simple (literary past)
- Future simple
- Conditional present
- Passive voice (être + past participle)
- Causative (faire + infinitive)
- Relative pronouns (dont, lequel, auquel, duquel)
- Infinitive constructions (pour + infinitive, sans + infinitive, avant de, après de)
- Subjonctif présent (introduction)
- Discourse markers (cependant, toutefois, néanmoins, en revanche)
- Indirect speech (reported speech)
- Comparisons of equality and inequality
- Time expressions with prepositions

**Vocabulary Themes:**
- Work and career
- Education and studies
- Media and news
- Environment and nature
- Social issues
- Culture and arts
- Sports and fitness
- Relationships and emotions
- Politics and society
- Science and technology

**Skills:**
- **Listening:** Understand main points of clear standard speech on familiar matters
- **Reading:** Understand texts that consist mainly of high-frequency language
- **Writing:** Write connected text on familiar topics, describe experiences and events
- **Speaking:** Express opinions, give reasons, narrate stories
- **Pronunciation:** Full liaison and elision rules, intonation for expressing emotions and attitudes, rhythm and flow in connected speech, pronunciation of literary/formal French versus everyday French

---

### Level B2 - Upper Intermediate (Avancé)

**Grammar:**
- Subjonctif présent (full usage)
- Subjonctif imparfait (literary)
- Conditionnel passé (would have done)
- Passé composé vs Plus-que-parfait vs Conditionnel passé
- Subordonnant relatives (dont, lequel, etc.) - advanced
- Cleft sentences (c'est...qui/que)
- Emphatic structures
- Advanced passive voice
- Inversion in formal register
- Hypothetical sentences with conditional
- Reported speech - advanced
- Advanced conjunctions and connectors
- Relative clauses - reduced forms
- Past conditional
- Sequence of tenses

**Vocabulary Themes:**
- Abstract concepts (justice, freedom, equality)
- Business and economics
- Law and legal system
- Philosophy and ethics
- International relations
- Literature and film analysis
- Scientific discourse
- Nuanced emotions and states
- Technical vocabulary (chosen domain)
- Idiomatic expressions

**Skills:**
- **Listening:** Understand extended speech and follow complex arguments
- **Reading:** Understand articles and reports on contemporary issues
- **Writing:** Write clear, detailed text on a wide range of subjects
- **Speaking:** Present clear arguments, defend opinions, interact with fluency
- **Pronunciation:** Advanced liaison and enchaînement, nuanced intonation for rhetorical effect, conscious control of pitch and tempo, awareness of regional and francophone accents (Québec, Belgique, Suisse, Afrique)

---

### Level C1 - Advanced (Autonomie)

**Grammar:**
- Subjonctif passé and imparfait (advanced usage)
- Advanced conditional structures
- Complex sentence structures
- Nuanced passive and middle voice
- Literary tenses and registers
- Stylistic inversion
- Advanced discourse organization
- Pleonastic structures
- Advanced pronoun usage
- Complex temporal and causal relationships
- Register shifts (formal/informal)
- Advanced prepositional phrases
- Nominalization

**Vocabulary Themes:**
- Academic and research language
- Literary and artistic criticism
- Diplomatic and political discourse
- Nuanced abstract reasoning
- Specialized professional vocabulary
- Cultural references and allusions
- Advanced idiomatic expressions
- Register-specific vocabulary
- Technical writing
- Persuasive language

**Skills:**
- **Listening:** Understand extended speech even when it is not clearly structured
- **Reading:** Understand long and complex factual and literary texts
- **Writing:** Write clear, well-structured, detailed text on complex subjects
- **Speaking:** Express ideas fluently, use language flexibly for social and professional purposes
- **Pronunciation:** Perfect intonation patterns, mastering prosody for emphasis and persuasion, adjusting pronunciation to register (formal, informal, academic), flawless rhythm in fast speech

---

### Level C2 - Mastery (Maîtrise)

**Grammar:**
- Full mastery of all tenses and moods
- Subtle nuances in tense usage
- Advanced stylistic devices
- Perfect register control
- Complex syntactic structures
- Literary and rhetorical devices
- Advanced concordance of tenses
- Masterful use of connectors
- Sophisticated pronoun reference
- Advanced negation structures
- Pleonasm and emphasis techniques

**Vocabulary Themes:**
- Near-native vocabulary range
- Specialized terminology (multiple fields)
- Advanced wordplay and humor
- Nuanced synonyms and near-synonyms
- Etymology and word formation
- Register-appropriate vocabulary
- Cultural and historical references
- Advanced collocations
- Figurative language mastery
- Technical jargon as needed

**Skills:**
- **Listening:** Understand virtually everything heard with ease
- **Reading:** Read and assimilate complex texts of abstract nature
- **Writing:** Write any type of text with appropriate style and structure
- **Speaking:** Express yourself spontaneously, precisely, and fluently
- **Pronunciation:** Native-like prosody and intonation, mastery of rhythm, pauses and stress for rhetorical effect, unrestricted use of all registers, flawless pronunciation in any context

---

## Certification Tests (TEF Canada / TCF Canada Format)

### Test Structure Overview

Each level certification test follows the official TEF Canada and TCF Canada format with four sections:

| Section | Duration | Questions | Weight |
|---------|----------|-----------|--------|
| Compréhension orale (Listening) | 30-40 min | 30-40 questions | 25% |
| Compréhension écrite (Reading) | 45-60 min | 30-40 questions | 25% |
| Expression écrite (Writing) | 45-60 min | 2-3 tasks | 25% |
| Expression orale (Speaking) | 12-15 min | 2-3 tasks | 25% |

---

### A1 Level Test

#### Listening (Compréhension orale)
- 30 questions
- Identify specific information in short, slow recordings
- Match speakers to topics
- Understand simple instructions
- Recognize numbers, dates, times
- **Duration:** 30 minutes

#### Reading (Compréhension écrite)
- 30 questions
- Understand simple written messages
- Find information in advertisements, notices
- Complete simple forms
- Read short, simple texts
- **Duration:** 45 minutes

#### Writing (Expression écrite)
- 2 tasks:
  1. Complete a form (personal information)
  2. Write a short message (postcard, email - 30-40 words)
- **Duration:** 45 minutes

#### Speaking (Expression orale)
- 2 tasks:
  1. Give personal information (interview simulation)
  2. Ask and answer simple questions
- **Duration:** 12 minutes

**Passing Score:** 150-200 points (out of 300)
**Certificate:** A1 Level Certified

---

### A2 Level Test

#### Listening (Compréhension orale)
- 35 questions
- Understand short conversations on familiar topics
- Follow simple directions
- Identify main idea in short recordings
- Understand announcements
- **Duration:** 35 minutes

#### Reading (Compréhension écrite)
- 35 questions
- Understand personal correspondence
- Read short newspaper articles
- Follow simple instructions
- Understand timetables and brochures
- **Duration:** 50 minutes

#### Writing (Expression écrite)
- 2 tasks:
  1. Write a personal message (email, postcard - 60-80 words)
  2. Describe a photo or situation briefly
- **Duration:** 50 minutes

#### Speaking (Expression orale)
- 3 tasks:
  1. Introduce yourself and give personal information
  2. Describe a photo
  3. Handle a transactional situation (ordering, asking directions)
- **Duration:** 13 minutes

**Passing Score:** 200-250 points
**Certificate:** A2 Level Certified

---

### B1 Level Test

#### Listening (Compréhension orale)
- 35 questions
- Understand the main points of standard speech
- Follow a conversation between native speakers
- Understand radio broadcasts on familiar topics
- Identify speaker's attitude/opinion
- **Duration:** 35 minutes

#### Reading (Compréhension écrite)
- 35 questions
- Understand articles on contemporary issues
- Read personal and professional correspondence
- Understand factual texts
- Identify main points and supporting details
- **Duration:** 55 minutes

#### Writing (Expression écrite)
- 2 tasks:
  1. Write a personal letter or email (120-150 words)
  2. Narrate an experience or tell a story
- **Duration:** 55 minutes

#### Speaking (Expression orale)
- 3 tasks:
  1. Give a structured presentation on a familiar topic
  2. Narrate an experience
  3. Defend an opinion with reasons
- **Duration:** 14 minutes

**Passing Score:** 250-300 points
**Certificate:** B1 Level Certified

---

### B2 Level Test

#### Listening (Compréhension orale)
- 40 questions
- Understand extended speech and lectures
- Follow complex arguments
- Understand TV programs, documentaries
- Identify implicit meaning
- **Duration:** 40 minutes

#### Reading (Compréhension écrite)
- 40 questions
- Understand complex articles on abstract topics
- Read contemporary literary texts
- Understand specialist articles outside field
- Identify author's purpose and tone
- **Duration:** 60 minutes

#### Writing (Expression écrite)
- 2 tasks:
  1. Write an essay or article (200-250 words)
  2. Write a formal letter expressing opinion
- **Duration:** 60 minutes

#### Speaking (Expression orale)
- 3 tasks:
  1. Present and defend a viewpoint
  2. Discuss abstract topics
  3. Role-play a professional/social situation
- **Duration:** 15 minutes

**Passing Score:** 300-375 points
**Certificate:** B2 Level Certified

---

### C1 Level Test

#### Listening (Compréhension orale)
- 40 questions
- Understand extended speech even when not clearly structured
- Understand TV shows, films in standard dialect
- Follow complex technical discussions
- Understand implicit meaning and attitude
- **Duration:** 40 minutes

#### Reading (Compréhension écrite)
- 40 questions
- Understand long and complex texts
- Read academic and literary works
- Understand specialized articles
- Identify fine points of argument
- **Duration:** 60 minutes

#### Writing (Expression écrite)
- 2 tasks:
  1. Write a detailed text on complex subjects (250-300 words)
  2. Write an academic or professional document
- **Duration:** 60 minutes

#### Speaking (Expression orale)
- 3 tasks:
  1. Give a formal presentation
  2. Participate in a debate
  3. Handle complex professional situations
- **Duration:** 15 minutes

**Passing Score:** 375-450 points
**Certificate:** C1 Level Certified

---

### C2 Level Test

#### Listening (Compréhension orale)
- 40 questions
- Understand virtually everything heard with ease
- Follow fast-paced native speech
- Understand humor, irony, cultural references
- Understand multiple speakers simultaneously
- **Duration:** 40 minutes

#### Reading (Compréhension écrite)
- 40 questions
- Read and understand any type of text
- Appreciate literary and stylistic nuances
- Understand specialized, technical, or abstract texts
- Identify subtle implications
- **Duration:** 60 minutes

#### Writing (Expression écrite)
- 2 tasks:
  1. Write a complex, well-structured text (300+ words)
  2. Produce a professional or academic document with precision
- **Duration:** 60 minutes

#### Speaking (Expression orale)
- 3 tasks:
  1. Give an extended presentation on any topic
  2. Participate fluently in spontaneous conversation
  3. Handle any social, academic, or professional situation
- **Duration:** 15 minutes

**Passing Score:** 450-540 points
**Certificate:** C2 Level Certified (Mastery)

---

## Progression Rules

1. **Placement Check:** New users may take a quick placement quiz to start at their actual level; otherwise they begin at A1
2. **Sequential Completion:** Must complete Level N before attempting Level N+1 test
3. **Minimum Study Time:** Recommended minimum study hours per level:
   - A1: 60-80 hours
   - A2: 60-80 hours
   - B1: 100-120 hours
   - B2: 120-150 hours
   - C1: 150-180 hours
   - C2: 180-200+ hours
4. **Practice Tests:** Unlimited practice tests available before certification test
5. **Retake Policy:** Can retake certification test after 7 days
6. **Certificate Generation:** Verifiable digital certificate generated upon passing with score, skill breakdown, and date
7. **Daily Practice:** Configurable daily goals (lessons/XP) with reminders to build consistent habits

---

## Technical Requirements

- **Framework:** Next.js (App Router) with composable React components
- **Styling:** Tailwind CSS / CSS Modules, mobile-first responsive design
- **Authentication:** JWT-based auth with OAuth providers (Google, GitHub) and email/password (NextAuth/Auth.js)
- **Database:** PostgreSQL with Prisma ORM (users, progress, certificates, gamification, SRS review data)
- **Rendering:** React Server Components for content pages, Client Components for interactive exercises and tests
- **Audio:** HTML5 Audio API / Web Speech API (SpeechSynthesis for pronunciation examples, SpeechRecognition for pronunciation feedback)
- **AI Features:** Server-side AI API integration (roleplay conversations, "Explain My Answer", adaptive difficulty, AI tutor Q&A)
- **Real-time:** API Routes / Server Actions for test submissions and progress updates
- **Background Jobs:** Cron for daily goal reminders (email/in-app notifications) and SRS scheduling
- **Spaced Repetition:** SM-2/Leitner scheduling algorithm implementable with plain SQL (no external dependency)
- **Certificates:** PDF generation (server-side) with unique verification codes
- **Offline:** PWA / Service Worker for offline access (optional)

---

## UI/UX Structure

1. **Landing Page:** Welcome page with Sign Up / Login buttons
2. **Sign Up Page:** Create account (name, email, password) or OAuth
3. **Login Page:** Email/password or OAuth login
4. **Placement Check:** Quick quiz to determine starting CEFR level
5. **Dashboard (Home):** Personalized level selection, current level, progress summary, daily goal progress, streak counter, review queue count
6. **Level Pages:** Lessons organized by skill (Grammar, Vocabulary, Listening, Reading, Writing, Speaking, Pronunciation)
7. **Pronunciation Pages:** Phoneme examples with audio playback, IPA charts, tongue/mouth positioning diagrams, and speech-recognition practice
8. **Practice Pages:** Interactive exercises for each skill
9. **Review Page (SRS):** Spaced-repetition flashcard queue for vocabulary/grammar reviews
10. **Stories Page:** Interactive dialogue scenarios with comprehension questions
11. **AI Conversation Page:** AI roleplay chat, "Explain My Answer" explanations
12. **Community Page:** Written/speaking submissions for native-speaker corrections
13. **Gamification:** Streak display, XP counter, badges, leaderboards (top bar / dashboard widgets)
14. **Test Pages:** Certification test interface with timer
15. **Results Page:** Score breakdown, certificate display
16. **Profile Page:** User info, personal progress tracking, earned certificates, settings

## User Accounts & Progress Tracking

- **Sign Up:** Create account with email + password, or OAuth (Google/GitHub). Fields: name, email, target CEFR level, native language.
- **Login:** Authenticate returning users and restore their personal dashboard.
- **Progress Tracking (per user):**
  - Current level and unlocked levels
  - Completed lessons and exercises for each skill
  - Practice test scores history
  - Certification test attempts and results
  - Time spent per level
  - Pronunciation accuracy scores per phoneme/lesson
- **State Synchronization:** Progress is saved to the database after each lesson/exercise/test; the dashboard reflects real-time updates across devices.

## Pronunciation Module

- **Phonetics:** Each level introduces IPA notation and key French sounds (voyelles orales, voyelles nasales, consonnes, semi-voyelles).
- **Audio Examples:** Click-to-play native audio for every word, phrase, phoneme, and minimal pair.
- **Text-to-Speech:** Built-in TTS to hear any French text spoken at a chosen speed (slow → normal → fast).
- **Speech Recognition:** Learners record themselves and get instant feedback (accuracy score, closest-match feedback, replay of their recording vs. native sample).
- **Minimal Pairs Drills:** Contrast tricky sounds (u/ou, é/è, an/on/in, b/v, s/z, p/b) with listening + speaking exercises.
- **Liaison & Elision:** Structured lessons teaching when to link words (les amis, nous #avons) with interactive examples.
- **Intonation Training:** Question vs. statement vs. exclamation curves, emotion expression, with visual pitch graphs.
- **Pronunciation Test:** Part of the certification test - evaluated with speech recognition scoring for each CEFR level.

---

## Premium Features (from Competitor Analysis)

Features adopted because they are proven to improve learning outcomes and engagement:

### 1. Gamification Engine
- **Streaks:** Daily practice streak counter + "streak freeze" items so accidental misses do not cause streak loss.
- **XP & Levels:** Points earned per lesson/exercise; user level-up system (no ads, no pay-to-progress).
- **Badges/Achievements:** Milestone badges (e.g., "First 100 Words", "7-Day Streak", "A1 Certified", "Perfect Pronunciation").
- **Daily Goals & Reminders:** User-configurable daily XP/lesson targets with in-app and email reminders.
- **Leaderboards:** Optional weekly leagues / friend leaderboards (privacy-controlled; can be hidden).
- **Hearts/Lives (optional):** Soft-limit mistakes during certification tests only; practice mode is unlimited.

### 2. Spaced Repetition System (SRS)
- **Review Manager:** Automatically schedules vocabulary and grammar reviews at optimal intervals (SM-2 / Leitner algorithm).
- **Flashcards:** Word/Phrase -> translation -> audio playback -> speech-recognition self-check.
- **Integration:** New words from lessons, stories, AI chats, and mistakes automatically enter the review queue.
- **Daily Review Session:** Short, personalized review queue each day based on due items.

### 3. Interactive Stories & Real-Life Scenarios
- **Stories:** Short interactive dialogues with native audio (like Duolingo Stories): listen -> answer comprehension questions -> vocabulary extraction.
- **Situational Lessons:** Real scenarios (ordering food, checking into a hotel, job interview, TEF/TCF test simulation) with branching dialogues.
- **Fill-in & Roleplay:** Some stories let the learner take a role and respond via speech recognition.

### 4. AI Conversation Partner & Helpers
- **AI Roleplay:** Simulated conversations with AI characters across realistic scenarios, with the AI adapting to the learner's level.
- **AI Video-Style Calls:** (Optional, advanced) conversation practice with a simulated native speaker, evaluated for grammar and pronunciation.
- **"Explain My Answer":** After any mistake, one tap gives a clear grammar/vocabulary explanation so learners understand *why* an answer is wrong.
- **AI Tutor Q&A:** Ask grammar questions in natural language; answers are grounded in the structured grammar database to prevent confident-wrong answers.

### 5. Adaptive Learning Path
- **Personalized Difficulty:** AI adjusts question difficulty based on the learner's mastery of each skill and past mistakes.
- **Weak-Skill Targeting:** The app recommends lessons/practice for underperforming skills (e.g., low pronunciation or listening scores).
- **Placement Check:** New users can take a quick placement quiz to start at their actual level instead of A1.

### 6. Community Corrections (Native Speaker Review)
- **Written Submissions:** Learners submit short writing exercises; native speakers (or AI-assisted review) correct and annotate them.
- **Spoken Submissions:** Learners record themselves and receive pronunciation feedback from the community.
- **Review Exchange:** Optional reciprocal feature where learners who are native French speakers review others' work and earn badges.
- **Fallback:** AI-assisted auto-feedback when community review is slow.

### 7. Enhanced Certificates
- **Verification System:** Every certificate has a unique verification code that can be checked by third parties (employers, universities).
- **Shareable:** Download as PDF, shareable link, and LinkedIn-ready graphic with score + date + CEFR level.
- **Progress Record:** Certificate includes per-skill breakdown (listening, reading, writing, speaking, pronunciation, grammar, vocabulary).

### 8. Cultural Insights
- **Culture Notes:** Cultural context embedded in lessons (France, Québec, Belgique, Suisse, Maghreb, Afrique francophone).
- **Francophone Spotlight:** Every level includes authentic short texts/audio from different francophone regions.
- **Etiquette & Pragmatics:** Formality (tu/vous), gestures, and social norms relevant to each level.

---

## Content Sources

**Primary source material: `Complete French All-in-One` (Practice Makes Perfect, McGraw-Hill)** — a CEFR-aligned comprehensive French grammar and exercise book included in this project. The curriculum extracts grammar topics, vocabulary, dialogues, and exercise patterns from this book for all six levels.

**Supplementary sources:**
- Official TEF Canada / TCF Canada sample tests and topic guides (for test structure, question types, and scoring).
- Native-speaker recordings / TTS for all audio content.
- Open francophone corpora and news sources for authentic B1-C2 reading/listening materials.
- IPA (International Phonetic Alphabet) charts for the pronunciation module.

**Content mapping:** Every grammar topic in the CEFR Level Structure above is mapped to specific chapters/exercises from `Complete French All-in-One`, ensuring pedagogical accuracy and depth at every level.

---

## Data Structure (Content & User Storage)

**Content (lesson data):**
```json
{
  "level": "A1",
  "topics": [
    {
      "id": "a1-grammar-01",
      "title": "Nouns and Articles",
      "lessons": [...],
      "exercises": []
    }
  ],
  "pronunciation": {
    "phonemes": [{ "symbol": "ɑ̃", "examples": ["vent", "enfant"] }],
    "minimalPairs": [{ "a": "dessus", "b": "dessous", "audio": true }],
    "lessons": [...]
  },
  "test": {
    "listening": [...],
    "reading": [...],
    "writing": [...],
    "speaking": [...],
    "pronunciation": [...]
  }
}
```

**User / Progress (database):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "authProvider": "email | google | github",
    "currentLevel": "B1",
    "unlockedLevels": ["A1", "A2", "B1"],
    "targetLevel": "C1",
    "nativeLanguage": "English",
    "createdAt": "ISO8601"
  },
  "progress": {
    "userId": "uuid",
    "completedLessons": ["a1-grammar-01", "a1-vocab-02"],
    "skillScores": {
      "grammar": 85,
      "vocabulary": 90,
      "listening": 78,
      "reading": 82,
      "writing": 74,
      "speaking": 70,
      "pronunciation": 68
    },
    "practiceTests": [{ "level": "A1", "date": "ISO8601", "score": 200 }],
    "certifications": [
      { "level": "A1", "date": "ISO8601", "score": 210, "certificateId": "UUID" }
    ],
    "pronunciationScores": [{ "phoneme": "ɑ̃", "accuracy": 87, "date": "ISO8601" }]
  },
  "gamification": {
    "userId": "uuid",
    "xp": 12450,
    "streakCurrent": 23,
    "streakLongest": 45,
    "dailyGoalXp": 50,
    "dailyGoalMet": ["2026-09-01", "2026-09-02"],
    "badges": ["first-100-words", "7-day-streak", "a1-certified"],
    "league": "Bronze | Silver | Gold | Diamond"
  },
  "srsReviews": {
    "userId": "uuid",
    "queue": [
      { "item": "a1-vocab-chair", "dueDate": "ISO8601", "interval": 4, "repetitions": 2, "easeFactor": 2.5 }
    ]
  },
  "aiHistory": {
    "userId": "uuid",
    "roleplaySessions": [{ "date": "ISO8601", "scenario": "hotel-checkin", "score": 82 }],
    "explanations": [{ "date": "ISO8601", "question": "...", "category": "grammar" }]
  },
  "community": {
    "userId": "uuid",
    "writtenSubmissions": [{ "id": "uuid", "date": "ISO8601", "status": "pending | corrected" }],
    "spokenSubmissions": [{ "id": "uuid", "date": "ISO8601", "feedbackRating": 4 }],
    "reviewsGiven": 12
  },
  "certificate": {
    "id": "UUID",
    "userId": "uuid",
    "level": "A1",
    "score": 210,
    "skillBreakdown": { "listening": 82, "reading": 85, "writing": 78, "speaking": 70, "pronunciation": 75 },
    "issuedAt": "ISO8601",
    "verificationCode": "string"
  }
}
```

---
 
## Exercise Types Taxonomy
 
The lesson engine supports these exercise types across all skills and levels:
 
| Type | Skill | Description | Example |
|------|-------|-------------|---------|
| `multiple_choice` | Grammar, Vocab, Reading, Listening | Single or multiple correct answers | "Choose the correct article: ___ livre" |
| `fill_in_blank` | Grammar, Vocab, Writing | Type missing word/phrase | "Je ____ (manger) une pomme" |
| `translation` | Grammar, Vocab, Writing | Translate sentence EN↔FR | "Translate: 'I am eating'" |
| `drag_drop` | Grammar, Vocab | Reorder words / match pairs | "Put words in order: [mange / je / pomme / une]" |
| `conjugation_drill` | Grammar | Conjugate verb in given tense/pronoun | "Conjugate 'manger' - nous, présent" |
| `listening_comprehension` | Listening | Audio → question (MC, true/false, gap-fill) | "Listen and choose the correct picture" |
| `dictation` | Listening, Writing | Audio → type exactly what you hear | "Écrivez ce que vous entendez" |
| `pronunciation` | Speaking, Pronunciation | Record word/phrase → speech recognition score | "Say: 'bonjour' — score: 92/100" |
| `speaking_response` | Speaking | Prompt → record spoken answer (AI/human evaluated) | "Describe your daily routine" |
| `reading_comprehension` | Reading | Text → questions (MC, matching, true/false) | "Read the email and answer questions" |
| `image_match` | Vocab, Listening | Match word/audio to image | "Match audio to correct food image" |
| `sentence_builder` | Grammar, Writing | Build sentence from word bank | "Build: 'I [like] [eating] [apples]'" |
| `minimal_pair_drill` | Pronunciation | Contrast two similar sounds | "Click the word you hear: 'dessus' / 'dessous'" |
| `liaison_practice` | Pronunciation | Identify/produce liaison in sentences | "Mark where liaison occurs: 'les amis'" |
| `roleplay_turn` | Speaking, AI | AI character speaks → learner responds | "AI: 'Bonjour, une table pour deux?' → You: ..." |
 
**Component mapping:** Each type maps to a reusable React component (`<MultipleChoice />`, `<FillInBlank />`, etc.) with props for content, validation, and feedback.
 
---
 
## Test Question Taxonomy (TEF/TCF Format)
 
### Compréhension orale (Listening)
| Question Type | Format | Levels | Example |
|---------------|--------|--------|---------|
| `audio_mc_single` | Audio + 3-4 options, one correct | All | "Que fait l'homme ?" |
| `audio_mc_multiple` | Audio + select all that apply | B1+ | "Quels sujets sont abordés ?" |
| `audio_true_false` | Audio + statement → Vrai/Faux | A1-B2 | "Le train part à 10h. Vrai/Faux" |
| `audio_gap_fill` | Audio with gaps → type missing words | B1+ | "Le concert commence à ____" |
| `audio_image_match` | Audio → choose matching image | A1-A2 | "Select the picture of 'la gare'" |
| `audio_ordering` | Audio segments → put in order | B2+ | "Reconstituez le dialogue" |
 
### Compréhension écrite (Reading)
| Question Type | Format | Levels | Example |
|---------------|--------|--------|---------|
| `text_mc_single` | Text + 3-4 options | All | "Quel est le thème principal ?" |
| `text_mc_multiple` | Text + select all correct | B1+ | "Quelles affirmations sont vraies ?" |
| `text_true_false` | Text + statements → Vrai/Faux | A1-B2 | "L'auteur est médecin. Vrai/Faux" |
| `text_gap_fill` | Text with blanks → choose word | A2+ | "Il ____ (mange/manges/mangeons) une pomme" |
| `text_matching` | Match headings/people to paragraphs | B1+ | "Match each person to their opinion" |
| `text_ordering` | Sentences → logical order | B2+ | "Remettez le paragraphe dans l'ordre" |
| `text_short_answer` | Text → write short answer | C1+ | "En deux phrases, résumez l'argument" |
 
### Expression écrite (Writing)
| Task Type | Format | Levels | Word Count |
|-----------|--------|--------|------------|
| `form_completion` | Fill official form | A1-A2 | N/A |
| `short_message` | Postcard, email, SMS | A1-B1 | 30-80 words |
| `describe_photo` | Describe image in sentences | A2-B1 | 40-60 words |
| `personal_letter` | Informal letter/email | B1-B2 | 120-150 words |
| `opinion_essay` | Structured essay with arguments | B2-C2 | 200-300+ words |
| `formal_letter` | Complaint, application, request | B2-C2 | 150-250 words |
| `report_summary` | Summarize data/text | C1-C2 | 250-300 words |
 
### Expression orale (Speaking)
| Task Type | Format | Levels | Duration |
|-----------|--------|--------|----------|
| `guided_interview` | Examiner asks personal questions | All | 2-3 min |
| `picture_description` | Describe photo | A2-C1 | 1-2 min |
| `roleplay_transactional` | Simulated scenario (shop, hotel) | A2-B2 | 2-3 min |
| `presentation` | Prepared talk on topic | B1-C2 | 2-3 min |
| `debate_defend` | Defend viewpoint with arguments | B2-C2 | 3-4 min |
| `complex_situation` | Handle professional/abstract scenario | C1-C2 | 3-4 min |
 
**Scoring:** Each question/task has a rubric mapped to CEFR descriptors. Auto-scored (MC, gap-fill) vs. human/AI-scored (writing, speaking).
 
---
 
## Pronunciation Scoring Rubric
 
Speech recognition returns a composite score (0-100) weighted from sub-scores:
 
| Sub-score | Weight | Description | Measurement |
|-----------|--------|-------------|-------------|
| **Phoneme Accuracy** | 50% | Correct articulation of vowels, consonants, nasals | Forced alignment + phoneme-level confidence |
| **Prosody** | 25% | Rhythm, stress, intonation patterns | Pitch contour comparison, syllable duration ratios |
| **Fluency** | 15% | Speech rate, pausing, hesitation markers | Words/min, pause frequency/duration, fillers |
| **Completeness** | 10% | All required words spoken, no omissions | Word coverage vs. reference transcript |
 
**CEFR Band Mapping:**
| Composite | CEFR Band | Description |
|-----------|-----------|-------------|
| 90-100 | C2 | Native-like, effortless |
| 80-89 | C1 | Clear, natural, minor L1 traces |
| 70-79 | B2 | Good control, occasional errors |
| 60-69 | B1 | Understandable, noticeable accent |
| 50-59 | A2 | Frequent errors, effort required |
| <50 | A1 | Largely unintelligible |
 
**Test Integration:** Pronunciation section score = average of 5-10 pronunciation tasks. Contributes 25% of Expression orale score (or separate Pronunciation certificate component).
 
---
 
## AI Integration Spec
 
| Feature | Provider | Model | Token Budget | Fallback |
|---------|----------|-------|--------------|----------|
| AI Roleplay | OpenAI | gpt-4o-mini | 2k input / 1k output per turn | Rule-based dialogue tree |
| Explain My Answer | OpenAI | gpt-4o-mini | 1k input / 500 output | Canned grammar explanations from DB |
| AI Tutor Q&A | OpenAI | gpt-4o | 3k input / 1k output | Search grammar DB + template reply |
| Adaptive Difficulty | Local | Custom ML (scikit-learn/TF.js) | N/A | Heuristic: mastery < 60% → easier |
| Content Generation (dev) | OpenAI | gpt-4o | 4k input / 2k output | Human-authored only |
 
**Cost Estimates (per 1000 active users/day):**
- Roleplay: ~50 turns/user/day × $0.00015 = $7.50/day
- Explain My Answer: ~20 requests/user/day × $0.0001 = $2.00/day
- Tutor Q&A: ~5 requests/user/day × $0.0005 = $2.50/day
- **Total: ~$12/day / $360/month** (at gpt-4o-mini pricing)
 
**Safety:** All prompts include system instructions to refuse non-language content, avoid confident-wrong answers, and cite grammar rules from structured DB.
 
**Latency Targets:** Roleplay < 800ms, Explain < 500ms, Tutor < 1200ms (p95).
 
---
 
## Prisma Schema (PostgreSQL)
 
```prisma
generator client {
  provider = "prisma-client-js"
}
 
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
 
model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  passwordHash  String?
  authProvider  AuthProvider @default(EMAIL)
  currentLevel  CEFRLevel @default(A1)
  targetLevel   CEFRLevel @default(C1)
  nativeLanguage String   @default("en")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
 
  progress      Progress?
  gamification  Gamification?
  srsReviews    SrsReview[]
  aiHistory     AiHistory?
  community     Community?
  certificates  Certificate[]
 
  @@index([email])
  @@index([currentLevel])
}
 
enum AuthProvider {
  EMAIL
  GOOGLE
  GITHUB
}
 
enum CEFRLevel {
  A1
  A2
  B1
  B2
  C1
  C2
}
 
model Progress {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  completedLessons String[] @default([])
  skillScores     Json     @default("{}")
  practiceTests   Json     @default("[]")
  certifications  Json     @default("[]")
  pronunciationScores Json  @default("[]")
  updatedAt       DateTime @updatedAt
}
 
model Gamification {
  id            String   @id @default(uuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  xp            Int      @default(0)
  streakCurrent Int      @default(0)
  streakLongest Int      @default(0)
  dailyGoalXp   Int      @default(50)
  dailyGoalMet  DateTime[] @default([])
  badges        String[] @default([])
  league        League   @default(BRONZE)
  updatedAt     DateTime @updatedAt
}
 
enum League {
  BRONZE
  SILVER
  GOLD
  DIAMOND
}
 
model SrsReview {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  itemId        String   // e.g., "a1-vocab-chair"
  itemType      SrsItemType
  dueDate       DateTime
  interval      Int      @default(1)
  repetitions   Int      @default(0)
  easeFactor    Float    @default(2.5)
  lastReviewed  DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
 
  @@unique([userId, itemId])
  @@index([userId, dueDate])
}
 
enum SrsItemType {
  VOCAB
  GRAMMAR
  PHRASE
  PHONEME
}
 
model AiHistory {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  roleplaySessions Json    @default("[]")
  explanations    Json     @default("[]")
  updatedAt       DateTime @updatedAt
}
 
model Community {
  id                  String   @id @default(uuid())
  userId              String   @unique
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  writtenSubmissions  Json     @default("[]")
  spokenSubmissions   Json     @default("[]")
  reviewsGiven        Int      @default(0)
  reputation          Int      @default(0)
  updatedAt           DateTime @updatedAt
}
 
model Certificate {
  id               String   @id @default(uuid())
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  level            CEFRLevel
  score            Int
  skillBreakdown   Json
  issuedAt         DateTime @default(now())
  verificationCode String   @unique
 
  @@index([userId])
  @@index([verificationCode])
}
 
// Content models (seeded from Complete French All-in-One)
model LevelContent {
  id           String   @id @default(uuid())
  level        CEFRLevel @unique
  grammar      Json     // topics, lessons, exercises
  vocabulary   Json
  pronunciation Json
  test         Json
  stories      Json     @default("[]")
  scenarios    Json     @default("[]")
  culturalNotes Json    @default("[]")
  bookMapping  Json     @default("{}") // chapter/exercise refs
  updatedAt    DateTime @updatedAt
}
```
 
---
 
## API Routes / Server Actions
 
### Authentication
- `POST /api/auth/register` — email/password signup
- `POST /api/auth/login` — email/password login
- `GET /api/auth/session` — get current session
- `POST /api/auth/logout` — destroy session
- `GET/POST /api/auth/oauth/[provider]` — NextAuth OAuth flow
 
### User & Progress
- `GET /api/user/profile` — current user profile
- `PATCH /api/user/profile` — update name, target level, native language, daily goal
- `GET /api/user/progress` — full progress object (skillScores, completedLessons, etc.)
- `POST /api/user/progress/lesson` — mark lesson complete, update skillScores
- `GET /api/user/stats` — dashboard stats (streak, xp, review count, time spent)
 
### Lessons & Content
- `GET /api/levels/[level]/content` — full level content (grammar, vocab, pronunciation, stories)
- `GET /api/levels/[level]/lessons/[topicId]` — single lesson with exercises
- `GET /api/levels/[level]/pronunciation` — phonemes, minimal pairs, audio URLs
- `GET /api/levels/[level]/stories` — interactive stories list
- `GET /api/levels/[level]/stories/[storyId]` — story content + comprehension questions
- `GET /api/levels/[level]/scenarios` — situational dialogues
 
### Exercises & Practice
- `POST /api/exercises/submit` — submit exercise answer → returns score + feedback
- `POST /api/exercises/pronunciation` — submit audio blob → returns pronunciation score breakdown
- `GET /api/exercises/adaptive` — get next exercise based on weak skills
 
### Spaced Repetition (SRS)
- `GET /api/srs/queue` — today's due review items
- `POST /api/srs/review` — submit review result (again/hard/good/easy) → updates interval
- `GET /api/srs/stats` — review stats (due, learned, retention rate)
 
### AI Features
- `POST /api/ai/roleplay` — send user message → AI response + evaluation
- `POST /api/ai/explain` — send question/exercise context → explanation
- `POST /api/ai/tutor` — send grammar question → grounded answer
- `POST /api/ai/adaptive` — send skill mastery data → difficulty recommendation
 
### Tests & Certification
- `GET /api/tests/[level]/practice` — generate practice test
- `POST /api/tests/[level]/practice/submit` — submit practice test → score + breakdown
- `POST /api/tests/[level]/certification/start` — start timed certification test
- `POST /api/tests/[level]/certification/submit` — submit certification test
- `GET /api/tests/[level]/certification/result` — get result + certificate if passed
- `GET /api/certificates/[certificateId]` — public certificate verification
- `GET /api/certificates/[certificateId]/pdf` — download certificate PDF
- `GET /api/certificates/[certificateId]/share` — shareable image/link
 
### Community
- `POST /api/community/submit/written` — submit writing for correction
- `POST /api/community/submit/spoken` — submit audio for pronunciation feedback
- `GET /api/community/queue` — get submissions to review (for native speakers)
- `POST /api/community/review` — submit correction/feedback
- `GET /api/community/my-submissions` — user's submissions with status
 
### Gamification
- `GET /api/gamification/stats` — XP, streak, badges, league
- `POST /api/gamification/daily-goal` — mark daily goal met
- `GET /api/gamification/leaderboard` — weekly league standings
- `GET /api/gamification/badges` — all badges with unlock criteria
 
### Admin / Content (protected)
- `GET /api/admin/content/levels` — list all level content
- `POST /api/admin/content/levels/[level]` — upsert level content
- `POST /api/admin/content/import` — import from Complete French All-in-One mapping
- `GET /api/admin/users` — user management
- `GET /api/admin/analytics` — platform analytics (engagement, completion, retention)
 
---
 
## Success Criteria

- [ ] All 6 CEFR levels implemented with complete content
- [ ] Sign up / login with email-password and OAuth providers
- [ ] Personalized dashboard showing each user's own progress and current level
- [ ] Progress saved per user across devices (database-backed, not just LocalStorage)
- [ ] TEF/TCF-style tests for each level
- [ ] Pronunciation module per level with phonemes, minimal pairs, and audio examples
- [ ] Speech-recognition-based pronunciation practice and scoring
- [ ] Pronunciation included in certification tests
- [ ] Score calculation and verifiable certificate generation (unique codes, shareable)
- [ ] Progress tracking across levels
- [ ] Gamification: streaks, XP, badges, daily goals, optional leaderboards
- [ ] Spaced repetition review manager for vocabulary and grammar retention
- [ ] Interactive stories/roleplay scenarios with native audio
- [ ] AI conversation partner and "Explain My Answer" grammar explanations
- [ ] Adaptive difficulty based on learner mistakes and weak skills
- [ ] Placement check for new users to start at their actual level
- [ ] Community corrections (native-speaker review of written/spoken submissions)
- [ ] Cultural insights across the francophone world at every level
- [ ] Responsive design works on mobile and desktop
- [ ] Audio playback for listening exercises
- [ ] Timer functionality for tests
- [ ] Built with Next.js composable components (Server + Client Components where appropriate)
- [ ] Content mapped to the Complete French All-in-One book
