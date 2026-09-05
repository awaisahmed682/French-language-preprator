import Link from "next/link";
import { notFound } from "next/navigation";
import { getLevelContent } from "@/lib/content";
import { LEVEL_ORDER, type Level } from "@/lib/types";

type Params = { level: string };

export default async function LearnIndexPage({ params }: { params: Promise<Params> }) {
  const { level: slug } = await params;
  const level = slug.toUpperCase() as Level;
  if (!LEVEL_ORDER.includes(level)) notFound();
  const content = getLevelContent(level);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/levels/${slug}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
          ← Level {level}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Grammar lessons — {level}
        </h1>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {content.grammar.map((topic, i) => (
          <Link
            key={topic.id}
            href={`/levels/${slug}/learn/${topic.id}`}
            className="rounded-xl border border-zinc-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md animate-fade-in-up dark:border-zinc-800 dark:bg-zinc-900"
            style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
          >
            <span className="text-xs font-medium text-zinc-400">
              Lesson {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">{topic.title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{topic.exercises.length} exercises</p>
          </Link>
        ))}
      </div>
    </div>
  );
}