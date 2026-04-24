import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { authService } from "../api/authService";

export interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: User | null;
  logout: () => void;
  refreshUser: () => void;
}

function decodeToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // .NET JWT uses long-form claim URIs; fall back to short forms
    const name =
      payload["name"] ??
      payload["unique_name"] ??
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ??
      "";
    const email =
      payload["email"] ??
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ??
      "";
    const role =
      payload["role"] ??
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
      "user";
    return { name, email, role };
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  logout: () => {},
  refreshUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = authService.getToken();
    return token ? decodeToken(token) : null;
  });

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(() => {
    const token = authService.getToken();
    setUser(token ? decodeToken(token) : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
