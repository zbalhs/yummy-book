"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface UserType {
  id: string;
  email?: string;
  fullName?: string;
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  logout: () => Promise<void>;
  loginMock: (email: string, fullName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const isMockMode =
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "placeholder-key" ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "";

  useEffect(() => {
    if (isMockMode) {
      const savedUser = localStorage.getItem("yummybook-user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    } else {
      const supabase = createClient();
      
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name,
          });
        }
        setLoading(false);
      });

      // Listen for changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              fullName: session.user.user_metadata?.full_name,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isMockMode]);

  const loginMock = (email: string, fullName: string) => {
    const mockUser = { id: "mock-user-id", email, fullName };
    setUser(mockUser);
    localStorage.setItem("yummybook-user", JSON.stringify(mockUser));
    document.cookie = "mock-session=true; path=/; max-age=3600";
  };

  const logout = async () => {
    if (isMockMode) {
      setUser(null);
      localStorage.removeItem("yummybook-user");
      document.cookie = "mock-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/";
    } else {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, loginMock }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
