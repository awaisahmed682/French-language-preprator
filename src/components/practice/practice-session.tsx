"use client";

import { useState } from "react";
import type { Exercise, Level } from "@/lib/types";
import { recordPracticeRound } from "@/actions/progress";
import { Card } from "@/components/ui/primitives";
import { ExerciseManager } from "@/components/exercise/exercise-manager";

export function PracticeSession({ level, exercises }: { level: Level; exercises: Exercise[] }) {
  const [done, setDone] = useState(false);

  if (exercises.length === 0) {
    return (
      <Card>
        <p className="text-sm text-zinc-500">
          No exercises available for your level right now.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
        <span className="font-medium text-zinc-900 dark:text-zinc-50">
          Practice session {level}
        </span>
        <span>·</span>
        <span>{exercises.length} mixed exercises</span>
        <span>·</span>
        <span>earn XP based on your score</span>
      </Card>
      <ExerciseManager
        exercises={exercises}
        onFinished={async (results) => {
          const score = results.filter((r) => r.correct).length;
          await recordPracticeRound(level, score, results.length);
          setDone(true);
        }}
      />
      {done ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          Session saved! +XP added to your profile.
        </p>
      ) : null}
    </div>
  );
}