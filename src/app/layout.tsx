import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "YummyBook — Discover & Cook Amazing Recipes",
    template: "%s | YummyBook",
  },
  description:
    "Your personal recipe book — discover, save, plan and cook delicious meals from around the world. Browse thousands of recipes, plan your weekly meals, and share your own creations.",
  keywords: [
    "recipes",
    "cooking",
    "meal planner",
    "food",
    "recipe book",
    "YummyBook",
  ],
  openGraph: {
    title: "YummyBook — Discover & Cook Amazing Recipes",
    description:
      "Your personal recipe book for discovering & planning meals from around the world.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        {/* Prevent FOUC for dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('yummybook-theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
