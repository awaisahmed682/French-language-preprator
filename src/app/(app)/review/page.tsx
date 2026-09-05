import { getDueSrsItems } from "@/actions/srs";
import { LEVEL_CONTENTS } from "@/lib/content";
import type { Level } from "@/lib/types";
import { ReviewSession, type ReviewCard } from "@/components/review/review-session";

type SrsItemType = "VOCAB" | "GRAMMAR" | "PHRASE" | "PHONEME";

function resolveItem(itemId: string, itemType: SrsItemType): { front: string; back: string } {
  for (const level of Object.keys(LEVEL_CONTENTS) as Level[]) {
    const content = LEVEL_CONTENTS[level];
    const prefix = level.toLowerCase();

    if (itemType === "GRAMMAR") {
      const topic = content.grammar.find((t) => t.id === itemId);
      if (topic) {
        return { front: topic.title, back: topic.explanation };
      }
      continue;
    }

    const m = itemId.match(new RegExp(`^${prefix}-(.+?)-(\\d+)$`));
    if (m) {
      const themeSlug = m[1];
      const idx = Number(m[2]);

      if (itemType === "PHRASE" && themeSlug === "phrase") {
        return {
          front: content.phrases[idx]?.fr ?? itemId,
          back: content.phrases[idx]?.en ?? "",
        };
      }
      if (itemType === "VOCAB") {
        for (const theme of content.vocabulary) {
          if (theme.theme.toLowerCase().replace(/\s+/g, "-") === themeSlug) {
            const item = theme.items[idx];
            if (item) {
              return {
                front: item.fr,
                back: `${item.en}${item.example ? ` — ${item.example}` : ""}`,
              };
            }
          }
        }
      }
    }
  }
  return { front: itemId, back: "" };
}

export default async function ReviewPage() {
  const due = await getDueSrsItems(30);
  const cards: ReviewCard[] = due
    .map((d) => {
      const resolved = resolveItem(d.itemId, d.itemType as SrsItemType);
      return {
        itemId: d.itemId,
        itemType: d.itemType as SrsItemType,
        front: resolved.front,
        back: resolved.back,
      };
    })
    .filter((c) => c.front && c.back);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Spaced review</h1>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
          {cards.length} card(s) due today. Spaced repetition helps you
          lock in vocabulary.
        </p>
      </div>
      <ReviewSession cards={cards} />
    </div>
  );
}