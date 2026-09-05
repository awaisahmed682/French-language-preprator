"use client";

import { useCallback, useMemo, useState } from "react";
import type { Phoneme } from "@/lib/types";
import { normalizeInput, levenshtein } from "@/lib/utils";
import { recordSpeakingActivity } from "@/actions/progress";
import { useSpeechRecognition } from "./use-speech-recognition";
import { SpeakButton } from "./speak-button";
import { Button, Card, ProgressBar } from "@/components/ui/primitives";

function similarity(a: string, b: string): number {
  const x = normalizeInput(a);
  const y = normalizeInput(b);
  if (!x || !y) return 0;
  if (x === y) return 100;
  const dist = levenshtein(x, y);
  const maxLen = Math.max(x.length, y.length);
  return Math.max(0, Math.round((1 - dist / maxLen) * 100));
}

export function PronunciationPractice({
  phonemes,
  minimalPairs,
  level,
}: {
  phonemes: Phoneme[];
  minimalPairs: { a: string; b: string }[];
  level: string;
}) {
  const words = useMemo(() => {
    const set = new Map<string, string>();
    for (const p of phonemes) {
      for (const ex of p.examples) {
        if (!set.has(ex)) set.set(ex, p.symbol);
      }
    }
    for (const pair of minimalPairs) {
      if (!set.has(pair.a)) set.set(pair.a, "");
      if (!set.has(pair.b)) set.set(pair.b, "");
    }
    return [...set.entries()];
  }, [phonemes, minimalPairs]);

  const [index, setIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [grade, setGrade] = useState<number | null>(null);

  const current = words[index];
  const done = index >= words.length;

  const gradeCurrent = useCallback(
    async (heard: string) => {
      if (!current || !heard || grade !== null) return;
      const score = similarity(current[0], heard);
      setGrade(score);
      setScores((s) => [...s, score]);
      await recordSpeakingActivity(
        level.toUpperCase() as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
        current[0],
        score
      );
    },
    [current, grade, level]
  );

  const { supported, listening, result, start, stop } = useSpeechRecognition(
    "fr-FR",
    (res) => {
      gradeCurrent(res.transcript);
    }
  );

  if (!supported) {
    return (
      <Card>
        <p className="text-sm text-zinc-500">
          Your browser doesn&apos;t support speech recognition. You can still listen and repeat aloud.
        </p>
      </Card>
    );
  }

  if (done) {
    const avg = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    return (
      <Card className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-3xl dark:bg-indigo-950">
          🎉
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Pronunciation session complete
        </h3>
        <p className="text-sm text-zinc-500">
          Average score: <strong>{avg}%</strong> over {words.length} words
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {scores.map((s, i) => (
            <span
              key={i}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                s >= 80
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950"
                  : s >= 50
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-950"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
        <Button
          onClick={() => {
            setIndex(0);
            setScores([]);
            setGrade(null);
          }}
        >
          Restart
        </Button>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col items-center gap-4 text-center">
      <span className="text-xs text-zinc-400">
        Word {Math.min(index + 1, words.length)} / {words.length}
      </span>
      <div>
        <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{current[0]}</span>
        {current[1] ? (
          <p className="mt-1 text-sm text-zinc-400">Phoneme: /{current[1]}/</p>
        ) : null}
      </div>
      <SpeakButton text={current[0]} label="Listen to the model" size="md" variant="primary" />
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-zinc-500">
          {listening
            ? "🎤 Listening… say the word, then stop."
            : "Press Record, then say the word aloud."}
        </p>
        <div className="flex gap-2">
          {!listening ? (
            <Button size="md" variant="primary" onClick={() => { setGrade(null); start(); }}>
              🎤 Record
            </Button>
          ) : (
            <Button size="md" variant="outline" onClick={stop}>
              ⏹ Stop
            </Button>
          )}
        </div>
      </div>
      {result && !listening ? (
        <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-300">
          You said: « {result.transcript} » (confidence {Math.round(result.confidence * 100)}%)
        </p>
      ) : null}
      {grade !== null ? (
        <div className="w-full max-w-xs">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-zinc-500">Result</span>
            <span
              className={
                grade >= 80
                  ? "text-emerald-600"
                  : grade >= 50
                    ? "text-amber-600"
                    : "text-rose-600"
              }
            >
              {grade >= 80 ? "Excellent!" : grade >= 50 ? "Not bad" : "Try again"}
            </span>
          </div>
          <ProgressBar value={grade} max={100} />
        </div>
      ) : null}
      <div className="flex w-full items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <Button
          variant="ghost"
          disabled={index === 0}
          onClick={() => {
            setIndex((i) => Math.max(0, i - 1));
            setGrade(null);
          }}
        >
          ← Previous
        </Button>
        <Button
          disabled={grade === null}
          onClick={() => {
            setGrade(null);
            setIndex((i) => i + 1);
          }}
        >
          {index < words.length - 1 ? "Next →" : "Finish"}
        </Button>
      </div>
    </Card>
  );
}