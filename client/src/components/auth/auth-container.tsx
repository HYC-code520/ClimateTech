import { motion, AnimatePresence } from "framer-motion";
import { User, Home, Leaf } from "lucide-react";
import { useLocation } from "wouter";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { BotanicalBackground } from "./botanical-background";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useIsMobile } from "@/hooks/use-mobile";
import leafImage from "@assets/leaf-image-bg_1754253561241.png";

export function AuthContainer() {
  const [, setLocation] = useLocation();
  const { mode, setMode } = useAuthContext();
  const isMobile = useIsMobile();

  const handleSwitchToLogin = () => {
    setMode("login");
    setLocation("/login");
  };

  const handleSwitchToSignup = () => {
    setMode("signup");
    setLocation("/signup");
  };

  const handleGoHome = () => {
    setLocation("/");
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black z-40 flex items-center justify-center p-6">
        {/* Mobile Home Button */}
        <button
          onClick={handleGoHome}
          className="absolute top-6 left-6 z-50 flex items-center space-x-2 text-white hover:text-[var(--botanical-green)] transition-colors"
          data-testid="mobile-home-button"
        >
          <Leaf className="w-5 h-5" />
          <span className="text-sm font-medium">ECOLENS</span>
        </button>

        <div className="max-w-sm w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-white text-xl" />
            </div>
            <h1 className="text-3xl font-light text-white mb-2">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-400 text-sm">
              {mode === "login" ? "Sign in to continue" : "Sign up to get started"}
            </p>
          </div>

          {/* Mobile Toggle */}
          <div className="flex mb-8 bg-gray-900 rounded-full p-1">
            <button
              onClick={handleSwitchToLogin}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-[var(--botanical-green)] text-white"
                  : "text-gray-400"
              }`}
              data-testid="mobile-login-toggle"
            >
              Login
            </button>
            <button
              onClick={handleSwitchToSignup}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-[var(--botanical-green)] text-white"
                  : "text-gray-400"
              }`}
              data-testid="mobile-signup-toggle"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Form */}
          {mode === "login" ? <LoginForm isMobile={true} /> : <SignupForm isMobile={true} />}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen flex overflow-hidden">
      {/* Home Button */}
      <button
        onClick={handleGoHome}
        className="absolute top-6 left-6 z-50 flex items-center space-x-2 text-white hover:text-[var(--botanical-green)] transition-colors"
        data-testid="desktop-home-button"
      >
        <Leaf className="w-6 h-6" />
        <span className="text-lg font-semibold tracking-wide">ECOLENS</span>
      </button>

      {/* Toggle Button - Top Center */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
        {mode === "login" ? (
          <button
            onClick={handleSwitchToSignup}
            className="toggle-btn px-6 py-2 rounded-full text-white font-medium text-sm"
            data-testid="signup-toggle"
          >
            SIGN UP
            <span className="ml-2">→</span>
          </button>
        ) : (
          <button
            onClick={handleSwitchToLogin}
            className="toggle-btn px-6 py-2 rounded-full text-white font-medium text-sm"
            data-testid="login-toggle"
          >
            <span className="mr-2">←</span>
            LOG IN
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Single Full-Width Background */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${leafImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-[var(--botanical-green)]/10"></div>
        </div>

        {/* Single sliding black container */}
        <div className="w-full h-full flex relative z-10">
          <motion.div
            className="w-1/2 bg-black flex items-center justify-center p-12 absolute top-0 h-full"
            animate={{
              left: mode === "login" ? "0%" : "50%"
            }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <AnimatePresence mode="wait">
              {mode === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm />
                </motion.div>
              )}
              
              {mode === "signup" && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SignupForm />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  );
}
