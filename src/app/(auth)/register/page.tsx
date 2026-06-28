"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, ChefHat, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/context";

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { loginMock } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const isMockMode =
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "placeholder-key" ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "";

    if (isMockMode) {
      loginMock(email, fullName);
      router.push("/explore");
      router.refresh();
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push("/explore");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-bl from-sage-50 via-cream-50 to-primary-50" />
        <div className="absolute top-40 left-20 w-80 h-80 bg-sage-200/40 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl animate-float delay-500" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--color-text-primary) 1px, transparent 1px),
                             linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        <div className="card p-8 md:p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700">
              <ChefHat size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Yummy<span className="text-primary-600">Book</span>
            </span>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-bold text-[var(--color-text-primary)] mb-1"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t.auth.registerTitle}
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {t.auth.registerSubtitle}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in-down">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="register-name" className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                {t.auth.fullName}
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="register-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input pl-10"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                {t.auth.email}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="hello@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                {t.auth.password}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="Min. 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="register-confirm" className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                {t.auth.confirmPassword}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="register-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              id="register-submit"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {t.auth.registerBtn}
                    <ArrowRight size={16} />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-[var(--color-text-secondary)] mt-8">
            {t.auth.hasAccount}{" "}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              {t.auth.loginBtn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
