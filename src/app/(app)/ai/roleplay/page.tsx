import { requireSession } from "@/lib/auth";
import { getLevelContent } from "@/lib/content";
import { LEVEL_ORDER } from "@/lib/types";
import { RoleplayPanel } from "@/components/ai/roleplay-panel";

export default async function RoleplayPage() {
  const session = await requireSession();
  const content = getLevelContent(session.currentLevel);
  const nextIdx = LEVEL_ORDER.indexOf(session.currentLevel) + 1;
  const nextContent = nextIdx < LEVEL_ORDER.length ? getLevelContent(LEVEL_ORDER[nextIdx]) : null;
  const scenarios = [...content.scenarios, ...(nextContent?.scenarios ?? [])].slice(0, 6);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Roleplay</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Scenarios based on your level {session.currentLevel} and the next one.
        </p>
      </div>
      <RoleplayPanel level={session.currentLevel} scenarios={scenarios} initialRole="Vous" />
    </div>
  );
}