import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getLevelContent } from "@/lib/content";
import { LEVEL_ORDER, type Level } from "@/lib/types";
import { TextTaskRunner } from "@/components/exercise/text-task-runner";

type Params = { level: string };

export default async function ReadingPage({ params }: { params: Promise<Params> }) {
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
          Reading comprehension — {level}
        </h1>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
          Read each passage, then answer the questions.
        </p>
      </div>

      {content.reading.map((passage) => (
        <TextTaskRunner
          key={passage.id}
          level={level}
          title={passage.title}
          body={passage.text}
          questions={passage.questions}
        />
      ))}
    </div>
  );
}