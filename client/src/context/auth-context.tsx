import { createContext, useState, ReactNode } from "react";

type AuthMode = "login" | "signup";

interface AuthContextType {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthContext.Provider value={{ mode, setMode, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
