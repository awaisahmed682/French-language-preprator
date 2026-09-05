import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { Card, Button } from "@/components/ui/primitives";

export default async function AiHubPage() {
  await requireSession();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">AI assistant</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Play, ask questions and converse in French. Works even without an API key
          (rule-based answers, always useful).
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/ai/roleplay" className="block">
          <Card className="flex h-full flex-col gap-2 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg">
            <span className="text-3xl">🎭</span>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Roleplay</h2>
            <p className="text-sm text-zinc-500">
              Live everyday scenarios: a conversation in French.
            </p>
            <Button variant="secondary" className="mt-auto self-start">
              Start
            </Button>
          </Card>
        </Link>
        <Link href="/ai/explain" className="block">
          <Card className="flex h-full flex-col gap-2 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg">
            <span className="text-3xl">💡</span>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Explanations</h2>
            <p className="text-sm text-zinc-500">
              Ask for a grammar explanation at your level.
            </p>
            <Button variant="secondary" className="mt-auto self-start">
              Ask
            </Button>
          </Card>
        </Link>
        <Link href="/ai/tutor" className="block">
          <Card className="flex h-full flex-col gap-2 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg">
            <span className="text-3xl">🧑‍🏫</span>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Conversational tutor</h2>
            <p className="text-sm text-zinc-500">
              Write in French: instant corrections and advice.
            </p>
            <Button variant="secondary" className="mt-auto self-start">
              Chat
            </Button>
          </Card>
        </Link>
      </div>
    </div>
  );
}