import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Logo } from "@/components/brand/logo";

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          ← Back to home
        </Link>
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm animate-scale-in dark:border-zinc-800 dark:bg-zinc-900">
          <Logo size={56} className="mx-auto mb-4" />
          <h1 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">Create an account</h1>
          <p className="mt-1 mb-6 text-sm text-zinc-500">
            Join Français Prépa and start your A1 → C2 journey.
          </p>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}