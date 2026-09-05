import { requireSession } from "@/lib/auth";
import { dashboardSnapshot } from "@/actions/progress";
import { AppNav } from "@/components/nav/nav";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const snapshot = await dashboardSnapshot();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <AppNav xp={snapshot.gamification.xp} streak={snapshot.gamification.streak} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-zinc-200 py-6 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 text-xs text-zinc-500">
          <span>
            Signed in as {session.name} · Français Prépa ©{" "}
            {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}