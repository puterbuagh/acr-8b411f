import { ReactNode } from "react";
import Link from "next/link";
import { Spade } from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="relative w-full max-w-md">
      <div className="flex justify-center mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 group"
          aria-label="PokerVision home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6">
            <Spade className="h-5 w-5" />
          </span>
          <span className="font-display text-xl tracking-tight text-foreground">
            PokerVision
          </span>
        </Link>
      </div>
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/20 p-8">
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthCard;
