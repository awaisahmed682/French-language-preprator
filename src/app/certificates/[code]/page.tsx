import Link from "next/link";
import { notFound } from "next/navigation";
import { verifyCertificate } from "@/actions/tests";
import { LEVEL_META, LEVEL_ORDER, type Level } from "@/lib/types";

type Params = { code: string };
export const dynamic = "force-dynamic";

export default async function CertificatePage({ params }: { params: Promise<Params> }) {
  const { code } = await params;
  const certificate = await verifyCertificate(code);
  if (!code || !certificate) notFound();

  const level = certificate.level as Level;
  const meta = LEVEL_META[level];
  const breakdown = (certificate.skillBreakdown ?? {}) as Record<string, number>;
  const issued = new Date(certificate.issuedAt);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-6 py-16 dark:bg-zinc-950">
      <div className="w-full max-w-3xl">
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            ✓ Authentic certificate verified
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border-4 border-emerald-600 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-10 py-6 text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-widest">
              Français Prépa — Verified Certificate
            </p>
            <h1 className={`mt-2 text-5xl font-extrabold drop-shadow ${LEVEL_META[level].color.includes("amber") ? "text-amber-300" : "text-white"}`}>
              {level}
            </h1>
            <p className="mt-1 text-sm opacity-90">{meta.title}</p>
          </div>

          <div className="px-10 py-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm uppercase tracking-wide text-zinc-400">
                Awarded to
              </p>
              <p className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {certificate.name}
              </p>
              <p className="text-sm text-zinc-500">
                for mastering the {level} level of French (French as a foreign language), modeled
                on TEF/TCF.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 text-center text-sm sm:grid-cols-6">
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
                <p className="text-xs text-zinc-400">Listening</p>
                <p className="font-bold text-zinc-800 dark:text-zinc-100">{breakdown.listening ?? "–"}</p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
                <p className="text-xs text-zinc-400">Reading</p>
                <p className="font-bold text-zinc-800 dark:text-zinc-100">{breakdown.reading ?? "–"}</p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
                <p className="text-xs text-zinc-400">Writing</p>
                <p className="font-bold text-zinc-800 dark:text-zinc-100">{breakdown.writing ?? "–"}</p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
                <p className="text-xs text-zinc-400">Speaking</p>
                <p className="font-bold text-zinc-800 dark:text-zinc-100">{breakdown.speaking ?? "–"}</p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
                <p className="text-xs text-zinc-400">Pronunciation</p>
                <p className="font-bold text-zinc-800 dark:text-zinc-100">
                  {breakdown.pronunciation ?? "–"}
                </p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
                <p className="text-xs text-zinc-400">Total score</p>
                <p className="font-bold text-emerald-600">{certificate.score}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-1 border-t border-zinc-100 pt-6 text-xs text-zinc-400 dark:border-zinc-800">
              <p className="font-mono">Verification code: {certificate.code}</p>
              <p>
                Issued on {issued.toLocaleDateString()} · level {LEVEL_ORDER.indexOf(level) + 1} of 6
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            ← Back to Français Prépa
          </Link>
        </div>
      </div>
    </main>
  );
}