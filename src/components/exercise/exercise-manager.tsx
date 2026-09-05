"use client";

import { useState } from "react";
import type { Exercise, Skill } from "@/lib/types";
import { SKILL_LABEL } from "@/lib/types";
import { Badge, Button, Card, ProgressBar } from "@/components/ui/primitives";
import { ExerciseView, skillTone, type Grade } from "./exercise-views";

export interface ExerciseResult {
  exerciseId: string;
  skill: Skill;
  correct: boolean;
  score: number;
}

export function ExerciseManager({
  exercises,
  onFinished,
  title,
}: {
  exercises: Exercise[];
  onFinished?: (results: ExerciseResult[]) => void;
  title?: string;
}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<(ExerciseResult | null)[]>(
    exercises.map(() => null)
  );
  const done = results.every((r) => r !== null);

  const current = exercises[index];
  const grade = (g: Grade) => {
    setResults((prev) =>
      prev.map((r, i) =>
        i === index
          ? { exerciseId: current.id, skill: current.skill, correct: g.correct, score: g.score }
          : r
      )
    );
  };

  const finished = () => {
    const list = results.filter((r): r is ExerciseResult => r !== null);
    onFinished?.(list);
  };

  if (done) {
    const list = results as ExerciseResult[];
    const score = list.reduce((sum, r) => sum + r.score, 0);
    const max = list.length;
    const correctCount = list.filter((r) => r.correct).length;
    return (
      <Card className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl dark:bg-emerald-950">
          👍
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Exercise complete!
        </h3>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          {correctCount} of {max} correct (
          {Math.round((score / max) * 100)}%)
        </p>
        <ProgressBar value={score} max={max} className="max-w-xs" />
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setIndex(0);
              setResults(exercises.map(() => null));
            }}
          >
            Restart
          </Button>
          <Button variant="secondary" onClick={finished}>
            Finish
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge tone={skillTone(current.skill)}>{SKILL_LABEL[current.skill]}</Badge>
          <span className="text-xs text-zinc-700 dark:text-zinc-200">
            Question {index + 1} / {exercises.length}
          </span>
        </div>
        {title ? <span className="text-sm font-semibold">{title}</span> : null}
      </div>
      <ProgressBar value={index + (results[index] ? 1 : 0.5)} max={exercises.length} />
      <div>
        <p className="mb-3 text-base font-medium leading-relaxed text-zinc-900 dark:text-zinc-100">
          {current.prompt}
        </p>
        <ExerciseView exercise={current} onGrade={grade} />
      </div>
      <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <Button variant="ghost" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
          ← Previous
        </Button>
        <Button
          disabled={!results[index]}
          onClick={() => (index < exercises.length - 1 ? setIndex((i) => i + 1) : finished())}
        >
          {index < exercises.length - 1 ? "Next →" : "See my results"}
        </Button>
      </div>
    </Card>
  );
}