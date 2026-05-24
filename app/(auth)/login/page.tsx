import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";

function LoginPage() {
  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in to PokerVision"
      subtitle="Authentication is disabled in this build — jump straight in."
    >
      <div className="space-y-4">
        <Link
          href="/"
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:shadow-xl hover:shadow-primary/40"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative">Enter dashboard →</span>
        </Link>

        <Link
          href="/history"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground transition hover:border-primary/50 hover:bg-accent"
        >
          Browse hand history
        </Link>
      </div>

      <div className="mt-8 rounded-lg border border-border/50 bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">Dev mode active</p>
        <p>No authentication required. All features are unlocked for local editing.</p>
      </div>
    </AuthCard>
  );
}

export default LoginPage;
