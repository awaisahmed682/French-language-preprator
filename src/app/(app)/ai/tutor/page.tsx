import { requireSession } from "@/lib/auth";
import { TutorPanel } from "@/components/ai/tutor-panel";

export default async function TutorPage() {
  const session = await requireSession();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Conversational tutor</h1>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
          Practise writing: write a sentence in French and get corrections and
          advice adapted to your level.
        </p>
      </div>
      <TutorPanel level={session.currentLevel.toUpperCase()} />
    </div>
  );
}