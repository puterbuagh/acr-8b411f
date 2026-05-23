"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Camera, Layers, AlertTriangle } from "lucide-react";

const items = [
  { href: "/settings/profile", label: "Profile", icon: User },
  { href: "/settings/capture", label: "Capture", icon: Camera },
  { href: "/settings/sites", label: "Poker Sites", icon: Layers },
  { href: "/settings/danger", label: "Danger Zone", icon: AlertTriangle },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 w-56" aria-label="Settings navigation">
      <div className="px-3 pb-3">
        <h2 className="font-display text-xl tracking-tight text-foreground">
          Settings
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Tune the read engine
        </p>
      </div>
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname?.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
              (active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground")
            }
          >
            <Icon className="size-4" aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default SettingsNav;
