import { Leaf, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import homeBg from "@assets/home-bg_1754320407119.png";

export default function InsightsPage() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  const handleLogin = () => {
    setLocation("/login");
  };

  const handleSignUp = () => {
    setLocation("/signup");
  };

  return (
    <div 
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        backgroundImage: `url(${homeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Header */}
        <header className="relative z-50 px-8 md:px-12 py-8 flex items-center justify-between">
          {/* Left Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => setLocation("/funding-events")}
              className="text-[var(--botanical-green)] hover:text-[var(--botanical-light)] transition-colors font-medium"
            >
              Funding Events
            </button>
            <button 
              onClick={() => setLocation("/insights")}
              className="text-white hover:text-[var(--botanical-green)] transition-colors font-medium"
            >
              Insights
            </button>
            <button 
              onClick={() => setLocation("/about")}
              className="text-white hover:text-[var(--botanical-green)] transition-colors font-medium"
            >
              About
            </button>
          </nav>

          {/* Mobile spacer */}
          <div className="md:hidden"></div>

          {/* Center Logo */}
          <button 
            onClick={handleGoHome}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Leaf className="text-[var(--botanical-green)] w-6 h-6" />
            <span className="text-white font-semibold text-lg tracking-wide">ECOLENS</span>
          </button>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleSignUp}
              className="bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-[var(--botanical-green)] transition-all px-4 md:px-6 py-2 rounded-full text-sm"
            >
              Sign up
            </Button>
            <button
              onClick={handleLogin}
              className="w-10 h-10 bg-[var(--botanical-green)] rounded-full flex items-center justify-center hover:bg-[var(--botanical-dark)] transition-colors"
            >
              <User className="text-white w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-8 md:px-16 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl text-white leading-none tracking-tight font-semibold mb-8">
              Insights
            </h1>
            <div className="space-y-6">
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Discover climate tech trends, market analysis, and investment insights powered by AI.
              </p>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-400 text-lg mb-4">
                  This page is under construction
                </p>
                <p className="text-gray-500">
                  Coming soon: Market trends, investment patterns, sector analysis, and AI-powered insights.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 