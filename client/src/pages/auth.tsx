import { useLocation } from "wouter";
import { useEffect } from "react";
import { AuthContainer } from "@/components/auth/auth-container";
import { useAuthContext } from "@/hooks/use-auth-context";

export default function AuthPage() {
  const [location] = useLocation();
  const { setMode, mode } = useAuthContext();

  useEffect(() => {
    if (location === "/signup") {
      setMode("signup");
    } else {
      setMode("login");
    }
  }, [location, setMode]);

  return (
    <div className="min-h-screen bg-black">
      <AuthContainer />
    </div>
  );
}
