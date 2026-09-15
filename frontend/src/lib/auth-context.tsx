"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { apiFetch, setTokens, clearTokens } from "./api";

export type Role = "super_admin" | "admin" | "instruktur" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const hasToken = typeof window !== "undefined" && localStorage.getItem("lms_access_token");
    if (!hasToken) {
      setLoading(false);
      return;
    }
    try {
      const me = await apiFetch<AuthUser>("/auth/me");
      setUser(me);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ user: AuthUser; accessToken: string; refreshToken: string }>(
      "/auth/login",
      { method: "POST", body: { email, password }, auth: false },
    );
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await apiFetch<{ user: AuthUser; accessToken: string; refreshToken: string }>(
      "/auth/register",
      { method: "POST", body: { name, email, password }, auth: false },
    );
    setTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  instruktur: "Instruktur",
  user: "Peserta",
};

export const ROLE_HOME: Record<Role, string> = {
  super_admin: "/dashboard/super-admin",
  admin: "/dashboard/admin",
  instruktur: "/dashboard/instruktur",
  user: "/dashboard/user",
};
