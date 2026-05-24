import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";

function SignupPage() {
  return (
    <AuthCard
      eyebrow="Get started"
      title="Create your edge"
      subtitle="Signups are disabled in this build — the app is open for editing."
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
          href="/login"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-medium text-foreground transition hover:border-primary/50 hover:bg-accent"
        >
          Back to sign in
        </Link>
      </div>

      <div className="mt-8 rounded-lg border border-border/50 bg-muted/30 p-4 text-xs leading-relaxed text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">Dev mode active</p>
        <p>No account needed. Open the dashboard and start playing with the GTO engine.</p>
      </div>
    </AuthCard>
  );
}

export default SignupPage;
