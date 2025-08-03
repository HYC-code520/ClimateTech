import leafImage from "@assets/leaf-image-bg_1754253561241.png";

interface BotanicalBackgroundProps {
  type: "login" | "signup";
}

export function BotanicalBackground({ type }: BotanicalBackgroundProps) {
  return (
    <div 
      className="w-1/2 relative overflow-hidden"
      style={{
        backgroundImage: `url(${leafImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className={`absolute inset-0 ${
        type === "login" 
          ? "bg-gradient-to-br from-black/50 to-[var(--botanical-green)]/20" 
          : "bg-gradient-to-bl from-black/50 to-[var(--botanical-green)]/20"
      }`}></div>
    </div>
  );
}
