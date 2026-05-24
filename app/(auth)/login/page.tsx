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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      {/* Atmospheric background layers */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        {/* Poker chip decorative elements */}
        <div className="absolute top-20 right-20 h-16 w-16 rounded-full border-4 border-emerald-500/10 opacity-40" />
        <div className="absolute bottom-32 left-32 h-20 w-20 rounded-full border-4 border-blue-500/10 opacity-30" />
      </div>

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 -z-5 opacity-[0.015]" 
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat'
        }}
      />

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
            className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}

export default LoginPage;
