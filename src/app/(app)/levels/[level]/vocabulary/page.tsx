import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getLevelContent } from "@/lib/content";
import { LEVEL_ORDER, type Level } from "@/lib/types";
import { SpeakButton } from "@/components/speech/speak-button";
import { VocabItem, VocabActions } from "@/components/vocab/vocab-item";

type Params = { level: string };

export default async function VocabularyPage({ params }: { params: Promise<Params> }) {
  const { level: slug } = await params;
  const level = slug.toUpperCase() as Level;
  if (!LEVEL_ORDER.includes(level)) notFound();
  await requireSession();

  const content = getLevelContent(level);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/levels/${slug}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
          ← Level {level}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Vocabulary — {level}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Click a card to reveal an example. Listen to the words and add them to spaced review.
        </p>
      </div>

      {content.vocabulary.map((theme) => (
        <section key={theme.theme} className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {theme.theme}
            <span className="text-xs font-normal text-zinc-400">
              {theme.items.length} words
            </span>
          </h2>
          <div className="grid gap-3 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {theme.items.map((item, i) => (
              <div key={`${theme.theme}-${i}`} className="relative flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <VocabItem item={item} />
                <div className="flex justify-end">
                  <VocabActions
                    item={item}
                    itemId={`${level.toLowerCase()}-${theme.theme.toLowerCase().replace(/\s+/g, "-")}-${i}`}
                    type="VOCAB"
                    level={level}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Useful phrases</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.phrases.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{p.fr}</p>
                <p className="text-sm text-zinc-500">{p.en}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <SpeakButton text={p.fr} label="" size="sm" />
                <VocabActions
                  item={p}
                  itemId={`${level.toLowerCase()}-phrase-${i}`}
                  type="PHRASE"
                  level={level}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}