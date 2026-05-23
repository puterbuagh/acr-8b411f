import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import OAuthButtons from "@/components/auth/OAuthButtons";
import AuthDivider from "@/components/auth/AuthDivider";
import Link from "next/link";

export const metadata = {
  title: "Sign in · PokerVision",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      </div>
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to resume reading the felt."
      >
        <OAuthButtons mode="login" />
        <AuthDivider />
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to PokerVision?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}
