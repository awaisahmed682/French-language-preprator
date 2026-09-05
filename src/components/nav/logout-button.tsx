"use client";

import { useTransition } from "react";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/primitives";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => logoutAction())}
    >
      {pending ? "Logging out…" : "Log out"}
    </Button>
  );
}