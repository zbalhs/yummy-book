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
    <div className="page-enter">
      {/* ===============================
          HERO SECTION
          =============================== */}
      <section
        id="hero-section"
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-200/30 rounded-full blur-3xl"
            style={{
              transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`,
              transition: "transform 0.8s ease-out",
            }}
          />
          <div
            className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-accent-200/20 rounded-full blur-3xl"
            style={{
              transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
              transition: "transform 0.8s ease-out",
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-warm-200/20 rounded-full blur-3xl"
            style={{
              transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
              transition: "transform 0.8s ease-out",
            }}
          />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(var(--color-text-primary) 1px, transparent 1px),
                               linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="container-app relative z-10 py-24 md:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div className="max-w-xl">
              <div className="animate-fade-in-down inline-flex items-center gap-2 px-4 py-1.5 mb-6
                            bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Recipe Discovery Platform</span>
              </div>

              <h1
                className="animate-fade-in-up text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {t.landing.heroTitle}{" "}
                <span className="gradient-text">{t.landing.heroHighlight}</span>
              </h1>

              <p className="animate-fade-in-up delay-200 text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8 max-w-md opacity-0">
                {t.landing.heroSubtitle}
              </p>

              <div className="animate-fade-in-up delay-400 flex flex-wrap gap-3 opacity-0">
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

              {/* Stats */}
              <div className="animate-fade-in-up delay-600 flex items-center gap-8 mt-12 opacity-0">
                {[
                  { label: "Recipes", value: "10K+" },
                  { label: "Countries", value: "25+" },
                  { label: "Users", value: "50K+" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                      {stat.value}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Food Grid */}
            <div className="hidden lg:block relative">
              <div className="relative animate-fade-in delay-300 opacity-0">
                {/* Floating food cards */}
                <div className="grid grid-cols-2 gap-4">
                  {meals.slice(0, 4).map((meal, i) => (
                    <div
                      key={meal.idMeal}
                      className={`relative overflow-hidden shadow-2xl group animate-fade-in-up opacity-0 ${
                        i % 2 === 1 ? "mt-8" : ""
                      }`}
                      style={{
                        animationDelay: `${400 + i * 150}ms`,
                        transform: `translateY(${mousePos.y * (i % 2 === 0 ? -8 : 8)}px)`,
                        transition: "transform 1s ease-out",
                      }}
                    >
                      <div className="aspect-[3/4] relative">
                        <Image
                          src={meal.strMealThumb}
                          alt={meal.strMeal}
                          fill
                          sizes="250px"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-sm font-semibold line-clamp-2">
                            {meal.strMeal}
                          </p>
                          <p className="text-white/70 text-xs mt-1">
                            {meal.strArea || meal.strCategory}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating accent card */}
                <div
                  className="absolute -bottom-6 -left-6 glass p-4 shadow-xl animate-bounce-in delay-800 opacity-0"
                  style={{
                    transform: `translateY(${mousePos.y * -12}px)`,
                    transition: "transform 1s ease-out",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-600">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        25+ Cuisines
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        From around the world
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating float */}
                <div
                  className="absolute -top-4 -right-4 glass p-3 shadow-xl animate-bounce-in delay-600 opacity-0"
                  style={{
                    transform: `translateY(${mousePos.y * 10}px)`,
                    transition: "transform 1s ease-out",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Star size={18} className="fill-amber-500 text-amber-500" />
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">4.9</span>
                    <span className="text-xs text-[var(--color-text-muted)]">Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-[var(--color-text-muted)] rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 bg-[var(--color-text-muted)] rounded-full animate-pulse-soft" />
          </div>
        </div>
      </section>

      {/* ===============================
          FEATURES SECTION
          =============================== */}
      <section
        id="features-section"
        ref={featuresRef.ref}
        className="py-24 md:py-32 bg-[var(--color-surface-alt)]"
      >
        <div className="container-app">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl md:text-5xl font-bold tracking-tight mb-4 transition-all duration-700 ${
                featuresRef.visible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t.landing.featuresTitle}{" "}
              <span className="gradient-text">{t.landing.featuresSubtitle}</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`card p-6 group cursor-default transition-all duration-700 ${
                    featuresRef.visible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div
                    className={`flex items-center justify-center w-12 h-12 mb-5
                              bg-gradient-to-br ${feature.color} text-white
                              transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===============================
          CATEGORIES SECTION
          =============================== */}
      <section
        id="categories-section"
        ref={categoriesRef.ref}
        className="py-24 md:py-32"
      >
        <div className="container-app">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2
                className={`text-4xl md:text-5xl font-bold tracking-tight mb-2 transition-all duration-700 ${
                  categoriesRef.visible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {t.landing.categoriesTitle}{" "}
                <span className="gradient-text">{t.landing.categoriesHighlight}</span>
              </h2>
            </div>
            <Link
              href="/explore"
              className={`hidden md:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-all duration-300 ${
                categoriesRef.visible ? "animate-fade-in" : "opacity-0"
              }`}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.idCategory}
                href={`/explore?category=${cat.strCategory}`}
                className={`relative group overflow-hidden aspect-[4/3] transition-all duration-700 ${
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
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/20 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-sm md:text-base font-bold">
                    {cat.strCategory}
                  </h3>
                  <p className="text-white/70 text-xs mt-0.5 line-clamp-1">
                    {cat.strCategoryDescription.slice(0, 60)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===============================
          TRENDING RECIPES SECTION
          =============================== */}
      <section
        id="popular-section"
        ref={popularRef.ref}
        className="py-24 md:py-32 bg-[var(--color-surface-alt)]"
      >
        <div className="container-app">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-primary-600" />
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
              Trending Now
            </span>
          </div>
          <h2
            className={`text-4xl md:text-5xl font-bold tracking-tight mb-12 transition-all duration-700 ${
              popularRef.visible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t.landing.popularTitle}{" "}
            <span className="gradient-text">{t.landing.popularHighlight}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {meals.slice(0, 8).map((meal, i) => (
              <Link
                key={meal.idMeal}
                href={`/recipe/${meal.idMeal}`}
                className={`card group overflow-hidden transition-all duration-700 ${
                  popularRef.visible ? "animate-fade-in-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
                id={`trending-meal-${meal.idMeal}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 mb-1
                               group-hover:text-primary-600 transition-colors duration-300">
                    {meal.strMeal}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <ChefHat size={12} />
                    <span>{meal.strArea || meal.strCategory}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===============================
          CTA SECTION
          =============================== */}
      <section
        id="cta-section"
        ref={ctaRef.ref}
        className="py-24 md:py-32 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-transparent to-accent-50 opacity-50" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent-200/20 rounded-full blur-3xl" />
        </div>

        <div className="container-app relative z-10">
          <div
            className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
              ctaRef.visible ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight mb-5"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t.landing.ctaTitle}
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
              {t.landing.ctaSubtitle}
            </p>
            <Link
              href="/register"
              className="btn-primary py-4 px-10 text-sm inline-flex"
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
