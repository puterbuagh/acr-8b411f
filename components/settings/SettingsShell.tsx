import SettingsNav from "./SettingsNav";

export function SettingsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-12 max-w-6xl">
      <aside className="w-56 shrink-0">
        <SettingsNav />
      </aside>
      <main className="flex-1 min-w-0 space-y-8">{children}</main>
    </div>
  );
}

export default SettingsShell;
