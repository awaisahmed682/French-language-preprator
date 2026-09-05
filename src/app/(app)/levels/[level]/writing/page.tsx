import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getLevelContent } from "@/lib/content";
import { LEVEL_ORDER, type Level } from "@/lib/types";
import { WritingPromptCard } from "@/components/community/writing-prompt-card";

type Params = { level: string };

export default async function WritingPage({ params }: { params: Promise<Params> }) {
  const { level: slug } = await params;
  const level = slug.toUpperCase() as Level;
  if (!LEVEL_ORDER.includes(level)) notFound();
  await requireSession();

  const content = getLevelContent(level);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/levels/${slug}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300">
          ← Level {level}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Writing — {level}
        </h1>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
          Write your texts, then share them to get community feedback.
        </p>
      </div>

      {content.writingPrompts.map((prompt) => (
        <WritingPromptCard
          key={prompt.id}
          title={prompt.title}
          task={prompt.task}
          minWords={prompt.minWords}
          level={level}
        />
      ))}
    </div>
  );
}