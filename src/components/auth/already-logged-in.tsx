import Link from "next/link";
import { Button } from "@/components/ui/primitives";
import { Logo } from "@/components/brand/logo";
import { logoutAction, switchAccountAction } from "@/actions/auth";
import type { SessionUser } from "@/lib/auth";

export function AlreadyLoggedIn({ session }: { session: SessionUser }) {
  const initial = session.name?.charAt(0).toUpperCase() || "?";
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          ← Back to home
        </Link>
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm animate-scale-in dark:border-zinc-800 dark:bg-zinc-900">
          <Logo size={56} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">You&apos;re already logged in</h1>
          <p className="mt-1 mb-6 text-sm text-zinc-500">
            This is the account currently signed in on this browser.
          </p>
          <div className="mb-6 flex items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
              {initial}
            </span>
            <div className="min-w-0 text-left">
              <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">{session.name}</p>
              <p className="truncate text-sm text-zinc-500">{session.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button href="/dashboard" size="lg" className="w-full">
              Go to my dashboard
            </Button>
            <form action={logoutAction} className="w-full">
              <Button type="submit" variant="secondary" size="lg" className="w-full">
                Log out
              </Button>
            </form>
            <form action={switchAccountAction} className="w-full">
              <Button type="submit" variant="ghost" size="md" className="w-full text-zinc-500 dark:text-zinc-400">
                Use a different account
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}