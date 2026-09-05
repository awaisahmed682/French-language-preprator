"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitWriting, reviewSubmission } from "@/actions/community";
import { SpeakButton } from "@/components/speech/speak-button";
import { Button, Card, inputCls } from "@/components/ui/primitives";

export interface CommunityRow {
  id: string;
  kind: string;
  content: string;
  level: string;
  status: string;
  feedback?: string | null;
  feedbackScore?: number | null;
  author: string;
  createdAt: string;
}

export function CommunityPanel({
  submissions,
  mySubmissions,
  level,
}: {
  submissions: CommunityRow[];
  mySubmissions: CommunityRow[];
  level: string;
}) {
  const [tab, setTab] = useState<"feed" | "mine" | "write">("feed");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<string | null>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  const publish = async () => {
    setBusy(true);
    setOutcome(null);
    try {
      const res = await submitWriting(text, level.toUpperCase() as "A1" | "A2" | "B1" | "B2" | "C1" | "C2");
      setOutcome(res.error ? res.error : `Sent ✓ (${res.id})`);
      if (!res.error) {
        setText("");
        startTransition(() => router.refresh());
      }
    } finally {
      setBusy(false);
    }
  };

  const review = async (id: string, score: number, feedback: string) => {
    const res = await reviewSubmission(id, feedback, score);
    if (res.error) setOutcome(res.error);
    else {
      setOutcome("Review published! +5 reputation.");
      startTransition(() => router.refresh());
    }
  };

  const tabs = [
    { id: "feed" as const, label: "Discover" },
    { id: "mine" as const, label: "My posts" },
    { id: "write" as const, label: "Write a text" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              tab === t.id
                ? "bg-indigo-600 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {outcome ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          {outcome}
        </p>
      ) : null}

      {tab === "write" ? (
        <Card className="flex flex-col gap-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Share a text (min. 20 characters) — tell us about yourself, a trip, your tastes…
          </label>
          <textarea
            className={inputCls + " min-h-40 resize-y"}
            placeholder="Write in French…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div>
            <Button onClick={publish} disabled={busy || text.trim().length < 20}>
              {busy ? "Sending…" : "Publish (+15 XP)"}
            </Button>
          </div>
        </Card>
      ) : null}

      {(tab === "feed" ? submissions : mySubmissions).length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-500">
            {tab === "mine"
              ? "You haven't published anything yet."
              : "No posts yet. Be the first!"}
          </p>
        </Card>
      ) : (
        (tab === "feed" ? submissions : mySubmissions).map((s) => (
          <Card key={s.id} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-zinc-800 dark:text-zinc-100">{s.author}</span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-500 dark:bg-zinc-800">
                {s.level}
              </span>
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-500 dark:bg-zinc-800">
                {s.kind === "writing" ? "writing" : "speaking"}
              </span>
              {s.status === "pending" ? (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  awaiting review
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  rating: {s.feedbackScore ?? "–"}
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-100">{s.content}</p>
            {s.feedback ? (
              <p className="text-sm text-zinc-500 italic">« {s.feedback} »</p>
            ) : null}
            <SpeakButton text={s.content.slice(0, 400)} label="Listen" />
            {tab === "feed" && s.status === "pending" ? (
              <ReviewForm onReview={(score, feedback) => review(s.id, score, feedback)} />
            ) : null}
          </Card>
        ))
      )}
    </div>
  );
}

function ReviewForm({ onReview }: { onReview: (score: number, feedback: string) => void }) {
  const [score, setScore] = useState(75);
  const [feedback, setFeedback] = useState("");
  return (
    <div className="flex flex-col gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
      <p className="text-xs font-medium text-zinc-500">Give feedback (published + reputation)</p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs text-zinc-400">
          Rating
          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="ml-2 align-middle"
          />
          <span className="ml-1 font-semibold text-zinc-700">{score}</span>
        </label>
        <input
          className={inputCls + " flex-1"}
          placeholder="A constructive comment in French…"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <Button
          size="sm"
          disabled={!feedback.trim()}
          onClick={() => {
            onReview(score, feedback);
            setFeedback("");
          }}
        >
          Publish review
        </Button>
      </div>
    </div>
  );
}