"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Menu,
  X,
  ChefHat,
  User,
  LogOut,
  Plus,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/explore", label: t.nav.explore },
    { href: "/planner", label: t.nav.planner },
    { href: "/favorites", label: t.nav.favorites },
  ];

  const isLanding = pathname === "/";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/explore?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isLanding
            ? "glass-strong shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container-app">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              id="nav-logo"
            >
              <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 transition-transform duration-300 group-hover:scale-110">
                <ChefHat size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                Yummy<span className="text-primary-600">Book</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative
                    ${
                      pathname === link.href
                        ? "text-primary-600"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-600" />
                  )}
                </Link>
              ))}
            </div>

            {/* Search Bar (Desktop) */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center relative max-w-xs flex-1 mx-4"
            >
              <Search
                size={16}
                className="absolute left-3 text-[var(--color-text-muted)]"
              />
              <input
                id="nav-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.search}
                className="input pl-10 pr-4 py-2 text-sm bg-[var(--color-surface-alt)]"
              />
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5">
              <LanguageToggle />
              <ThemeToggle />

              {user ? (
                <>
                  <Link
                    href="/recipe/submit"
                    className="hidden md:flex items-center gap-1.5 px-3 h-10 text-sm font-medium
                             text-primary-600 hover:bg-primary-50 transition-all duration-300"
                    id="nav-submit"
                  >
                    <Plus size={16} />
                    <span className="hidden xl:inline">{t.nav.submit}</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center justify-center w-10 h-10
                             text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                             hover:bg-[var(--color-surface-alt)] transition-all duration-300"
                    id="nav-profile"
                  >
                    <User size={18} />
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex btn-primary py-2 px-5 text-xs"
                  id="nav-login"
                >
                  <span>{t.nav.login}</span>
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10
                         text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                         transition-all duration-300 cursor-pointer"
                id="nav-mobile-toggle"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-400 ease-out ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="glass-strong border-t border-[var(--color-border-subtle)] px-5 py-4 space-y-1">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-3">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.search}
                className="input pl-10 py-2.5 text-sm"
              />
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-primary-600 bg-primary-50"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/recipe/submit"
                  className="block px-3 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors duration-200"
                >
                  {t.nav.submit}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-danger-500 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                >
                  <LogOut size={16} />
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="btn-primary flex-1 py-2.5 text-xs text-center">
                  <span>{t.nav.login}</span>
                </Link>
                <Link href="/register" className="btn-secondary flex-1 py-2.5 text-xs text-center">
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer */}
      {!isLanding && <div className="h-16 md:h-18" />}
    </>
  );
}
