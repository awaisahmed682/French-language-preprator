import { requireSession } from "@/lib/auth";
import { LEVEL_ORDER, type Level } from "@/lib/types";
import { getLevelContent } from "@/lib/content";
import { shuffle } from "@/lib/utils";
import { PlacementQuiz } from "@/components/placement/placement-quiz";

export default async function PlacementPage() {
  await requireSession();

  const questions = [] as {
    level: Level;
    prompt: string;
    options: string[];
    answer: number;
  }[];

  // Pick up to 2 reading MCQs per level (A1..B2) for a quick, level-tagging quiz.
  const targetLevels = LEVEL_ORDER.slice(0, 4);
  for (const level of targetLevels) {
    const content = getLevelContent(level);
    const bank = [...content.test.reading, ...content.reading.flatMap((r) => r.questions)];
    const picked = shuffle(bank).slice(0, 2);
    for (const q of picked) {
      questions.push({ level, prompt: q.prompt, options: q.options, answer: q.answer });
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Placement test</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Answer {questions.length} comprehension questions. We&apos;ll recommend a
          starting level.
        </p>
      </div>
      <PlacementQuiz questions={questions} />
    </div>
  );
}