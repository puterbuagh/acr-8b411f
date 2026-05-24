"use client";

import { useRouter } from "next/navigation";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.74-6-6.1s2.7-6.1 6-6.1c1.88 0 3.14.8 3.86 1.48l2.64-2.54C16.9 3.36 14.7 2.4 12 2.4 6.86 2.4 2.7 6.56 2.7 11.7s4.16 9.3 9.3 9.3c5.36 0 8.92-3.76 8.92-9.06 0-.6-.06-1.06-.14-1.74H12z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function OAuthButtons() {
  const router = useRouter();

  function handleProvider(provider: string) {
    // Auth disabled for local editing — simulate provider sign-in.
    console.info(`[auth] ${provider} sign-in stubbed for local editing`);
    router.push("/");
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={() => handleProvider("google")}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
      >
        <GoogleIcon />
        Continue with Google
      </button>
      <button
        type="button"
        onClick={() => handleProvider("github")}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
      >
        <GithubIcon />
        Continue with GitHub
      </button>
    </div>
  );
}

export default OAuthButtons;
