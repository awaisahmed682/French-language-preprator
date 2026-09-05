import { requireSession } from "@/lib/auth";
import { ExplainPanel } from "@/components/ai/explain-panel";

export default async function ExplainPage() {
  const session = await requireSession();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Grammar explanations</h1>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
          Ask a question about French grammar at level {session.currentLevel}.
        </p>
      </div>
      <ExplainPanel level={session.currentLevel.toUpperCase()} />
    </div>
  );
}