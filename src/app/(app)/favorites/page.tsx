"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ChefHat, Clock, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface FavoriteMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function FavoritesPage() {
  const { t } = useI18n();
  const [favorites, setFavorites] = useState<FavoriteMeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load favorites from localStorage for now
    const saved = localStorage.getItem("yummybook-favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch {
        setFavorites([]);
      }
    }
    setLoading(false);
  }, []);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter((f) => f.idMeal !== id);
    setFavorites(updated);
    localStorage.setItem("yummybook-favorites", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen page-enter">
      <div className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border-subtle)]">
        <div className="container-app py-8 md:py-12">
          <div className="flex items-center gap-3 mb-2 animate-fade-in-up">
            <Heart size={24} className="text-red-500" />
            <h1
              className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t.profile.myFavorites}
            </h1>
          </div>
          <p className="text-[var(--color-text-secondary)] text-sm animate-fade-in-up delay-100 opacity-0">
            {favorites.length} {t.profile.favoritesCount.toLowerCase()} saved
          </p>
        </div>
      </div>

      <div className="container-app py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton aspect-[4/3]" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favorites.map((meal, i) => (
              <div
                key={meal.idMeal}
                className="card group overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}
              >
                <Link href={`/recipe/${meal.idMeal}`}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </Link>
                <div className="p-4 flex items-start justify-between gap-2">
                  <Link href={`/recipe/${meal.idMeal}`} className="flex-1">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2
                                 group-hover:text-primary-600 transition-colors duration-300">
                      {meal.strMeal}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mt-1">
                      <Clock size={12} /> ~30 min
                    </div>
                  </Link>
                  <button
                    onClick={() => removeFavorite(meal.idMeal)}
                    className="flex-shrink-0 p-2 text-[var(--color-text-muted)] hover:text-red-500
                             hover:bg-red-50 transition-all duration-200 cursor-pointer"
                    aria-label="Remove from favorites"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-red-50 text-red-300 mb-4">
              <Heart size={28} />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
              No favorites yet
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-sm">
              Start exploring recipes and save your favorites here for quick access.
            </p>
            <Link href="/explore" className="btn-primary py-2.5 px-6 text-sm">
              <span className="flex items-center gap-2">
                <ChefHat size={16} />
                {t.nav.explore}
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
