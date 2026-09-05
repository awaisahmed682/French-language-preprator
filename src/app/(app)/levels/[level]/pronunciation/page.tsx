import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getLevelContent } from "@/lib/content";
import { LEVEL_ORDER, type Level } from "@/lib/types";
import { Card } from "@/components/ui/primitives";
import { SpeakButton } from "@/components/speech/speak-button";
import { PronunciationPractice } from "@/components/speech/pronunciation-practice";

type Params = { level: string };

export default async function PronunciationPage({ params }: { params: Promise<Params> }) {
  const { level: slug } = await params;
  const level = slug.toUpperCase() as Level;
  if (!LEVEL_ORDER.includes(level)) notFound();
  await requireSession();

  const content = getLevelContent(level);
  const pron = content.pronunciation;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/levels/${slug}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
          ← Level {level}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Pronunciation — {level}
        </h1>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          🧭 Pronunciation rules
        </h2>
        <Card>
          <ul className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-200">
            {pron.rules.map((rule, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-indigo-500">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          🔡 French phonemes
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pron.phonemes.map((ph) => (
            <Card key={ph.symbol} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-mono text-lg font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  /{ph.symbol}/
                </span>
                <span className="text-sm font-medium text-zinc-500">{ph.name}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ph.examples.map((ex) => (
                  <SpeakButton key={ex} text={ex} label={ex} size="sm" variant="outline" />
                ))}
              </div>
              {ph.note ? <p className="text-xs text-zinc-400">{ph.note}</p> : null}
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          🎯 Minimal pairs
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pron.minimalPairs.map((pair, i) => (
            <Card key={i} className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm text-zinc-800 dark:text-zinc-100">
                {pair.a} <span className="text-zinc-400">/</span> {pair.b}
              </span>
              <div className="flex gap-1.5">
                <SpeakButton text={pair.a} label="" size="sm" />
                <SpeakButton text={pair.b} label="" size="sm" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          🎤 Speaking practice
        </h2>
        <PronunciationPractice
          phonemes={pron.phonemes}
          minimalPairs={pron.minimalPairs}
          level={level}
        />
      </section>
    </div>
  );
}