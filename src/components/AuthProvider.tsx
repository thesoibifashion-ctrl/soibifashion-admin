import { useEffect, useState } from "react";
import { initializeAuth } from "@/lib/auth-storage";
import { AuthContext } from "@/components/auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    initializeAuth().finally(() => setInitialized(true));
  }, []);
  return <AuthContext.Provider value={initialized}>{children}</AuthContext.Provider>;
}
