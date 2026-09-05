import Link from "next/link";
import { LEVEL_ORDER, LEVEL_META } from "@/lib/types";
import { Button, Card } from "@/components/ui/primitives";
import { Logo } from "@/components/brand/logo";

const FEATURES = [
  {
    icon: "📚",
    title: "Structured lessons A1 → C2",
    body: "Grammar, vocabulary, useful phrases and cultural notes aligned with the CEFR and the « Complete French All-in-One » handbook.",
  },
  {
    icon: "🗣️",
    title: "Pronunciation & speaking",
    body: "Built-in French TTS, voice recording and pronunciation scoring to prepare the TEF/TCF oral exam.",
  },
  {
    icon: "🏅",
    title: "Practice tests & certificates",
    body: "Level-based tests modeled on TEF Canada / TCF Canada with scores, grading and verifiable certificates.",
  },
  {
    icon: "⚡",
    title: "Gamification",
    body: "XP, daily streaks, leagues and badges to keep you motivated every day.",
  },
  {
    icon: "🧠",
    title: "Spaced repetition (SRS)",
    body: "Words and rules come back at the right moment to lock in long-term knowledge.",
  },
  {
    icon: "🤖",
    title: "AI assistant",
    body: "Roleplays, a conversational tutor and personalised explanations — works even without an API key.",
  },
];

export default function Home() {
  return (
    <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">
      <section className="relative overflow-hidden bg-zinc-950">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_28rem_at_top_center,rgba(201,163,55,0.14),transparent)]"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center sm:py-24">
          <Logo size={56} className="mx-auto mb-5 animate-fade-in-up" />
          <span className="mb-4 inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1 text-xs font-semibold tracking-wide text-amber-300 uppercase animate-fade-in-up [animation-delay:70ms]">
            TEF Canada • TCF Canada • CECRL
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-zinc-50 animate-fade-in-up [animation-delay:90ms] sm:text-6xl">
            Prepare for French, from your first word to mastery.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300 animate-fade-in-up [animation-delay:180ms]">
            Français Prépa takes you from <strong>A1</strong> to{" "}
            <strong>C2</strong> with lessons, pronunciation, practice tests
            and certificates — for your studies, work and immigration
            applications.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up [animation-delay:270ms]">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-base font-semibold text-zinc-950 shadow-sm transition-colors hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              Start for free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-600 px-6 py-3 text-base font-medium text-zinc-100 transition-colors hover:border-zinc-400 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Card
              key={f.title}
              className="flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{f.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16">
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-10 bg-amber-500" aria-hidden />
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Six levels, one clear path
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEVEL_ORDER.map((level, i) => {
            const meta = LEVEL_META[level];
            return (
              <div
                key={level}
                className="rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-in-up dark:border-zinc-800 dark:bg-zinc-900"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${meta.color} text-lg font-bold text-white`}
                >
                  {level}
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{meta.title}</h3>
                <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{meta.subtitle}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Button href="/register" size="lg">
            Create my account and get started
          </Button>
        </div>
      </section>

      <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 text-sm text-zinc-700 dark:text-zinc-400">
          <span className="flex items-center gap-2">
            <Logo size={20} /> © {new Date().getFullYear()} Français Prépa
          </span>
          <Link href="/login" className="hover:text-zinc-700 dark:text-zinc-200 dark:hover:text-zinc-300">
            Login
          </Link>
        </div>
      </footer>
    </main>
  );
}