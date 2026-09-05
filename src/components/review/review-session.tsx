"use client";

import { useState } from "react";
import { reviewSrsItem } from "@/actions/srs";
import type { SrsItemType } from "@prisma/client";
import { SpeakButton } from "@/components/speech/speak-button";
import { Button, Card } from "@/components/ui/primitives";

export interface ReviewCard {
  itemId: string;
  itemType: SrsItemType;
  front: string;
  back: string;
}

const QUALITY = [
  { q: 1, label: "Again", color: "bg-rose-500 hover:bg-rose-600" },
  { q: 3, label: "Hard", color: "bg-amber-500 hover:bg-amber-600" },
  { q: 4, label: "Good", color: "bg-emerald-500 hover:bg-emerald-600" },
  { q: 5, label: "Easy", color: "bg-indigo-500 hover:bg-indigo-600" },
];

export function ReviewSession({ cards }: { cards: ReviewCard[] }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState(false);

  if (cards.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="text-4xl">🎉</span>
        <p className="text-sm text-zinc-500">Nothing to review right now!</p>
        <p className="text-xs text-zinc-400">
          Add vocabulary from the level pages to fill your review queue.
        </p>
      </Card>
    );
  }

  if (index >= cards.length) {
    return (
      <Card className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="text-4xl">🏁</span>
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Review complete!</p>
        <p className="text-sm text-zinc-500">
          {cards.length} cards reviewed. Easy cards will come back later; the others
          will return soon.
        </p>
      </Card>
    );
  }

  const card = cards[index];

  const rate = async (quality: number) => {
    setBusy(true);
    try {
      await reviewSrsItem(card.itemId, card.itemType, quality);
      setRevealed(false);
      setIndex((i) => i + 1);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="mx-auto flex max-w-2xl flex-col gap-5">
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>
          Card {Math.min(index + 1, cards.length)} / {cards.length}
        </span>
        <span className="text-xs text-zinc-400">
          {card.itemType === "VOCAB"
            ? "Vocabulary"
            : card.itemType === "PHRASE"
              ? "Phrase"
              : card.itemType === "GRAMMAR"
                ? "Grammar"
                : "Phoneme"}
        </span>
      </div>
      <div className="flex flex-col items-center gap-4 rounded-xl bg-zinc-50 p-8 text-center dark:bg-zinc-900">
        {card.itemType === "GRAMMAR" ? (
          <p className="text-base font-medium text-zinc-700 dark:text-zinc-200">{card.front}</p>
        ) : (
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{card.front}</p>
        )}
        {revealed ? (
          <div className="flex flex-col items-center gap-2">
            {card.itemType !== "GRAMMAR" ? (
              <SpeakButton text={card.front} label="" />
            ) : null}
            <p className="text-sm text-zinc-500">{card.back}</p>
          </div>
        ) : (
          <Button
            onClick={() => {
              setRevealed(true);
            }}
            variant="outline"
          >
            Show answer
          </Button>
        )}
      </div>
      {revealed ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {QUALITY.map((q) => (
            <button
              key={q.q}
              onClick={() => rate(q.q)}
              disabled={busy}
              className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition ${q.color} disabled:opacity-50`}
            >
              {q.label}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center text-xs text-zinc-400">
          Recall the word/phrase, then reveal the answer to rate yourself.
        </p>
      )}
      <div className="flex justify-between text-xs text-zinc-400">
        <span>Tip: « Again » → 1 day · « Easy » → longer interval.</span>
      </div>
    </Card>
  );
}