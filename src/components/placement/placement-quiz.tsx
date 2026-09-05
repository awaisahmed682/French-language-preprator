"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCurrentLevel } from "@/actions/auth";
import { LEVEL_META, LEVEL_ORDER, type Level } from "@/lib/types";
import { Button, Card, ProgressBar } from "@/components/ui/primitives";

export interface PlacementQuestion {
  level: Level;
  prompt: string;
  options: string[];
  answer: number;
  audio?: string;
}

export function PlacementQuiz({ questions }: { questions: PlacementQuestion[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(questions.map(() => null));
  const [saving, setSaving] = useState(false);

  const q = questions[index];
  const done = index >= questions.length;

  const correctPerLevel = (() => {
    const map: Record<Level, { correct: number; total: number }> = Object.fromEntries(
      LEVEL_ORDER.map((l) => [l, { correct: 0, total: 0 }])
    ) as Record<Level, { correct: number; total: number }>;
    questions.forEach((qq, i) => {
      const a = answers[i];
      const entry = map[qq.level];
      entry.total += 1;
      if (a === qq.answer) entry.correct += 1;
    });
    return map;
  })();

  let recommended: Level = "A1";
  for (const l of LEVEL_ORDER) {
    if (correctPerLevel[l].correct >= 1 && correctPerLevel[l].total > 0) {
      recommended = l;
    }
  }

  const save = async () => {
    setSaving(true);
    try {
      await setCurrentLevel(recommended);
      router.push("/dashboard");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <Card className="mx-auto flex max-w-2xl flex-col gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-3xl dark:bg-indigo-950">
          🧭
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Recommended level: {recommended}
        </h2>
        <p className="text-sm text-zinc-500">{LEVEL_META[recommended].title}</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {LEVEL_ORDER.map((l) => {
            const c = correctPerLevel[l];
            return (
              <div key={l} className={`rounded-lg p-2 text-center ${l === recommended ? "bg-indigo-50 ring-2 ring-indigo-500 dark:bg-indigo-950/60" : "bg-zinc-50 dark:bg-zinc-900"}`}>
                <p className="font-bold text-zinc-800 dark:text-zinc-100">{l}</p>
                <p className="text-xs text-zinc-500">
                  {c.correct}/{c.total}
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-zinc-500">
          You can adjust this level at any time by working through the other levels.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : `Start at level ${recommended}`}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>
          Question {index + 1} / {questions.length}
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">{q.level}</span>
      </div>
      <ProgressBar value={index + (answers[index] === null ? 0 : 1)} max={questions.length} />
      <p className="text-base font-medium leading-relaxed text-zinc-900 dark:text-zinc-100">{q.prompt}</p>
      <div className="grid gap-2">
        {q.options.map((opt, oi) => (
          <button
            key={oi}
            onClick={() => {
              setAnswers((prev) => prev.map((a, i) => (i === index ? oi : a)));
              setIndex((i) => i + 1);
            }}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            {opt}
          </button>
        ))}
      </div>
    </Card>
  );
}