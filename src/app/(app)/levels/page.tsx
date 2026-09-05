import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { LEVEL_ORDER, LEVEL_META } from "@/lib/types";
import { getLevelContent } from "@/lib/content";

export default async function LevelsPage() {
  const session = await requireSession();
  const currentIdx = LEVEL_ORDER.indexOf(session.currentLevel);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Level roadmap</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Your current level: <strong>{session.currentLevel}</strong>. Complete the lessons, then
          pass the certification test to advance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEVEL_ORDER.map((level, idx) => {
          const meta = LEVEL_META[level];
          const content = getLevelContent(level);
          const unlocked = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <Link
              key={level}
              href={unlocked ? `/levels/${level.toLowerCase()}` : "#"}
              className={
                unlocked
                  ? "group rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg animate-fade-in-up dark:border-zinc-800 dark:bg-zinc-900"
                  : "pointer-events-none rounded-2xl border border-zinc-200 bg-zinc-100 p-6 opacity-50 dark:border-zinc-800 dark:bg-zinc-900"
              }
            >
              <div className="flex items-start justify-between">
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${meta.color} text-lg font-bold text-white`}
                >
                  {level}
                </span>
                {isCurrent ? (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    Current
                  </span>
                ) : unlocked ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    ✓ Completed
                  </span>
                ) : (
                  <span className="text-zinc-400">🔒</span>
                )}
              </div>
              <h2 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50">{meta.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
                {meta.subtitle}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5 text-xs text-zinc-500">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                  {content.grammar.length} lessons
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                  {content.vocabulary.length} topics
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                  {content.stories.length + content.scenarios.length} stories
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}