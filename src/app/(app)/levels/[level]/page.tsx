import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLevelContent } from "@/lib/content";
import { LEVEL_META, LEVEL_ORDER, type Level } from "@/lib/types";
import { parseJson } from "@/lib/utils";

type Params = { level: string };

export default async function LevelPortalPage({ params }: { params: Promise<Params> }) {
  const { level: slug } = await params;
  const level = slug.toUpperCase() as Level;
  if (!LEVEL_ORDER.includes(level)) notFound();

  const session = await requireSession();
  const content = getLevelContent(level);
  const meta = LEVEL_META[level];

  const progressRow = await prisma.progress.findUnique({ where: { userId: session.id } });
  const completed = new Set<string>(parseJson<string[]>(progressRow?.completedLessons, []));
  const certificates = await prisma.certificate.findMany({
    where: { userId: session.id, level },
    orderBy: { issuedAt: "desc" },
  });
  const levelPassed = certificates.length > 0;
  const doneGrammar = content.grammar.filter((t) => completed.has(t.id)).length;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link href="/levels" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300">
          ← All levels
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <span className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.color} text-2xl font-bold text-white`}>
            {level}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{meta.title}</h1>
            <p className="text-sm text-zinc-700 dark:text-zinc-200">{meta.subtitle}</p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>a]:min-w-0">
        <Link href={`/levels/${slug}/learn`} className="rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">📘 Grammar</h2>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
            {doneGrammar}/{content.grammar.length} lessons completed
          </p>
        </Link>
        <Link href={`/levels/${slug}/vocabulary`} className="rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">📖 Vocabulary</h2>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">{content.vocabulary.map((v) => v.theme).join(" · ")}</p>
        </Link>
        <Link href={`/levels/${slug}/pronunciation`} className="rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">🗣️ Pronunciation</h2>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
            {content.pronunciation.phonemes.length} phonemes · {content.pronunciation.minimalPairs.length} minimal pairs
          </p>
        </Link>
        <Link href={`/levels/${slug}/test`} className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-zinc-900 ${levelPassed ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800" : "border-zinc-200 bg-white hover:border-indigo-300 dark:border-zinc-800"}`}>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">🏅 Certification test</h2>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
            {levelPassed ? `Passed — ${certificates[0].score} pts` : "Not passed yet"}
          </p>
        </Link>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">Grammar lessons</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {content.grammar.slice(0, 12).map((topic) => {
            const isDone = completed.has(topic.id);
            return (
              <Link
                key={topic.id}
                href={`/levels/${slug}/learn/${topic.id}`}
                className="min-w-0 rounded-xl border border-zinc-200 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate font-medium text-zinc-900 dark:text-zinc-50">{topic.title}</span>
                  <span className={isDone ? "text-emerald-500" : "text-zinc-300"}>{isDone ? "✓" : "○"}</span>
                </div>
                <p className="mt-1 truncate text-sm text-zinc-700 dark:text-zinc-200">{topic.bookChapters}</p>
                <p className="mt-1 text-xs text-zinc-400">{topic.exercises.length} exercises</p>
              </Link>
            );
          })}
        </div>
        <Link href={`/levels/${slug}/learn`} className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300">
          See all {content.grammar.length} lessons →
        </Link>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 [&>a]:min-w-0">
        <MiniLink href={`/levels/${slug}/listening`} icon="🎧" title="Listening comprehension" count={content.listening.length} />
        <MiniLink href={`/levels/${slug}/reading`} icon="📄" title="Reading comprehension" count={content.reading.length} />
        <MiniLink href={`/levels/${slug}/writing`} icon="✍️" title="Writing" count={content.writingPrompts.length} />
        <MiniLink href={`/levels/${slug}/speaking`} icon="🎙️" title="Speaking" count={content.speakingPrompts.length} />
        <MiniLink href={`/levels/${slug}/stories`} icon="📚" title="Stories & scenarios" count={content.stories.length + content.scenarios.length} />
        <MiniLink href={`/levels/${slug}/culture`} icon="🗼" title="French culture" count={content.culturalNotes.length} />
      </section>
    </div>
  );
}

function MiniLink({
  href,
  icon,
  title,
  count,
}: {
  href: string;
  icon: string;
  title: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >
      <span className="text-2xl">{icon}</span>
      <h2 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">{count} items</p>
    </Link>
  );
}