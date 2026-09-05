export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export const LEVEL_ORDER: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const LEVEL_META: Record<
  Level,
  { title: string; subtitle: string; color: string }
> = {
  A1: {
    title: "Beginner",
    subtitle: "Introduce yourself, order food, ask simple questions.",
    color: "from-emerald-500 to-teal-600",
  },
  A2: {
    title: "Elementary",
    subtitle: "Handle everyday travel and social situations.",
    color: "from-sky-500 to-blue-600",
  },
  B1: {
    title: "Intermediate",
    subtitle: "Express opinions, narrate stories, understand main ideas.",
    color: "from-indigo-500 to-violet-600",
  },
  B2: {
    title: "Upper Intermediate",
    subtitle: "Argue clearly, understand complex texts and debates.",
    color: "from-fuchsia-500 to-purple-600",
  },
  C1: {
    title: "Advanced",
    subtitle: "Use French fluently for academic and professional work.",
    color: "from-rose-500 to-pink-600",
  },
  C2: {
    title: "Mastery",
    subtitle: "Near-native control of every register and style.",
    color: "from-amber-500 to-orange-600",
  },
};

export type Skill =
  | "grammar"
  | "vocabulary"
  | "listening"
  | "reading"
  | "writing"
  | "speaking"
  | "pronunciation";

export const SKILLS: Skill[] = [
  "grammar",
  "vocabulary",
  "listening",
  "reading",
  "writing",
  "speaking",
  "pronunciation",
];

export const SKILL_LABEL: Record<Skill, string> = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
  pronunciation: "Pronunciation",
};

// ---------- Exercise types ----------

export interface BaseExercise {
  id: string;
  type: string;
  prompt: string;
  skill: Skill;
}

export interface MCQExercise extends BaseExercise {
  type: "multiple_choice";
  options: string[];
  answer: number;
  explain?: string;
  /** Optional TTS text (used e.g. for listening test questions). */
  audio?: string;
}

export interface FillBlankExercise extends BaseExercise {
  type: "fill_in_blank";
  answer: string;
  answerVariants?: string[];
  explain?: string;
}

export interface TranslationExercise extends BaseExercise {
  type: "translation";
  answer: string;
  answerVariants?: string[];
  explain?: string;
}

export interface ListenExercise extends BaseExercise {
  type: "listen";
  /** text to synthesize via TTS */
  audio: string;
  question: string;
  options?: string[];
  answer?: number;
  answerText?: string;
}

export interface PronunciationExercise extends BaseExercise {
  type: "pronunciation";
  word: string;
  ipa: string;
}

export interface OrderingExercise extends BaseExercise {
  type: "ordering";
  parts: string[];
  answer: number[]; // correct order as indices
}

export type Exercise =
  | MCQExercise
  | FillBlankExercise
  | TranslationExercise
  | ListenExercise
  | PronunciationExercise
  | OrderingExercise;

// ---------- Vocabulary ----------

export interface VocabularyItem {
  fr: string;
  en: string;
  example?: string;
  exampleEn?: string;
  ipa?: string;
}

export interface VocabularyTheme {
  theme: string;
  items: VocabularyItem[];
}

// ---------- Grammar ----------

export interface GrammarTopic {
  id: string;
  title: string;
  explanation: string;
  examples: { fr: string; en: string }[];
  bookChapters: string;
  exercises: Exercise[];
}

// ---------- Substance areas ----------

export interface ReadingPassage {
  id: string;
  title: string;
  text: string;
  questions: MCQExercise[];
}

export interface ListeningClip {
  id: string;
  title: string;
  text: string; // TTS-synthesized audio content
  questions: MCQExercise[];
}

export interface WritingPrompt {
  id: string;
  title: string;
  task: string;
  minWords: number;
}

export interface SpeakingPrompt {
  id: string;
  title: string;
  scenario: string;
  hint: string;
}

export interface Story {
  id: string;
  title: string;
  level: Level;
  dialogue: { speaker: string; text: string }[];
  questions: MCQExercise[];
}

export interface Scenario {
  id: string;
  title: string;
  setting: string;
  dialogue: { speaker: string; text: string }[];
}

export interface CulturalNote {
  title: string;
  body: string;
}

// ---------- Pronunciation ----------

export interface Phoneme {
  symbol: string;
  name: string;
  examples: string[];
  note?: string;
}

export interface PronunciationContent {
  phonemes: Phoneme[];
  minimalPairs: { a: string; b: string }[];
  rules: string[];
}

// ---------- Test ----------

export interface WritingTask {
  id: string;
  title: string;
  prompt: string;
  minWords: number;
}

export interface SpeakingTask {
  id: string;
  title: string;
  prompt: string;
  hint: string;
}

export interface TestDefinition {
  passingScore: number;
  maxScore: number;
  listening: MCQExercise[];
  reading: MCQExercise[];
  writing: WritingTask[];
  speaking: SpeakingTask[];
  pronunciation: PronunciationExercise[];
}

// ---------- Full level ----------

export interface LevelContent {
  level: Level;
  grammar: GrammarTopic[];
  vocabulary: VocabularyTheme[];
  phrases: VocabularyItem[];
  pronunciation: PronunciationContent;
  listening: ListeningClip[];
  reading: ReadingPassage[];
  writingPrompts: WritingPrompt[];
  speakingPrompts: SpeakingPrompt[];
  stories: Story[];
  scenarios: Scenario[];
  culturalNotes: CulturalNote[];
  test: TestDefinition;
}