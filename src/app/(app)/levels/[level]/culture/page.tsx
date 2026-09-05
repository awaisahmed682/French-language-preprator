import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getLevelContent } from "@/lib/content";
import { LEVEL_ORDER, type Level } from "@/lib/types";
import { Card } from "@/components/ui/primitives";

type Params = { level: string };

export default async function CulturePage({ params }: { params: Promise<Params> }) {
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
          French culture — {level}
        </h1>
      </div>

      {content.culturalNotes.map((note, i) => (
        <Card key={i} className="flex flex-col gap-2">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">🗼 {note.title}</h2>
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{note.body}</p>
        </Card>
      ))}
    </div>
  );
}