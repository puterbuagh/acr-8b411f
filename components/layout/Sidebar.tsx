"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, Settings, Spade, Circle } from "lucide-react";

const navItems = [
  { href: "/", label: "Live Table", icon: LayoutDashboard },
  { href: "/history", label: "Hand History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 h-screen border-r border-border bg-card/40 backdrop-blur flex flex-col relative z-20">
      {/* Logo */}
      <div className="px-6 pt-8 pb-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center ring-2 ring-accent/40 ring-offset-2 ring-offset-card">
              <Spade className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent" />
          </div>
          <div>
            <div className="font-display text-2xl font-semibold tracking-tight leading-none">
              Felt
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1 font-mono">
              GTO · Live
            </div>
          </div>
        </Link>
      </div>

      {/* Decorative divider */}
      <div className="px-6 mb-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all relative ${
                isActive
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
              }`}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-primary rounded-r" />
              )}
              <Icon className="h-4 w-4" strokeWidth={isActive ? 2.5 : 1.75} />
              <span className={isActive ? "font-medium" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Status pill */}
      <div className="px-4 pb-4">
        <div className="bg-muted/30 border border-border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Circle className="h-2 w-2 fill-success text-success" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Solver online
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            Reading screen at <span className="text-foreground font-mono">2 fps</span>. All inference runs locally in your browser.
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
