import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export async function Restricted({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session) redirect("/dashboard");
  return <>{children}</>;
}