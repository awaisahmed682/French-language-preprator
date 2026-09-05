import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { adminStats } from "@/lib/admin";
import { LEVEL_ORDER } from "@/lib/types";
import { Badge, Card, StatCard } from "@/components/ui/primitives";
import { className as cn } from "@/lib/utils";

const allowed = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const shown = local.length > 2 ? local.slice(0, 2) + "•••" : "•••";
  return `${shown}@${domain}`;
}

const STATUS_TONE: Record<string, "green" | "blue" | "amber" | "zinc"> = {
  pending: "amber",
  reviewed: "green",
  rejected: "amber",
};

export default async function AdminPage() {
  const session = await requireSession();
  if (!allowed.includes(session.email.toLowerCase())) notFound();

  const stats = await adminStats();

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Admin Overview</h1>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
          Signed in as {session.email} · platform health, content depth, and certificate/community overview.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Users" value={stats.totals.users} />
        <StatCard label="New users (30d)" value={stats.totals.newUsers30d} />
        <StatCard label="Certificates" value={stats.totals.certificates} />
        <StatCard label="Total XP" value={stats.totals.totalXp.toLocaleString("en-US")} />
        <StatCard label="Pending submissions" value={stats.totals.pendingSubmissions} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Users & certificates by level</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-zinc-700 dark:text-zinc-400">
                <th className="pb-2">Level</th>
                <th className="pb-2 text-right">Users</th>
                <th className="pb-2 text-right">Certificates</th>
              </tr>
            </thead>
            <tbody>
              {LEVEL_ORDER.map((level) => (
                <tr key={level} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="py-2 font-medium text-zinc-900 dark:text-zinc-50">{level}</td>
                  <td className="py-2 text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                    {stats.byLevel[level].users}
                  </td>
                  <td className="py-2 text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                    {stats.byLevel[level].certificates}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Content depth per level</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-zinc-700 dark:text-zinc-400">
                  <th className="pb-2">Level</th>
                  <th className="pb-2 text-right">Grammar</th>
                  <th className="pb-2 text-right">Vocab</th>
                  <th className="pb-2 text-right">Reading</th>
                  <th className="pb-2 text-right">Listening</th>
                  <th className="pb-2 text-right">Stories</th>
                  <th className="pb-2 text-right">Exercises</th>
                </tr>
              </thead>
              <tbody>
                {LEVEL_ORDER.map((level) => {
                  const c = stats.content[level];
                  const exercises =
                    c.grammarExercises +
                    c.reading * 4 +
                    c.listening * 4 +
                    c.stories * 3;
                  return (
                    <tr key={level} className="border-t border-zinc-200 dark:border-zinc-800">
                      <td className="py-2 font-medium text-zinc-900 dark:text-zinc-50">{level}</td>
                      <td className="py-2 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{c.grammarTopics}</td>
                      <td className="py-2 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{c.vocabularyItems}</td>
                      <td className="py-2 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{c.reading}</td>
                      <td className="py-2 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{c.listening}</td>
                      <td className="py-2 text-right tabular-nums text-zinc-700 dark:text-zinc-300">{c.stories}</td>
                      <td className="py-2 text-right font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                        {exercises}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Recent certificates{" "}
            <span className="font-normal text-zinc-700 dark:text-zinc-300">
              (verifiable via public link)
            </span>
          </h2>
          {stats.recentCertificates.length === 0 ? (
            <p className="text-sm text-zinc-700 dark:text-zinc-300">No certificates issued yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {stats.recentCertificates.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800/60"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Badge tone="green">🏅 {c.level}</Badge>
                    <span className="truncate text-zinc-700 dark:text-zinc-300">
                      {c.holderName} · {maskEmail(c.holderEmail)}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs tabular-nums text-zinc-700 dark:text-zinc-300">
                      {c.score} pts · {new Date(c.issuedAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/certificates/${c.verificationCode}`}
                      className={cn(
                        "text-xs font-medium text-indigo-600 hover:text-indigo-700",
                        "dark:text-indigo-300 dark:hover:text-indigo-200"
                      )}
                    >
                      Verify →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Recent community submissions
          </h2>
          {stats.recentSubmissions.length === 0 ? (
            <p className="text-sm text-zinc-700 dark:text-zinc-300">No submissions yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {stats.recentSubmissions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800/60"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Badge tone="violet">{s.kind}</Badge>
                    <Badge tone="zinc">{s.level}</Badge>
                    <span className="truncate text-zinc-700 dark:text-zinc-300">
                      {s.authorName} · {maskEmail(s.authorEmail)}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs tabular-nums text-zinc-700 dark:text-zinc-300">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                    <Badge tone={STATUS_TONE[s.status] ?? "zinc"}>{s.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}