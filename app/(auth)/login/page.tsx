import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import OAuthButtons from "@/components/auth/OAuthButtons";
import AuthDivider from "@/components/auth/AuthDivider";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Sign in · PokerVision",
};

export const dynamic = "force-dynamic";

async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      {/* Felt-inspired gradient mesh background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.06),transparent_50%)]" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-emerald-500/[0.07] blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/[0.06] blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        
        {/* Decorative poker chip elements */}
        <div className="absolute top-20 right-24 h-20 w-20 rounded-full border-[3px] border-emerald-500/[0.15] opacity-40 animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-32 right-16 h-12 w-12 rounded-full border-[2px] border-emerald-400/[0.12] opacity-30" />
        <div className="absolute bottom-32 left-32 h-24 w-24 rounded-full border-[3px] border-blue-500/[0.12] opacity-35 animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
        <div className="absolute bottom-48 left-48 h-16 w-16 rounded-full border-[2px] border-indigo-500/[0.1] opacity-25" />
        
        {/* Subtle grid overlay for felt texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }} />
      </div>

      {/* Noise texture overlay for depth */}
      <div 
        className="absolute inset-0 -z-5 opacity-[0.02]" 
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat'
        }}
      />

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <AuthCard
          title="Welcome back"
          subtitle="Sign in to resume reading the felt."
        >
          <OAuthButtons mode="login" />
          <AuthDivider />
          <LoginForm />
          <p className="mt-6 text-center text-sm text-slate-400">
            New to PokerVision?{" "}
            <Link
              href="/signup"
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
}

export default LoginPage;
