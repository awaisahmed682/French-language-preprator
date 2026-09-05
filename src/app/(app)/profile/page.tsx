import { requireSession } from "@/lib/auth";
import { Card } from "@/components/ui/primitives";
import { SettingsForm } from "@/components/profile/settings-form";
import { LogoutButton } from "@/components/nav/logout-button";

export default async function ProfilePage() {
  const session = await requireSession();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">My profile</h1>
      <Card className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Account
        </span>
        <p className="font-semibold text-zinc-900 dark:text-zinc-50">{session.name}</p>
        <p className="text-sm text-zinc-500">{session.email}</p>
        <p className="mt-2 text-sm text-zinc-500">
          Current level: <strong>{session.currentLevel}</strong> · Target:{" "}
          <strong>{session.targetLevel}</strong>
        </p>
      </Card>
      <Card>
        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">Settings</h2>
        <SettingsForm
          name={session.name}
          targetLevel={session.targetLevel}
          nativeLanguage={session.nativeLanguage}
        />
      </Card>
      <Card className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Session</h2>
          <p className="text-sm text-zinc-500">Sign out from this device.</p>
        </div>
        <LogoutButton />
      </Card>
    </div>
  );
}