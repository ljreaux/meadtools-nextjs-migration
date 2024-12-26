"use client";

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: { id: string; email: string; role: string } | null;
  loading: boolean;
  loginWithGoogle: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchAuthenticatedData: (endpoint: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email!,
        role: session.user.role!,
      });
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status]);

  const loginWithGoogle = () => signIn("google");

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid email or password");
      }

      const { accessToken, role } = await res.json();
      setToken(accessToken);
      setUser({ id: "from-token", email, role });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    signOut();
    setUser(null);
    setToken(null);
  };

  const fetchAuthenticatedData = async (endpoint: string) => {
    if (!user) throw new Error("User not authenticated");

    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch authenticated data");
    return res.json();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: status === "loading",
        loginWithGoogle,
        loginWithCredentials,
        logout,
        fetchAuthenticatedData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
