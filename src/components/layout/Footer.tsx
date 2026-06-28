"use client";

import Link from "next/link";
import { ChefHat, Globe, MessageCircle, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer
      id="main-footer"
      className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]"
    >
      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 transition-transform duration-300 group-hover:scale-110">
                <ChefHat size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                Yummy<span className="text-primary-600">Book</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)] max-w-sm leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: MessageCircle, href: "#" },
                { icon: Globe, href: "#" },
                { icon: Mail, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="flex items-center justify-center w-9 h-9 text-[var(--color-text-muted)]
                           hover:text-primary-600 hover:bg-primary-50 transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: t.nav.explore, href: "/explore" },
                { label: t.nav.planner, href: "/planner" },
                { label: t.nav.favorites, href: "/favorites" },
                { label: t.nav.submit, href: "/recipe/submit" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-primary-600 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 uppercase tracking-wider">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#"
                  className="text-sm text-[var(--color-text-secondary)] hover:text-primary-600 transition-colors duration-200"
                >
                  {t.footer.privacy}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-[var(--color-text-secondary)] hover:text-primary-600 transition-colors duration-200"
                >
                  {t.footer.terms}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--color-border-subtle)]">
          <p className="text-xs text-[var(--color-text-muted)] text-center">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
