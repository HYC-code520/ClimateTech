import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import { useLocation } from "wouter";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { BotanicalBackground } from "./botanical-background";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useIsMobile } from "@/hooks/use-mobile";

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

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black z-40 flex items-center justify-center p-6">
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
      {/* Toggle Buttons */}
      <div className="absolute top-6 right-6 z-50 flex gap-3">
        <button
          onClick={handleSwitchToLogin}
          className={`toggle-btn px-6 py-2 rounded-full text-white font-medium text-sm ${
            mode === "login" ? "active" : ""
          }`}
          data-testid="login-toggle"
        >
          <span className="mr-2">←</span>
          LOG IN
        </button>
        <button
          onClick={handleSwitchToSignup}
          className={`toggle-btn px-6 py-2 rounded-full text-white font-medium text-sm ${
            mode === "signup" ? "active" : ""
          }`}
          data-testid="signup-toggle"
        >
          SIGN UP
          <span className="ml-2">→</span>
        </button>
      </div>

      {/* Profile Icon */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
          <User className="text-white text-lg" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Login Page - Full Screen */}
        {mode === "login" && (
          <motion.div
            key="login"
            className="w-full h-full flex"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {/* Left side - Form */}
            <div className="w-1/2 bg-black flex items-center justify-center p-12">
              <LoginForm />
            </div>
            {/* Right side - Background */}
            <BotanicalBackground type="login" />
          </motion.div>
        )}

        {/* Sign Up Page - Full Screen */}
        {mode === "signup" && (
          <motion.div
            key="signup"
            className="w-full h-full flex"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {/* Left side - Background */}
            <BotanicalBackground type="signup" />
            {/* Right side - Form */}
            <div className="w-1/2 bg-black flex items-center justify-center p-12">
              <SignupForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
