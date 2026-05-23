"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Invalid email";
    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "Minimum 8 characters";
    if (confirm !== password) next.confirm = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback`
              : undefined,
        },
      });
      if (error) throw error;
      toast.success("Check your email to confirm your account");
      router.push("/login");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Signup failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    name.trim() &&
    email.trim() &&
    password.length >= 8 &&
    confirm === password;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Full name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          placeholder="Daniel Negreanu"
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          placeholder="At least 8 characters"
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirm" className="text-sm font-medium text-foreground">
          Confirm password
        </label>
        <input
          id="confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          placeholder="Repeat password"
        />
        {errors.confirm && (
          <p className="text-xs text-red-500">{errors.confirm}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !isValid}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Create account
      </button>

      <p className="pt-2 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default SignupForm;
