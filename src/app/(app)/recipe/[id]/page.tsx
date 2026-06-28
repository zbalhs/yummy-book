"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ChefHat,
  Globe,
  Clock,
  Star,
  Play,
  ArrowLeft,
  Share2,
  ExternalLink,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { MealDBMeal } from "@/lib/themealdb";

interface Ingredient {
  name: string;
  measure: string;
}

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useI18n();
  const [meal, setMeal] = useState<MealDBMeal | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [relatedMeals, setRelatedMeals] = useState<{ idMeal: string; strMeal: string; strMealThumb: string }[]>([]);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    async function fetchMeal() {
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await res.json();
        const m = data.meals?.[0];
        if (m) {
          setMeal(m);
          // Extract ingredients
          const ings: Ingredient[] = [];
          for (let i = 1; i <= 20; i++) {
            const name = m[`strIngredient${i}`];
            const measure = m[`strMeasure${i}`];
            if (name && name.trim()) {
              ings.push({ name: name.trim(), measure: measure?.trim() || "" });
            }
          }
          setIngredients(ings);

          // Fetch related meals by category
          if (m.strCategory) {
            const relRes = await fetch(
              `https://www.themealdb.com/api/json/v1/1/filter.php?c=${m.strCategory}`
            );
            const relData = await relRes.json();
            setRelatedMeals(
              (relData.meals || [])
                .filter((rm: { idMeal: string }) => rm.idMeal !== id)
                .slice(0, 4)
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch meal:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMeal();
  }, [id]);

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/);
    return match?.[1];
  };

  if (loading) {
    return (
      <div className="min-h-screen page-enter">
        <div className="container-app py-8">
          <div className="skeleton h-8 w-48 mb-8" />
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="skeleton aspect-[4/3]" />
            <div className="space-y-4">
              <div className="skeleton h-10 w-3/4" />
              <div className="skeleton h-5 w-1/2" />
              <div className="skeleton h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ChefHat size={48} className="mx-auto text-[var(--color-text-muted)] mb-4" />
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Recipe not found</h2>
          <Link href="/explore" className="btn-primary mt-4 py-2.5 px-6 text-sm inline-flex">
            <span>Back to Explore</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-enter">
      {/* Back button */}
      <div className="container-app pt-6">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="container-app py-8">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left - Image & Video */}
          <div className="lg:col-span-3">
            {/* Main Image */}
            <div className="relative aspect-[4/3] overflow-hidden animate-fade-in">
              <Image
                src={meal.strMealThumb}
                alt={meal.strMeal}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setFavorited(!favorited)}
                  className="flex items-center justify-center w-11 h-11 bg-white/90 backdrop-blur-sm shadow-lg
                           hover:bg-white transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <Heart
                    size={20}
                    className={`transition-all duration-300 ${
                      favorited ? "fill-red-500 text-red-500" : "text-gray-700"
                    }`}
                  />
                </button>
                <button className="flex items-center justify-center w-11 h-11 bg-white/90 backdrop-blur-sm shadow-lg
                                 hover:bg-white transition-all duration-300 cursor-pointer">
                  <Share2 size={18} className="text-gray-700" />
                </button>
              </div>

              {/* Video play button */}
              {meal.strYoutube && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2.5
                           bg-white/90 backdrop-blur-sm shadow-lg text-sm font-medium
                           hover:bg-white transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-red-600 group-hover:scale-110 transition-transform duration-300">
                    <Play size={16} className="text-white ml-0.5" />
                  </div>
                  {t.recipe.watchVideo}
                </button>
              )}
            </div>

            {/* Video modal */}
            {showVideo && meal.strYoutube && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in p-4">
                <div className="relative w-full max-w-4xl aspect-video">
                  <button
                    onClick={() => setShowVideo(false)}
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 text-sm font-medium cursor-pointer"
                  >
                    Close ✕
                  </button>
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(meal.strYoutube)}?autoplay=1`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8">
              <h2
                className="text-2xl font-bold text-[var(--color-text-primary)] mb-5"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {t.recipe.instructions}
              </h2>
              <div className="space-y-4">
                {(meal.strInstructions || "").split(/\r?\n/).filter(Boolean).map((step, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8
                                  bg-primary-50 text-primary-700 text-sm font-bold
                                  group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                      {i + 1}
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed pt-1.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Details & Ingredients */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              {/* Title & Meta */}
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3">
                  {meal.strCategory && (
                    <span className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wider">
                      {meal.strCategory}
                    </span>
                  )}
                  {meal.strArea && (
                    <span className="px-2.5 py-1 bg-accent-50 text-accent-700 text-xs font-semibold uppercase tracking-wider">
                      {meal.strArea}
                    </span>
                  )}
                </div>

                <h1
                  className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4 leading-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {meal.strMeal}
                </h1>

                <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mb-6">
                  {meal.strArea && (
                    <span className="flex items-center gap-1.5">
                      <Globe size={14} />
                      {meal.strArea}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    ~30 min
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star size={14} className="fill-amber-500 text-amber-500" />
                    4.8
                  </span>
                </div>

                {meal.strSource && (
                  <a
                    href={meal.strSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 mb-6"
                  >
                    <ExternalLink size={12} />
                    {t.recipe.source}
                  </a>
                )}
              </div>

              {/* Ingredients */}
              <div className="card p-5 animate-fade-in-up delay-200 opacity-0">
                <h2
                  className="text-lg font-bold text-[var(--color-text-primary)] mb-4"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {t.recipe.ingredients}
                  <span className="text-sm font-normal text-[var(--color-text-muted)] ml-2">
                    ({ingredients.length} items)
                  </span>
                </h2>

                <ul className="space-y-2">
                  {ingredients.map((ing, i) => (
                    <li key={i}>
                      <button
                        onClick={() => toggleIngredient(i)}
                        className={`flex items-center gap-3 w-full text-left py-2 px-3 text-sm
                                  transition-all duration-200 cursor-pointer hover:bg-[var(--color-surface-alt)] ${
                                    checkedIngredients.has(i)
                                      ? "line-through text-[var(--color-text-muted)]"
                                      : "text-[var(--color-text-primary)]"
                                  }`}
                      >
                        <div
                          className={`flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center
                                    transition-all duration-200 ${
                                      checkedIngredients.has(i)
                                        ? "border-primary-500 bg-primary-500"
                                        : "border-[var(--color-border)]"
                                    }`}
                        >
                          {checkedIngredients.has(i) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="flex-1 font-medium">{ing.name}</span>
                        <span className="text-[var(--color-text-muted)]">{ing.measure}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              {meal.strTags && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {meal.strTags.split(",").map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] text-xs font-medium"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Recipes */}
        {relatedMeals.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[var(--color-border-subtle)]">
            <h2
              className="text-2xl font-bold text-[var(--color-text-primary)] mb-8"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t.recipe.relatedRecipes}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedMeals.map((rm, i) => (
                <Link
                  key={rm.idMeal}
                  href={`/recipe/${rm.idMeal}`}
                  className="card group overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={rm.strMealThumb}
                      alt={rm.strMeal}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2
                                 group-hover:text-primary-600 transition-colors duration-300">
                      {rm.strMeal}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
