"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GrammarTopic } from "@/lib/types";
import { completeTopicRound } from "@/actions/progress";
import { Button, Card } from "@/components/ui/primitives";
import { ExerciseManager, type ExerciseResult } from "@/components/exercise/exercise-manager";

export function TopicRunner({
  level,
  topic,
}: {
  level: string;
  topic: GrammarTopic;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const paragraphs = topic.explanation
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const handleFinished = async (results: ExerciseResult[]) => {
    const pct = results.length
      ? Math.round((results.filter((r) => r.correct).length / results.length) * 100)
      : 100;
    await completeTopicRound(level.toUpperCase() as "A1" | "A2" | "B1" | "B2" | "C1" | "C2", topic.id, pct);
    setSaved(true);
    router.refresh();
  };

  if (saved) {
    return (
      <Card className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl dark:bg-emerald-950">
          ⭐
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Lesson complete!</h2>
        <p className="max-w-sm text-sm text-zinc-500">
          Your progress has been saved and XP awarded. Move on to the next lesson or
          keep reviewing.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => { setSaved(false); router.refresh(); }}>
            Review the lesson
          </Button>
          <Button variant="outline" href={`/levels/${level}`}>
            Back to level
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            Grammar lesson
          </span>
          <h1 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{topic.title}</h1>
          {topic.bookChapters ? (
            <p className="mt-1 text-xs text-zinc-400">Reference: {topic.bookChapters}</p>
          ) : null}
        </div>
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
            {paragraph}
          </p>
        ))}
        {topic.examples.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-left dark:bg-zinc-900">
                <tr>
                  <th className="px-3 py-2 font-medium text-zinc-500">French</th>
                  <th className="px-3 py-2 font-medium text-zinc-500">English</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {topic.examples.map((ex, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 font-medium text-zinc-900 dark:text-zinc-100">{ex.fr}</td>
                    <td className="px-3 py-2 text-zinc-500">{ex.en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>

      {topic.exercises.length > 0 ? (
        <ExerciseManager exercises={topic.exercises} onFinished={handleFinished} />
      ) : (
        <Card>
          <p className="text-sm text-zinc-500">No exercises for this lesson.</p>
        </Card>
      )}
    </div>
  );
}