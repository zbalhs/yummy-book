"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, CalendarDays, User } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

import { useAuth } from "@/lib/auth/context";

export default function MobileNav() {
  const { user } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();

  // Don't show on landing page
  if (pathname === "/") return null;

  const items = [
    { id: "home", href: "/explore", label: t.nav.home, icon: Home },
    { id: "explore", href: "/explore?search=true", label: t.nav.explore, icon: Search },
    { id: "submit", href: user ? "/recipe/submit" : "/login", label: t.nav.submit, icon: Plus, isAction: true },
    { id: "planner", href: user ? "/planner" : "/login", label: t.nav.planner, icon: CalendarDays },
    { id: "profile", href: user ? "/profile" : "/login", label: t.nav.profile, icon: User },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong
                 border-t border-[var(--color-border-subtle)]"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href === "/explore" && pathname.startsWith("/explore"));
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
                id={`mobile-nav-${item.id}`}
              >
                <div
                  className="flex items-center justify-center w-12 h-12
                           bg-gradient-to-br from-primary-500 to-primary-700
                           shadow-lg shadow-primary-500/30 transition-transform duration-300
                           hover:scale-110 active:scale-95"
                >
                  <Icon size={22} className="text-white" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-all duration-300 ${
                isActive
                  ? "text-primary-600"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              }`}
              id={`mobile-nav-${item.id}`}
            >
              <Icon
                size={20}
                className={`transition-transform duration-300 ${
                  isActive ? "scale-110" : ""
                }`}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-primary-600" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Safe area for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
