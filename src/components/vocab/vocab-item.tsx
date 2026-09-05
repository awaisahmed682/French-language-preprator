"use client";

import { useState } from "react";
import type { VocabularyItem } from "@/lib/types";
import { scheduleSrsItems } from "@/actions/srs";
import type { SrsItemType } from "@prisma/client";
import { SpeakButton } from "@/components/speech/speak-button";
import { Button } from "@/components/ui/primitives";

export function VocabItem({ item }: { item: VocabularyItem }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className="flex w-full flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <span className="font-medium text-zinc-900 dark:text-zinc-50">
        {item.fr}
        {item.ipa ? <span className="ml-1 text-xs font-normal text-zinc-400">/{item.ipa}/</span> : null}
      </span>
      <span className="text-sm text-zinc-500">
        {flipped ? item.example || item.en : "…"}
      </span>
      <span className={`text-sm ${flipped ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`}>
        {item.en}
      </span>
      {item.example ? (
        <span className="text-xs italic text-zinc-400 dark:text-zinc-500">
          {item.example}
          {item.exampleEn ? ` — ${item.exampleEn}` : ""}
        </span>
      ) : null}
    </button>
  );
}

export function VocabActions({
  item,
  itemId,
  type = "VOCAB",
  level = "A1",
  compact = true,
}: {
  item: VocabularyItem;
  itemId: string;
  type?: SrsItemType;
  level?: string;
  compact?: boolean;
}) {
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <div className={`flex ${compact ? "gap-1.5" : "gap-2"} items-center`}>
      <SpeakButton text={item.fr} label={compact ? "" : "Listen"} size="sm" />
      <Button
        size="sm"
        variant="outline"
        disabled={added || busy}
        onClick={async () => {
          setBusy(true);
          try {
            await scheduleSrsItems([{ itemId, itemType: type, level: level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2" }]);
            setAdded(true);
          } finally {
            setBusy(false);
          }
        }}
      >
        {added ? "✓" : compact ? "➕" : "Add"}
      </Button>
    </div>
  );
}