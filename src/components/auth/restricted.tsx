import { getSession } from "@/lib/auth";
import { AlreadyLoggedIn } from "@/components/auth/already-logged-in";

export async function Restricted({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session) return <AlreadyLoggedIn session={session} />;
  return <>{children}</>;
}