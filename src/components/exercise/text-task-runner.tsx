"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MCQExercise } from "@/lib/types";
import { recordPracticeRound } from "@/actions/progress";
import { Card } from "@/components/ui/primitives";
import { SpeakButton } from "@/components/speech/speak-button";
import { ExerciseManager } from "@/components/exercise/exercise-manager";

export function TextTaskRunner({
  level,
  title,
  subtitle,
  body,
  audio,
  questions,
  onSaved,
}: {
  level: string;
  title: string;
  subtitle?: string;
  body?: string;
  audio?: string;
  questions: MCQExercise[];
  onSaved?: (score: number, max: number) => void;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const handleFinished = async (results: { correct: boolean }[]) => {
    const score = results.filter((r) => r.correct).length;
    const max = results.length;
    await recordPracticeRound(level.toUpperCase() as "A1" | "A2" | "B1" | "B2" | "C1" | "C2", score, max);
    setSaved(true);
    onSaved?.(score, max);
    router.refresh();
  };

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">{subtitle}</p> : null}
      </div>
      {audio ? (
        <div className="flex items-center gap-2 rounded-xl bg-indigo-50 p-3 dark:bg-indigo-950/40">
          <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
            Listen carefully:
          </span>
          <SpeakButton text={audio} label="Play audio" variant="primary" size="sm" />
          {saved ? (
            <span className="ml-auto text-xs font-medium text-emerald-600 dark:text-emerald-300">Done ✓</span>
          ) : null}
        </div>
      ) : null}
      {body ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          {body.split(/\n{2,}/).map((p, i) => (
            <p key={i} className="mb-3 last:mb-0">{p}</p>
          ))}
        </div>
      ) : null}
      {questions.length > 0 ? (
        <ExerciseManager exercises={questions} onFinished={handleFinished} />
      ) : null}
    </Card>
  );
}