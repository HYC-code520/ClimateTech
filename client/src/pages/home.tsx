import { Leaf, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import homeBg from "@assets/home-bg_1754320407119.png";
import leafImage from "@assets/home-page-leaf_1754321116425.png";
import { useLocation } from "wouter";

export default function HomePage() {
  const [, setLocation] = useLocation();

  const handleSignUp = () => {
    setLocation("/signup");
  };

  const handleLogin = () => {
    setLocation("/login");
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${homeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Header */}
        <header className="px-8 md:px-12 py-8 flex items-center justify-between">
          {/* Left Navigation - Hidden on mobile */}
          <nav className="hidden md:flex space-x-8">
            <a 
              href="#" 
              className="text-[var(--botanical-green)] hover:text-[var(--botanical-light)] transition-colors font-medium"
              data-testid="nav-funding-events"
            >
              Funding Events
            </a>
            <a 
              href="#" 
              className="text-white hover:text-[var(--botanical-green)] transition-colors font-medium"
              data-testid="nav-insights"
            >
              Insights
            </a>
            <a 
              href="#" 
              className="text-white hover:text-[var(--botanical-green)] transition-colors font-medium"
              data-testid="nav-about"
            >
              About
            </a>
          </nav>

          {/* Mobile spacer */}
          <div className="md:hidden"></div>

          {/* Center Logo */}
          <div className="flex items-center space-x-2">
            <Leaf className="text-[var(--botanical-green)] w-6 h-6" />
            <span className="text-white font-semibold text-lg tracking-wide">ECOLENS</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleSignUp}
              className="bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-[var(--botanical-green)] transition-all px-4 md:px-6 py-2 rounded-full text-sm"
              data-testid="button-signup"
            >
              Sign up
            </Button>
            <button
              onClick={handleLogin}
              className="w-10 h-10 bg-[var(--botanical-green)] rounded-full flex items-center justify-center hover:bg-[var(--botanical-dark)] transition-colors"
              data-testid="button-login-icon"
            >
              <User className="text-white w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-8 md:px-16 relative">
          <div className="text-center relative z-10">
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] text-white leading-none tracking-tight font-bold">
              Climate
            </h1>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 md:px-16 py-6 flex flex-col sm:flex-row items-center justify-between text-sm space-y-2 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full border border-[var(--botanical-green)] rounded-3xl px-4 py-3 space-y-2 sm:space-y-0" style={{ borderWidth: '1px' }}>
            <div className="flex items-center space-x-2 text-white/80">
              <span>Power by</span>
              <span className="text-[var(--botanical-green)] font-medium">public data + AI tagging</span>
            </div>
            <div className="text-white/80">
              Updated: August 2025
            </div>
          </div>
        </footer>
      </div>
      {/* Single Full-Size Leaf Overlay - On top of everything including footer */}
      <div className="absolute inset-0 pointer-events-none z-50" style={{ overflow: 'visible' }}>
        <img 
          src={leafImage} 
          alt=""
          className="absolute -bottom-32 left-24 w-[80%] h-[105%] object-cover object-bottom"
          style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))' }}
        />
      </div>
    </div>
  );
}