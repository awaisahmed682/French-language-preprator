"use client";

import { useEffect, useState } from "react";
import type { Level, TestDefinition } from "@/lib/types";
import { normalizeInput, levenshtein } from "@/lib/utils";
import { submitCertificationTest, type TestResult } from "@/actions/tests";
import { mcqPoints } from "@/lib/utils";
import { SpeakButton } from "@/components/speech/speak-button";
import { useSpeechRecognition } from "@/components/speech/use-speech-recognition";
import { Button, Card, ProgressBar, inputCls } from "@/components/ui/primitives";

function similarity(a: string, b: string): number {
  const x = normalizeInput(a);
  const y = normalizeInput(b);
  if (!x || !y) return 0;
  if (x === y) return 100;
  const dist = levenshtein(x, y);
  const maxLen = Math.max(x.length, y.length);
  return Math.max(0, Math.round((1 - dist / maxLen) * 100));
}

export interface TestSectionInput {
  listening: { score: number; max: number; answered: number };
  reading: { score: number; max: number; answered: number };
  writing: { score: number; max: number; answered: number };
  speaking: { score: number; max: number; answered: number };
  pronunciation: { score: number; max: number; answered: number };
}

export function TestRunner({ level, test }: { level: Level; test: TestDefinition }) {
  const [listenAnswers, setListenAnswers] = useState<Record<string, number>>({});
  const [readAnswers, setReadAnswers] = useState<Record<string, number>>({});
  const [writingTexts, setWritingTexts] = useState<Record<string, string>>({});
  const [speakingTexts, setSpeakingTexts] = useState<Record<string, string>>({});
  const [pronScores, setPronScores] = useState<Record<string, number>>({});
  const [pronCtx, setPronCtx] = useState<string | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [activePart, setActivePart] = useState<"listen" | "read" | "write" | "speak" | "pron">(
    "listen"
  );

  const listenDone = test.listening.length > 0 && Object.keys(listenAnswers).length >= test.listening.length;
  const readDone = test.reading.length > 0 && Object.keys(readAnswers).length >= test.reading.length;
  const writeDone = test.writing.length > 0 && test.writing.every((t) => (writingTexts[t.id] ?? "").trim().length > 0);
  const speakDone = test.speaking.length > 0 && test.speaking.every((s) => (speakingTexts[s.id] ?? "").trim().length > 0);
  const pronDone = test.pronunciation.length > 0 && Object.keys(pronScores).length >= test.pronunciation.length;
  const allDone = listenDone && readDone && writeDone && speakDone && pronDone;

  const totalAnswered =
    Object.keys(listenAnswers).length +
    Object.keys(readAnswers).length +
    Object.keys(writingTexts).length +
    Object.keys(speakingTexts).length +
    Object.keys(pronScores).length;
  const totalQuestions =
    test.listening.length +
    test.reading.length +
    test.writing.length +
    test.speaking.length +
    test.pronunciation.length;

  const listeningMax = mcqPoints(test.listening.length);
  const readingMax = mcqPoints(test.reading.length);
  const writingMax = test.writing.length * 20;
  const speakingMax = test.speaking.length * 20;
  const pronMax = 100;

  if (result) {
    return (
      <Card className="flex flex-col items-center gap-4 py-10 text-center">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full text-4xl ${
            result.passed ? "bg-emerald-100 dark:bg-emerald-950" : "bg-rose-100 dark:bg-rose-950"
          }`}
        >
          {result.passed ? "🏅" : "😕"}
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {result.passed ? `${level} certificate earned!` : "Test not passed"}
        </h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-200">
          Score: <strong>{result.total}</strong> / {result.max} — passing threshold:{" "}
          {result.passing}
        </p>
        <ProgressBar value={result.total} max={result.max} className="max-w-sm" />
        <div className="grid w-full max-w-md grid-cols-2 gap-2 text-left text-sm sm:grid-cols-3">
          {(
            [
              ["Listening", result.skillBreakdown.listening, mcqPoints(test.listening.length)],
              ["Reading", result.skillBreakdown.reading, mcqPoints(test.reading.length)],
              ["Writing", result.skillBreakdown.writing, test.writing.length * 20],
              ["Speaking", result.skillBreakdown.speaking, test.speaking.length * 20],
              ["Pronunciation", result.skillBreakdown.pronunciation, 100],
            ] as const
          ).map(([label, score, max]) => (
            <div key={label} className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
              <p className="text-xs text-zinc-400">{label}</p>
              <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                {score} / {max}
              </p>
            </div>
          ))}
        </div>
        {result.certificateId ? (
          <p className="max-w-md text-sm text-zinc-700 dark:text-zinc-200">
            Next level unlocked! Your certificate is saved to your profile.
          </p>
        ) : null}
        <Button href={`/levels/${level.toLowerCase()}`}>Back to level {level}</Button>
      </Card>
    );
  }

  const submit = async () => {
    if (!allDone) {
      const firstIncomplete = parts.find((p) => !p.done);
      if (firstIncomplete) setActivePart(firstIncomplete.id);
      setHint(
        "Complete every section — listening, reading, writing, speaking and pronunciation — before submitting."
      );
      return;
    }
    setHint(null);
    setSubmitting(true);
    try {
      const sections: TestSectionInput = {
        listening: { score: Object.entries(listenAnswers).reduce((s, [id, a]) => s + (a === test.listening.find((q) => q.id === id)?.answer ? 10 : 0), 0), max: listeningMax, answered: Object.keys(listenAnswers).length },
        reading: { score: Object.entries(readAnswers).reduce((s, [id, a]) => s + (a === test.reading.find((q) => q.id === id)?.answer ? 10 : 0), 0), max: readingMax, answered: Object.keys(readAnswers).length },
        writing: {
          score: test.writing.reduce((s, t) => {
            const words = (writingTexts[t.id] ?? "").trim().split(/\s+/).filter(Boolean).length;
            return s + (words >= t.minWords ? 20 : (writingTexts[t.id] ?? "").trim() ? 5 : 0);
          }, 0),
          max: writingMax,
          answered: test.writing.filter((t) => (writingTexts[t.id] ?? "").trim().length > 0).length,
        },
        speaking: {
          score: test.speaking.reduce((s, t) => {
            const words = (speakingTexts[t.id] ?? "").trim().split(/\s+/).filter(Boolean).length;
            return s + (words >= 10 ? 20 : (speakingTexts[t.id] ?? "").trim() ? 5 : 0);
          }, 0),
          max: speakingMax,
          answered: test.speaking.filter((s) => (speakingTexts[s.id] ?? "").trim().length > 0).length,
        },
        pronunciation: {
          score: Object.keys(pronScores).length
            ? Math.round(Object.values(pronScores).reduce((a, b) => a + b, 0) / Object.keys(pronScores).length)
            : 0,
          max: pronMax,
          answered: Object.keys(pronScores).length,
        },
      };
      const res = await submitCertificationTest(level, sections);
      if ("error" in res) {
        setHint(res.error);
        return;
      }
      setResult(res);
    } finally {
      setSubmitting(false);
    }
  };

  const parts = [
    { id: "listen", label: "Listening", total: test.listening.length, done: listenDone },
    { id: "read", label: "Reading", total: test.reading.length, done: readDone },
    { id: "write", label: "Writing", total: test.writing.length, done: writeDone },
    { id: "speak", label: "Speaking", total: test.speaking.length, done: speakDone },
    { id: "pron", label: "Pronunciation", total: test.pronunciation.length, done: pronDone },
  ] as const;

  const curIdx = parts.findIndex((p) => p.id === activePart);
  const nextPart = parts[curIdx + 1];

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-bold text-zinc-900 dark:text-zinc-50">
            Certification test {level}
          </h2>
          <span className="text-xs text-zinc-700 dark:text-zinc-200">
            {totalAnswered} / {totalQuestions} responses
          </span>
        </div>
        <ProgressBar value={totalAnswered} max={Math.max(1, totalQuestions)} />
        <div className="flex flex-wrap gap-2">
          {parts.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePart(p.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                activePart === p.id
                  ? "bg-indigo-600 text-white"
                  : p.done
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {p.label} {p.done ? "✓" : ""}
            </button>
          ))}
        </div>
      </Card>

      {activePart === "listen" || activePart === "read" ? (
        <div className="flex flex-col gap-4">
          {(activePart === "listen" ? test.listening : test.reading).map((q, i) => {
            const answers = activePart === "listen" ? listenAnswers : readAnswers;
            const setAnswers = activePart === "listen" ? setListenAnswers : setReadAnswers;
            const selected = answers[q.id];
            return (
              <Card key={q.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                    {activePart === "listen" ? "Listening" : "Reading"} — Question {i + 1}
                  </span>
                  {selected !== undefined ? (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-300">Answered ✓</span>
                  ) : null}
                </div>
                {activePart === "listen" && q.audio ? (
                  <SpeakButton text={q.audio} label="▶ Listen to the audio" variant="primary" />
                ) : null}
                <p className="text-sm font-medium leading-relaxed text-zinc-900 dark:text-zinc-100">
                  {q.prompt}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: oi }))
                      }
                      className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                        selected === oi
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-200"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                      }`}
                    >
                      {String.fromCharCode(97 + oi)}) {opt}
                    </button>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}

      {activePart === "write" ? (
        <div className="flex flex-col gap-4">
          {test.writing.map((task, i) => {
            const body = writingTexts[task.id] ?? "";
            const words = body.trim().split(/\s+/).filter(Boolean).length;
            return (
              <Card key={task.id} className="flex flex-col gap-3">
                <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Writing — Task {i + 1}
                </span>
                <p className="text-sm font-medium leading-relaxed text-zinc-900 dark:text-zinc-100">
                  {task.title} — {task.prompt}
                </p>
                <p className="text-xs text-zinc-400">Minimum {task.minWords} words.</p>
                <textarea
                  className={inputCls + " min-h-32 resize-y"}
                  placeholder="Your answer…"
                  value={body}
                  onChange={(e) =>
                    setWritingTexts((prev) => ({ ...prev, [task.id]: e.target.value }))
                  }
                />
                <span className={`text-xs ${words >= task.minWords ? "text-emerald-600 dark:text-emerald-300" : "text-zinc-400"}`}>
                  {words} / {task.minWords} words
                </span>
              </Card>
            );
          })}
        </div>
      ) : null}

      {activePart === "speak" ? (
        <SpeakingTasks level={level} test={test} speakingTexts={speakingTexts} setSpeakingTexts={setSpeakingTexts} />
      ) : null}

      {activePart === "pron" ? (
        <PronCoach
          test={test}
          pronScores={pronScores}
          setPronScores={setPronScores}
          pronCtx={pronCtx}
          setPronCtx={setPronCtx}
        />
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3">
        {nextPart && parts[curIdx]?.done ? (
          <Button variant="secondary" onClick={() => setActivePart(nextPart.id)}>
            Continue to {nextPart.label} →
          </Button>
        ) : hint ? (
          <p className="max-w-md text-sm text-rose-600 dark:text-rose-400">{hint}</p>
        ) : (
          <p className="max-w-md text-sm text-zinc-400">
            {allDone ? "All sections completed — your test is ready to submit." : "Complete every section to submit your test."}
          </p>
        )}
        <Button size="lg" onClick={submit} disabled={submitting} className="self-end">
          {submitting ? "Grading…" : "Submit test"}
        </Button>
      </div>
    </div>
  );
}

function SpeakingTasks({
  test,
  speakingTexts,
  setSpeakingTexts,
}: {
  level: string;
  test: TestDefinition;
  speakingTexts: Record<string, string>;
  setSpeakingTexts: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
}) {
  const { listening, result, start, stop, error, supported } = useSpeechRecognition("fr-FR");
  const [activeId, setActiveId] = useState<string | null>(null);

  const append = (id: string, text: string) => {
    setSpeakingTexts((prev) => ({
      ...prev,
      [id]: prev[id] ? `${prev[id]} ${text}` : text,
    }));
  };

  useEffect(() => {
    if (result && result.transcript && activeId) {
      append(activeId, result.transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <div className="flex flex-col gap-4">
      {error ? (
        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
      ) : null}
      {!supported ? (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Speech recognition isn&apos;t available in this browser — type your spoken answer below to complete
          the speaking section.
        </p>
      ) : null}
      {test.speaking.map((task, i) => {
        const words = (speakingTexts[task.id] ?? "").trim().split(/\s+/).filter(Boolean).length;
        return (
          <Card key={task.id} className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Speaking — Task {i + 1}
            </span>
            <p className="text-sm font-medium leading-relaxed text-zinc-900 dark:text-zinc-100">
              {task.prompt}
            </p>
            <p className="text-xs text-zinc-400">Tip: {task.hint}</p>
            {supported ? (
              <div className="flex items-center gap-2">
                {activeId === task.id && listening ? (
                  <Button variant="outline" onClick={stop}>⏹ Stop</Button>
                ) : (
                  <Button
                    onClick={() => {
                      setActiveId(task.id);
                      start();
                    }}
                  >
                    🎤 Record
                  </Button>
                )}
                {listening && activeId === task.id ? (
                  <span className="text-sm text-rose-600 dark:text-rose-300">● Recording…</span>
                ) : null}
              </div>
            ) : null}
            {activeId === task.id && !listening && result?.transcript ? (
              <p className="text-xs text-zinc-400">Last fragment: « {result.transcript} »</p>
            ) : null}
            <textarea
              className={inputCls + " min-h-24 resize-y"}
              placeholder="Transcript (you can also type it)…"
              value={speakingTexts[task.id] ?? ""}
              onChange={(e) =>
                setSpeakingTexts((prev) => ({ ...prev, [task.id]: e.target.value }))
              }
            />
            <span className={`text-xs ${words >= 10 ? "text-emerald-600 dark:text-emerald-300" : "text-zinc-400"}`}>
              {words} words captured
            </span>
          </Card>
        );
      })}
    </div>
  );
}

function PronCoach({
  test,
  pronScores,
  setPronScores,
  pronCtx,
  setPronCtx,
}: {
  test: TestDefinition;
  pronScores: Record<string, number>;
  setPronScores: (fn: (prev: Record<string, number>) => Record<string, number>) => void;
  pronCtx: string | null;
  setPronCtx: (v: string | null) => void;
}) {
  const { listening, result, start, stop, error, supported } = useSpeechRecognition("fr-FR");
  const [typed, setTyped] = useState<Record<string, string>>({});

  useEffect(() => {
    if (result && result.transcript && pronCtx) {
      const q = test.pronunciation.find((p) => p.id === pronCtx);
      if (q) {
        setPronScores((prev) => ({ ...prev, [q.id]: similarity(q.word, result.transcript) }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, pronCtx]);

  return (
    <div className="flex flex-col gap-4">
      {error ? (
        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
      ) : null}
      {!supported ? (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Speech recognition isn&apos;t available in this browser — type each word below to complete the
          pronunciation section.
        </p>
      ) : null}
      {test.pronunciation.map((q, i) => {
        const score = pronScores[q.id];
        return (
          <Card key={q.id} className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Pronunciation — Word {i + 1}
              </span>
              {score !== undefined ? (
                <span
                  className={`text-xs font-bold ${
                    score >= 80 ? "text-emerald-600 dark:text-emerald-300" : score >= 50 ? "text-amber-600 dark:text-amber-300" : "text-rose-600 dark:text-rose-300"
                  }`}
                >
                  {score}/100
                </span>
              ) : null}
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{q.word}</p>
            {q.ipa ? <p className="text-sm text-zinc-400">/{q.ipa}/</p> : null}
            <div className="flex items-center gap-2">
              <SpeakButton text={q.word} label="Listen" variant="outline" />
              {supported ? (
                pronCtx === q.id && listening ? (
                  <Button variant="outline" onClick={stop}>⏹ Stop</Button>
                ) : (
                  <Button
                    onClick={() => {
                      setPronCtx(q.id);
                      start();
                    }}
                  >
                    🎤 Pronounce
                  </Button>
                )
              ) : null}
            </div>
            {pronCtx === q.id && !listening && result?.transcript ? (
              <p className="text-sm text-zinc-700 dark:text-zinc-200">You said: « {result.transcript} »</p>
            ) : null}
            <input
              className={inputCls}
              placeholder="Or type the word…"
              value={typed[q.id] ?? ""}
              onChange={(e) => {
                const text = e.target.value;
                setTyped((prev) => ({ ...prev, [q.id]: text }));
                if (text.trim()) {
                  setPronScores((prev) => ({ ...prev, [q.id]: similarity(q.word, text) }));
                }
              }}
            />
          </Card>
        );
      })}
    </div>
  );
}