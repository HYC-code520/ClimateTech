import { SidebarNavigation } from "./sidebar-navigation";
import { Leaf, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import homeBg from "@assets/home-bg_1754320407119.png";

interface NavbarSidebarLayoutProps {
  children: React.ReactNode;
}

export function NavbarSidebarLayout({ children }: NavbarSidebarLayoutProps) {
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
      <div className="relative z-10 min-h-screen">
        {/* Navbar at the top (full width) */}
        <header className="relative z-50 px-8 md:px-12 py-8 flex items-center justify-between">
          {/* Left Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              className="text-[var(--botanical-green)] hover:text-[var(--botanical-light)] transition-colors font-medium"
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
        
        {/* Content area with sidebar and main content below navbar */}
        <div className="flex" style={{ height: 'calc(100vh - 120px)' }}>
          {/* Sidebar */}
          <SidebarNavigation className="flex-shrink-0" />
          
          {/* Main Content Area - this will contain the original page without its header */}
          <div className="flex-1 overflow-auto">
            <div className="px-8 md:px-12 pt-0 pb-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 