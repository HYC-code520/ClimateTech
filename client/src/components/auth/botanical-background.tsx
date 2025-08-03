import fernImage1 from "@assets/image_1754251356220.png";
import fernImage2 from "@assets/image_1754251380482.png";

interface BotanicalBackgroundProps {
  type: "login" | "signup";
}

export function BotanicalBackground({ type }: BotanicalBackgroundProps) {
  return (
    <div 
      className="w-1/2 relative overflow-hidden"
      style={{
        backgroundImage: `url(${type === "login" ? fernImage1 : fernImage2})`,
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
