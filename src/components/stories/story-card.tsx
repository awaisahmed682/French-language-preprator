"use client";

import type { Story } from "@/lib/types";
import { recordPracticeRound } from "@/actions/progress";
import { SpeakButton } from "@/components/speech/speak-button";
import { ExerciseManager } from "@/components/exercise/exercise-manager";
import { Card } from "@/components/ui/primitives";

export function StoryCard({ story, level }: { story: Story; level: string }) {
  const handleFinished = async (results: { correct: boolean }[]) => {
    const score = results.filter((r) => r.correct).length;
    await recordPracticeRound(
      level.toUpperCase() as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
      score,
      results.length
    );
  };

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{story.title}</h2>
      <div className="flex flex-col gap-2">
        {story.dialogue.map((line, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-1 shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              {line.speaker}
            </span>
            <p className="min-w-0 flex-1 rounded-xl bg-zinc-50 px-3 py-2 text-sm leading-relaxed dark:bg-zinc-900">
              {line.text}
            </p>
            <SpeakButton text={line.text} label="" size="sm" />
          </div>
        ))}
      </div>
      {story.questions.length > 0 ? (
        <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Story questions
          </h3>
          <ExerciseManager exercises={story.questions} onFinished={handleFinished} />
        </div>
      ) : null}
    </Card>
  );
}