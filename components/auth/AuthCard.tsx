import type { ReactNode } from "react";
import Link from "next/link";

interface AuthCardProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

function AuthCard({ eyebrow, title, subtitle, children }: AuthCardProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Cpath d='M0 0h1v1H0z' fill='%23fff'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo / brand */}
          <Link href="/" className="mb-10 flex items-center justify-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition group-hover:scale-105">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 L15 9 L22 9 L16.5 14 L18.5 21 L12 17 L5.5 21 L7.5 14 L2 9 L9 9 Z" />
              </svg>
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">PokerVision</span>
          </Link>

          {/* Card */}
          <div className="relative rounded-2xl border border-border/60 bg-card/80 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
            {/* Inner highlight */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent" />

            <div className="relative">
              {eyebrow && (
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {eyebrow}
                </div>
              )}
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">{title}</h1>
              {subtitle && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
              )}

              <div className="mt-8">{children}</div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing, you agree to play responsibly. PokerVision is a study tool.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthCard;
