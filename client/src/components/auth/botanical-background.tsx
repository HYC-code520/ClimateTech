interface BotanicalBackgroundProps {
  type: "login" | "signup";
}

export function BotanicalBackground({ type }: BotanicalBackgroundProps) {
  return (
    <div className={`w-1/2 ${type === "login" ? "botanical-bg-login" : "botanical-bg-signup"} relative`}>
      <div className={`absolute inset-0 ${
        type === "login" 
          ? "bg-gradient-to-br from-black/30 to-[var(--botanical-green)]/10" 
          : "bg-gradient-to-bl from-black/30 to-[var(--botanical-green)]/10"
      }`}></div>
    </div>
  );
}
