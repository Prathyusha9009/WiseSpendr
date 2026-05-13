import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — WiseSpendr" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  return (
    <AppShell title="Settings">
      <div className="rounded-2xl border border-border bg-card p-6 max-w-xl">
        <h2 className="font-semibold">Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your WiseSpendr account.</p>
        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-mono text-xs">{user?.id?.slice(0, 8)}…</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
