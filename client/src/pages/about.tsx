import { Leaf, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function AboutPage() {
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
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <header className="relative z-50 px-8 md:px-12 py-8 flex items-center justify-between">
        {/* Left Navigation */}
        <nav className="hidden md:flex space-x-8">
          <button 
            onClick={handleGoHome}
            className="text-white hover:text-[var(--botanical-green)] transition-colors font-medium"
          >
            Home
          </button>
          <button 
            onClick={() => setLocation("/funding-tracker")}
            className="text-white hover:text-[var(--botanical-green)] transition-colors font-medium"
          >
            Funding Tracker
          </button>
          <button 
            onClick={() => setLocation("/insights")}
            className="text-white hover:text-[var(--botanical-green)] transition-colors font-medium"
          >
            Insights
          </button>
          <button 
            className="text-[var(--botanical-green)] hover:text-[var(--botanical-light)] transition-colors font-medium"
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
            About
          </h1>
          <div className="space-y-6">
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              ECOLENS is your comprehensive platform for climate technology insights and funding intelligence.
            </p>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-400 text-lg mb-4">
                This page is under construction
              </p>
              <p className="text-gray-500">
                Coming soon: Our mission, team information, methodology, and company details.
              </p>
            </div>
          </div>
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
  );
} 