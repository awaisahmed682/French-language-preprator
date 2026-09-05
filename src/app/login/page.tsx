import Link from "next/link";
import { Restricted } from "@/components/auth/restricted";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/brand/logo";

export default function LoginPage() {
  return (
    <Restricted>
      <main className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-zinc-950">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300"
          >
            ← Back to home
          </Link>
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm animate-scale-in dark:border-zinc-800 dark:bg-zinc-900">
            <Logo size={56} className="mx-auto mb-4" />
            <h1 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">Log in</h1>
            <p className="mt-1 mb-6 text-sm text-zinc-700 dark:text-zinc-200">Welcome back!</p>
            <LoginForm />
            <p className="mt-6 text-center text-sm text-zinc-700 dark:text-zinc-200">
              No account yet?{" "}
              <Link
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </Restricted>
  );
}