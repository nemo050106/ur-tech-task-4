"use client";

import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // In-memory demo login state only (no localStorage, cookies, or auth tokens)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = (email: string, pass: string): boolean => {
    if (email.trim() === "demo@example.com" && pass === "Demo123") {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = (): void => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
