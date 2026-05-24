interface AuthDividerProps {
  label?: string;
}

function AuthDivider({ label = "or continue with email" }: AuthDividerProps) {
  return (
    <div className="relative my-6 flex items-center">
      <div className="flex-1 border-t border-border" />
      <span className="px-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex-1 border-t border-border" />
    </div>
  );
}

export default AuthDivider;
