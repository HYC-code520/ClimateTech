import { Leaf, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import homeBg from "@assets/home-bg_1754320407119.png";
import leafImage from "@assets/home-page-leaf_1754320774579.png";
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
        <header className="px-4 md:px-6 py-6 flex items-center justify-between">
          {/* Left Navigation - Hidden on mobile */}
          <nav className="hidden md:flex space-x-8">
            <a 
              href="#" 
              className="text-white hover:text-[var(--botanical-green)] transition-colors font-medium"
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
        <main className="flex-1 flex items-center justify-center px-4 md:px-6 relative">
          {/* Floating Leaf Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Top left small leaf */}
            <img 
              src={leafImage} 
              alt=""
              className="absolute top-10 left-[15%] w-16 h-16 md:w-20 md:h-20 object-contain transform rotate-12 opacity-90"
              style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
            />
            
            {/* Top right medium leaf */}
            <img 
              src={leafImage} 
              alt=""
              className="absolute top-16 right-[12%] w-24 h-24 md:w-32 md:h-32 object-contain transform -rotate-6 opacity-95"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
            />
            
            {/* Bottom center large leaf - main focal point */}
            <img 
              src={leafImage} 
              alt=""
              className="absolute bottom-8 left-[8%] w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain transform rotate-3 opacity-100"
              style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))' }}
            />
            
            {/* Additional decorative leaf - middle right */}
            <img 
              src={leafImage} 
              alt=""
              className="absolute top-1/2 right-[20%] w-12 h-12 md:w-16 md:h-16 object-contain transform rotate-45 opacity-80"
              style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))' }}
            />
          </div>

          <div className="text-center relative z-10">
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] font-light text-white leading-none tracking-tight">
              Climate
            </h1>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-sm space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2 text-white/80">
            <span>Power by</span>
            <span className="text-[var(--botanical-green)] font-medium">public data + AI tagging</span>
          </div>
          <div className="text-white/80">
            Updated: August 2025
          </div>
        </footer>
      </div>
    </div>
  );
}