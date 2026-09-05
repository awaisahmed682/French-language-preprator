import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { dashboardSnapshot } from "@/actions/progress";
import { BADGE_INFO } from "@/lib/badges";
import { LEVEL_META, LEVEL_ORDER, SKILLS, SKILL_LABEL } from "@/lib/types";
import { Badge, Card, ProgressBar, Button } from "@/components/ui/primitives";

const LEAGUE_LABEL: Record<string, string> = {
  BRONZE: "Bronze",
  SILVER: "Silver",
  GOLD: "Gold",
  DIAMOND: "Diamond",
};

export default async function DashboardPage() {
  const session = await requireSession();
  const snapshot = await dashboardSnapshot();

  const levelMeta = LEVEL_META[session.currentLevel];
  const currentIdx = LEVEL_ORDER.indexOf(session.currentLevel);
  const targetIdx = LEVEL_ORDER.indexOf(session.targetLevel);
  const levelProgressPct = Math.min(
    100,
    Math.round(((currentIdx + 1) / Math.max(1, targetIdx + 1)) * 100)
  );

  const badges = snapshot.gamification.badges
    .map((id) => ({ ...(BADGE_INFO[id] ?? { id, name: id, desc: "", icon: "⭐" }) }))
    .slice(0, 12);

  const recentTests = snapshot.progress.practiceTests.slice(0, 5);
  const pronunciationAvg = snapshot.progress.pronunciationScores.length
    ? Math.round(
        snapshot.progress.pronunciationScores.reduce(
          (s: number, p: { score: number }) => s + p.score,
          0
        ) / snapshot.progress.pronunciationScores.length
      )
    : null;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Hello, {session.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
            You are working at level{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">
              {session.currentLevel}
            </strong>{" "}
            toward the target{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">
              {session.targetLevel}
            </strong>
            .
          </p>
        </div>
        <div className="flex gap-2">
          <Button href={`/levels/${session.currentLevel.toLowerCase()}`}>Continue</Button>
          <Button href={`/levels/${session.currentLevel.toLowerCase()}/test`} variant="secondary">
            Take a test
          </Button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-700 dark:text-zinc-200">
            Current level
          </span>
          <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${levelMeta.color} text-xl font-bold text-white`}>
            {session.currentLevel}
          </div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{levelMeta.title}</p>
          <p className="text-xs text-zinc-700 dark:text-zinc-200">{levelMeta.subtitle}</p>
          <ProgressBar value={currentIdx + 1} max={targetIdx + 1} className="mt-auto" />
          <span className="text-xs text-zinc-700 dark:text-zinc-200">
            Progress toward target: {levelProgressPct}%
          </span>
        </Card>

        <Card className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-700 dark:text-zinc-200">
            Level XP & league
          </span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {snapshot.gamification.xp.toLocaleString("en-US")}
              <span className="ml-1 text-base font-medium text-zinc-700 dark:text-zinc-200">XP</span>
            </span>
            <Badge tone="amber">🏆 {LEAGUE_LABEL[snapshot.gamification.league]}</Badge>
          </div>
          <div className="flex gap-1 text-sm">
            <ProgressBar
              value={snapshot.gamification.xp}
              max={snapshot.gamification.xp + snapshot.gamification.xpToNextLeague}
            />
          </div>
          <span className="text-xs text-zinc-700 dark:text-zinc-200">
            {snapshot.gamification.xpToNextLeague > 0
              ? `${snapshot.gamification.xpToNextLeague} XP before the next league.`
              : "Max league reached!"}
          </span>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 text-sm text-orange-700 dark:text-orange-300">
              🔥 Current streak: {snapshot.gamification.streak} day
              {snapshot.gamification.streak > 1 ? "s" : ""}
            </span>
          </div>
        </Card>

        <Card className="flex flex-col gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-700 dark:text-zinc-200">
            Skills
          </span>
          <div className="flex flex-1 flex-col gap-2">
            {SKILLS.map((skill) => {
              const score = Math.round(
                (snapshot.progress.skillScores[skill] ?? 0)
              );
              return (
                <div key={skill} className="flex items-center gap-2 text-sm">
                  <span className="w-24 shrink-0 text-zinc-700 dark:text-zinc-300">
                    {SKILL_LABEL[skill]}
                  </span>
                  <ProgressBar value={score} max={100} className="flex-1" />
                  <span className="w-8 text-right text-xs tabular-nums text-zinc-700 dark:text-zinc-200">
                    {score}%
                  </span>
                </div>
              );
            })}
            {pronunciationAvg !== null ? (
              <p className="text-xs text-zinc-700 dark:text-zinc-200">
                @ Pronunciation average: {pronunciationAvg}/100
              </p>
            ) : null}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Badges</h2>
          {badges.length === 0 ? (
            <p className="text-sm text-zinc-700 dark:text-zinc-200">
              Complete your first activity to unlock a badge.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b.id}
                  title={`${b.name} — ${b.desc}`}
                  className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {b.icon} {b.name}
                </span>
              ))}
            </div>
          )}
        </Card>

        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Recent tests</h2>
          {recentTests.length === 0 ? (
            <p className="text-sm text-zinc-700 dark:text-zinc-200">
              No tests yet.{" "}
              <Link
                href="/practice"
                className="font-medium text-indigo-600 dark:text-indigo-300"
              >
                Practice
              </Link>
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {recentTests.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800/60"
                >
                  <span className="font-medium">
                    {t.kind === "test" ? "Certification test" : "Practice"} · {t.level}
                  </span>
                  <span className="text-xs text-zinc-700 dark:text-zinc-200">
                    {Math.round((t.score / t.max) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Certificates</h2>
          {snapshot.certificates.length === 0 ? (
            <p className="text-sm text-zinc-700 dark:text-zinc-200">
              Take a certification test to earn a verifiable certificate.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {snapshot.certificates.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/certificates/${c.verificationCode}`}
                    className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm transition hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950"
                  >
                    <span className="font-medium text-emerald-800 dark:text-emerald-300">
                      🏅 Certificate {c.level}
                    </span>
                    <span className="text-xs text-emerald-700 dark:text-emerald-300">
                      {c.score} pts
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}