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
      {/* Logo with refined shadow and hover effect */}
      <div className="flex justify-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 group"
          aria-label="PokerVision home"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 group-hover:scale-105 group-hover:rotate-6 group-hover:shadow-xl group-hover:shadow-emerald-500/40">
            <Spade className="h-5 w-5" />
          </span>
          <span className="font-display text-xl tracking-tight text-white transition-colors duration-200 group-hover:text-emerald-400">
            PokerVision
          </span>
        </Link>
      </div>
      
      {/* Card with enhanced felt-inspired styling */}
      <div className="relative rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-800/95 backdrop-blur-2xl shadow-2xl shadow-black/40 p-8 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-emerald-500/[0.03] before:via-transparent before:to-blue-500/[0.02] before:pointer-events-none">
        {/* Inner glow accent */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        
        <div className="relative">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white mb-2">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-sm text-slate-400 leading-relaxed">{subtitle}</p>
            ) : null}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthCard;
