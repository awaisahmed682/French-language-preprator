import { requireSession } from "@/lib/auth";
import { getLevelContent } from "@/lib/content";
import { LEVEL_ORDER, type Level, type Exercise } from "@/lib/types";
import { shuffle } from "@/lib/utils";
import { PracticeSession } from "@/components/practice/practice-session";

export const maxDuration = 30;

export default async function PracticePage() {
  const session = await requireSession();
  const level = session.currentLevel as Level;

  const pool: { ex: Exercise; weight: number }[] = [];
  const self = getLevelContent(level);
  const prevIdx = LEVEL_ORDER.indexOf(level) - 1;
  const prev = prevIdx >= 0 ? getLevelContent(LEVEL_ORDER[prevIdx]) : null;

  for (const topic of self.grammar) {
    for (const ex of topic.exercises) pool.push({ ex, weight: 2 });
  }
  if (prev) {
    for (const topic of prev.grammar) {
      for (const ex of topic.exercises) pool.push({ ex, weight: 1 });
    }
  }

  const weighted = shuffle(pool.flatMap((p) => Array.from({ length: p.weight }, () => p.ex)));
  const exercises = weighted.slice(0, 15);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Mixed practice</h1>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
          A variety of exercises from your level {level} (and the previous one) to practise
          freely.
        </p>
      </div>
      <PracticeSession level={level} exercises={exercises} />
    </div>
  );
}