"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ChefHat,
  CalendarDays,
  Heart,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Globe,
  Star,
  TrendingUp,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface MealPreview {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

function useIntersection(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export default function LandingPage() {
  const { t } = useI18n();
  const [meals, setMeals] = useState<MealPreview[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const featuresRef = useIntersection(0.15);
  const categoriesRef = useIntersection(0.1);
  const popularRef = useIntersection(0.1);
  const ctaRef = useIntersection(0.2);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    // Fetch random meals for trending section
    async function fetchMeals() {
      try {
        const promises = Array.from({ length: 8 }, () =>
          fetch("https://www.themealdb.com/api/json/v1/1/random.php").then((r) => r.json())
        );
        const results = await Promise.all(promises);
        const seen = new Set<string>();
        const uniqueMeals = results
          .map((r) => r.meals?.[0])
          .filter((m): m is MealPreview => {
            if (!m || seen.has(m.idMeal)) return false;
            seen.add(m.idMeal);
            return true;
          });
        setMeals(uniqueMeals);
      } catch (err) {
        console.error("Failed to fetch meals:", err);
      }
    }

    async function fetchCategories() {
      try {
        const res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
        const data = await res.json();
        setCategories((data.categories || []).slice(0, 8));
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }

    fetchMeals();
    fetchCategories();
  }, []);

  const features = [
    {
      icon: Search,
      title: t.landing.feature1Title,
      desc: t.landing.feature1Desc,
      color: "from-primary-500 to-primary-700",
    },
    {
      icon: CalendarDays,
      title: t.landing.feature2Title,
      desc: t.landing.feature2Desc,
      color: "from-accent-500 to-accent-700",
    },
    {
      icon: Heart,
      title: t.landing.feature3Title,
      desc: t.landing.feature3Desc,
      color: "from-rose-500 to-rose-700",
    },
    {
      icon: MessageSquare,
      title: t.landing.feature4Title,
      desc: t.landing.feature4Desc,
      color: "from-sage-500 to-sage-700",
    },
  ];

  return (
    <div className="page-enter bg-[var(--color-surface)] text-[var(--color-text-primary)]">
      {/* ===============================
          HERO SECTION
          =============================== */}
      <section
        id="hero-section"
        className="relative min-h-[90vh] flex items-center overflow-hidden py-16 md:py-24 border-b border-[var(--color-border)]"
      >
        <div className="container-app relative z-10 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left - Text (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[var(--color-primary-500)] uppercase mb-6 block">
                YummyBook // The Culinary Journal
              </span>

              <h1
                className="text-5xl sm:text-6xl lg:text-7.5xl font-light leading-[1.05] tracking-tight mb-8 font-display"
              >
                {t.landing.heroTitle}{" "}
                <span className="text-[var(--color-primary-500)] font-normal italic">
                  {t.landing.heroHighlight}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8 max-w-lg font-sans">
                {t.landing.heroSubtitle}
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/explore" className="btn-primary py-3.5 px-8 text-sm">
                  <span className="flex items-center gap-2">
                    {t.landing.heroCta}
                    <ArrowRight size={16} />
                  </span>
                </Link>
                <Link href="/register" className="btn-secondary py-3.5 px-8 text-sm">
                  {t.landing.heroCtaSecondary}
                </Link>
              </div>

              {/* Editorial Stats Strip */}
              <div className="pt-8 border-t border-[var(--color-border)] grid grid-cols-3 gap-6 max-w-md">
                {[
                  { label: "Recipes", value: "10K+" },
                  { label: "Countries", value: "25+" },
                  { label: "Home Cooks", value: "50K+" },
                ].map((stat) => (
                  <div key={stat.label} className="text-left">
                    <div className="text-2xl sm:text-3xl font-light font-display text-[var(--color-text-primary)]">
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.15em] mt-1 font-semibold">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Asymmetrical Editorial Artwork (5 cols) */}
            <div className="lg:col-span-5 relative hidden lg:block">
              {meals.length >= 2 && (
                <div className="relative w-full h-[500px]">
                  {/* Large Primary Cookbook Image */}
                  <div className="absolute top-0 right-4 w-[280px] h-[380px] overflow-hidden shadow-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                    <Image
                      src={meals[0].strMealThumb}
                      alt={meals[0].strMeal}
                      fill
                      sizes="300px"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-primary-200)] block mb-1">
                        Featured Recipe
                      </span>
                      <h4 className="font-display font-light text-base leading-snug line-clamp-2">
                        {meals[0].strMeal}
                      </h4>
                    </div>
                  </div>

                  {/* Overlapping Secondary Image */}
                  <div className="absolute bottom-4 left-4 w-[220px] h-[280px] overflow-hidden shadow-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] z-20">
                    <Image
                      src={meals[1].strMealThumb}
                      alt={meals[1].strMeal}
                      fill
                      sizes="250px"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <span className="text-[8px] uppercase tracking-[0.2em] text-[var(--color-primary-200)] block mb-1">
                        {meals[1].strArea} Cuisine
                      </span>
                      <h4 className="font-display font-light text-sm leading-snug line-clamp-2">
                        {meals[1].strMeal}
                      </h4>
                    </div>
                  </div>

                  {/* Tactile Recipe Index Overlay Badge */}
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 z-30 bg-[var(--color-primary-500)] text-white px-4 py-3 shadow-lg border border-[var(--color-primary-600)]">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="fill-white text-white animate-pulse" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest leading-none font-semibold">Community</p>
                        <p className="text-sm font-bold mt-0.5 leading-none">4.9 / 5 Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===============================
          FEATURES SECTION (Spruce Dark Canvas Track)
          =============================== */}
      <section
        id="features-section"
        ref={featuresRef.ref}
        className="py-20 md:py-28 bg-[#0e1b15] text-[#f5f2eb] relative overflow-hidden"
      >
        {/* Subtle decorative plant overlay background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        
        <div className="container-app relative z-10">
          <div className="max-w-2xl mb-16">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-[var(--color-primary-300)] uppercase mb-4 block">
              Core Experience
            </span>
            <h2
              className={`text-4xl md:text-5xl font-light tracking-tight font-display text-white transition-all duration-700 ${
                featuresRef.visible ? "animate-fade-in-up" : "opacity-0"
              }`}
            >
              {t.landing.featuresTitle}{" "}
              <span className="text-[var(--color-primary-200)] font-normal italic">
                {t.landing.featuresSubtitle}
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`p-6 border border-[#20342c] bg-[#12241d] hover:border-[var(--color-primary-400)] transition-all duration-500 group ${
                    featuresRef.visible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-10 h-10 mb-6 flex items-center justify-center text-[var(--color-primary-300)] group-hover:text-[var(--color-primary-400)] transition-colors duration-300">
                    <Icon size={24} className="stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-3 font-display">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#8ca18d] leading-relaxed font-sans">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===============================
          CATEGORIES SECTION (Oatmeal Light Canvas Track)
          =============================== */}
      <section
        id="categories-section"
        ref={categoriesRef.ref}
        className="py-20 md:py-28 bg-[var(--color-surface)] border-b border-[var(--color-border)]"
      >
        <div className="container-app">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[10px] font-semibold tracking-[0.25em] text-[var(--color-primary-500)] uppercase mb-4 block">
                Explore Categories
              </span>
              <h2
                className={`text-4xl md:text-5xl font-light tracking-tight font-display transition-all duration-700 ${
                  categoriesRef.visible ? "animate-fade-in-up" : "opacity-0"
                }`}
              >
                {t.landing.categoriesTitle}{" "}
                <span className="text-[var(--color-primary-500)] font-normal italic">
                  {t.landing.categoriesHighlight}
                </span>
              </h2>
            </div>
            <Link
              href="/explore"
              className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] transition-all duration-300 ${
                categoriesRef.visible ? "animate-fade-in" : "opacity-0"
              }`}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={cat.idCategory}
                href={`/explore?category=${cat.strCategory}`}
                className={`relative group overflow-hidden aspect-[4/5] border border-[var(--color-border)] bg-[var(--color-surface-alt)] shadow-sm transition-all duration-700 ${
                  categoriesRef.visible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
                id={`category-${cat.strCategory.toLowerCase()}`}
              >
                <Image
                  src={cat.strCategoryThumb}
                  alt={cat.strCategory}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b18]/80 via-[#1e1b18]/10 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-[var(--color-primary-500)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
                  <h3 className="text-base font-medium font-display leading-tight">
                    {cat.strCategory}
                  </h3>
                  <p className="text-white/70 text-[10px] uppercase tracking-wider mt-1 line-clamp-1">
                    {cat.strCategoryDescription.slice(0, 50)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===============================
          TRENDING RECIPES SECTION (Warm Sand Contrast Canvas Track)
          =============================== */}
      <section
        id="popular-section"
        ref={popularRef.ref}
        className="py-20 md:py-28 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]"
      >
        <div className="container-app">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[10px] font-semibold tracking-[0.25em] text-[var(--color-primary-500)] uppercase mb-4 block">
                Trending Kitchen Selections
              </span>
              <h2
                className={`text-4xl md:text-5xl font-light tracking-tight font-display transition-all duration-700 ${
                  popularRef.visible ? "animate-fade-in-up" : "opacity-0"
                }`}
              >
                {t.landing.popularTitle}{" "}
                <span className="text-[var(--color-primary-500)] font-normal italic">
                  {t.landing.popularHighlight}
                </span>
              </h2>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-500)]"
            >
              Explore Recipes <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {meals.slice(0, 8).map((meal, i) => (
              <Link
                key={meal.idMeal}
                href={`/recipe/${meal.idMeal}`}
                className={`group overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary-500)] transition-all duration-500 ${
                  popularRef.visible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
                id={`trending-meal-${meal.idMeal}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]">
                  <Image
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 text-[var(--color-text-primary)] text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 border border-[var(--color-border)]">
                    {meal.strArea || "Global"}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-[9px] uppercase tracking-widest text-[var(--color-primary-500)] font-semibold block mb-1">
                    {meal.strCategory || "Recipe"}
                  </span>
                  <h3 className="text-base font-medium font-display text-[var(--color-text-primary)] line-clamp-2 mb-2 leading-snug">
                    {meal.strMeal}
                  </h3>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--color-border-subtle)] text-[10px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <ChefHat size={12} className="text-[var(--color-primary-500)]" />
                      Easy Cook
                    </span>
                    <span className="text-[var(--color-primary-500)] flex items-center gap-0.5">
                      Cook now <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===============================
          CTA SECTION (Oatmeal Alabaster)
          =============================== */}
      <section
        id="cta-section"
        ref={ctaRef.ref}
        className="py-20 md:py-28 relative overflow-hidden bg-[var(--color-surface)]"
      >
        <div className="container-app relative z-10">
          <div
            className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
              ctaRef.visible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <span className="text-[10px] font-semibold tracking-[0.25em] text-[var(--color-primary-500)] uppercase mb-4 block">
              Join Our Community
            </span>
            <h2
              className="text-4xl md:text-5xl font-light tracking-tight font-display mb-6 leading-tight"
            >
              {t.landing.ctaTitle}
            </h2>
            <p className="text-base text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto leading-relaxed font-sans">
              {t.landing.ctaSubtitle}
            </p>
            <Link
              href="/register"
              className="btn-primary py-4 px-10 text-sm inline-flex items-center justify-center"
              id="cta-register"
            >
              <span className="flex items-center gap-2">
                {t.landing.ctaCta}
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
