import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getLevelContent } from "@/lib/content";
import { LEVEL_ORDER, LEVEL_META, type Level } from "@/lib/types";
import { Button, Card } from "@/components/ui/primitives";
import { TestRunner } from "@/components/test/test-runner";

type Params = { level: string };

export default async function TestPage({ params }: { params: Promise<Params> }) {
  const { level: slug } = await params;
  const level = slug.toUpperCase() as Level;
  if (!LEVEL_ORDER.includes(level)) notFound();
  await requireSession();

  const content = getLevelContent(level);
  const meta = LEVEL_META[level];
  const passingPct = Math.round((content.test.passingScore / content.test.maxScore) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/levels/${slug}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300">
          ← Level {level}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Certification test {level}
        </h1>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
          TEF/TCF model — listening, reading, writing, speaking and pronunciation. Pass with at
          least <strong>{passingPct}%</strong> ({content.test.passingScore} /{" "}
          {content.test.maxScore} points) to unlock the {meta.title} certificate.
        </p>
      </div>

      <Card className="flex flex-wrap items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <span className="font-medium text-zinc-900 dark:text-zinc-50">Reminder:</span>
        <span>🎧 {content.test.listening.length} listening</span>
        <span>📖 {content.test.reading.length} reading</span>
        <span>✍️ {content.test.writing.length} writing</span>
        <span>🎙️ {content.test.speaking.length} speaking</span>
        <span>🗣️ {content.test.pronunciation.length} pronunciation</span>
      </Card>

      <TestRunner level={level} test={content.test} />

      <div className="flex justify-center">
        <Button href={`/levels/${slug}`} variant="outline">
          Not now — back to level {level}
        </Button>
      </div>
    </div>
  );
}