function AuthDivider({ label = "or continue with email" }: { label?: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

export default AuthDivider;
