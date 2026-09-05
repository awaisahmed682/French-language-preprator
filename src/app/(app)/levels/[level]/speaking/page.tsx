import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getLevelContent } from "@/lib/content";
import { LEVEL_ORDER, type Level } from "@/lib/types";
import { SpeakingPromptCard } from "@/components/community/speaking-prompt-card";

type Params = { level: string };

export default async function SpeakingPage({ params }: { params: Promise<Params> }) {
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
          Speaking — {level}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Record yourself for each scenario; your transcript is shared with the community.
        </p>
      </div>

      {content.speakingPrompts.map((prompt) => (
        <SpeakingPromptCard
          key={prompt.id}
          title={prompt.title}
          scenario={prompt.scenario}
          hint={prompt.hint}
          level={level}
        />
      ))}
    </div>
  );
}