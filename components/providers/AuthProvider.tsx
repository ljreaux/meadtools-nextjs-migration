"use client";

import { useToast } from "@/hooks/use-toast";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface AuthContextType {
  user: { id: string; email: string; role: string } | null;
  loading: boolean;
  loginWithGoogle: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchAuthenticatedData: (endpoint: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const googleToastShown = !!JSON.parse(
      JSON.stringify(localStorage.getItem("googleToastShown"))
    );

    if (status === "authenticated" && session?.user) {
      if (googleToastShown) {
        toast({
          title: t("auth.googleLogin.success.title", "Logged in with Google!"),
          description: t(
            "auth.googleLogin.success.description",
            "Welcome back!"
          ),
          variant: "default",
        });
        localStorage.removeItem("googleToastShown");
      }
      setUser({
        id: session.user.id,
        email: session.user.email!,
        role: session.user.role!,
      });
      setToken(null); // Clear custom token
    } else if (storedToken) {
      setToken(storedToken);
      fetch("/api/auth/accountInfo", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user data");
          return res.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          localStorage.removeItem("accessToken");
          setToken(null);
        });
    } else {
      setUser(null);
    }

    setLoading(false);
  }, [session, status]);

  const loginWithGoogle = async () => {
    try {
      localStorage.setItem("googleToastShown", "true");
      await signIn("google");
    } catch (error) {
      toast({
        title: t("auth.googleLogin.error.title", "Google Login Failed"),
        description: t(
          "auth.googleLogin.error.description",
          "Please try again later."
        ),
        variant: "destructive",
      });
    }
  };

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
        const errorData = await res.json();
        throw new Error(
          errorData.error || t("auth.login.error.description", "Invalid login.")
        );
      }

      const { accessToken, role, id } = await res.json();
      setToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      setUser({ id, email, role });

      toast({
        title: t("auth.login.success.title", "Login Successful!"),
        description: t(
          "auth.login.success.description",
          `Welcome back, ${email}!`
        ),
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: t("auth.login.error.title", "Login Failed"),
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || t("auth.registration.error.description", "Error!")
        );
      }

      const { accessToken, role, id } = await res.json();
      setToken(accessToken);
      localStorage.setItem("accessToken", accessToken);
      setUser({ id, email, role });

      toast({
        title: t("auth.registration.success.title", "Registration Successful!"),
        description: t(
          "auth.registration.success.description",
          "You can now access your account."
        ),
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: t("auth.registration.error.title", "Registration Failed"),
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("accessToken");

    await signOut({ redirect: false });

    toast({
      title: t("auth.logout.success.title", "Logged out successfully."),
      description: t("auth.logout.success.description", "See you next time!"),
      variant: "default",
    });
  };

  const fetchAuthenticatedData = async (endpoint: string) => {
    if (!user) throw new Error("User not authenticated");

    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(endpoint, { headers });

    if (!res.ok) {
      if (res.status === 401) {
        logout();
        throw new Error("Session expired. Please log in again.");
      }
      throw new Error("Failed to fetch authenticated data");
    }

    return res.json();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithCredentials,
        register,
        logout,
        fetchAuthenticatedData,
      }}
    >
      <SessionProvider>{children}</SessionProvider>
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
