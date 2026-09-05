"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { className as cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/levels", label: "Levels" },
  { href: "/practice", label: "Practice" },
  { href: "/review", label: "Review" },
  { href: "/ai", label: "AI" },
  { href: "/community", label: "Community" },
];

export function AppNav({
  xp,
  streak,
}: {
  xp: number;
  streak: number;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-2 text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          <Logo size={28} />
          <span className="hidden sm:inline">Français Prépa</span>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {LINKS.map((link) => {
            const active =
              link.href === "/dashboard"
                ? pathname === link.href
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
: "text-zinc-700 hover:bg-zinc-200/80 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 sm:inline-flex dark:bg-amber-950/60 dark:text-amber-300">
            ⭐ {xp.toLocaleString("en-US")}
          </span>
          <span className="hidden items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 sm:inline-flex dark:bg-orange-950/60 dark:text-orange-300">
            🔥 {streak}
          </span>
          <Link
            href="/profile"
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              pathname === "/profile"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                : "text-zinc-700 hover:bg-zinc-200/80 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            )}
          >
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
}