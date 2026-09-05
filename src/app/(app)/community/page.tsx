import { requireSession } from "@/lib/auth";
import { listSubmissions, mySubmissions } from "@/actions/community";
import { CommunityPanel } from "@/components/community/community-panel";

export default async function CommunityPage() {
  const session = await requireSession();
  const [submissions, mine] = await Promise.all([
    listSubmissions("writing", undefined),
    mySubmissions(),
  ]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Community</h1>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
          Publish texts, give feedback and progress together.
        </p>
      </div>
      <CommunityPanel
        submissions={submissions}
        mySubmissions={mine}
        level={session.currentLevel}
      />
    </div>
  );
}