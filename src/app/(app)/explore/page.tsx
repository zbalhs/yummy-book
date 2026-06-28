"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChefHat } from "lucide-react";
import RecipeCard from "@/components/recipe/RecipeCard";
import { useI18n } from "@/lib/i18n/context";

interface MealPreview {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

const BASE = "https://www.themealdb.com/api/json/v1/1";

function ExploreContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const [query, setQuery] = useState(initialQuery);
  const [meals, setMeals] = useState<MealPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedArea, setSelectedArea] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch filter options
  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/list.php?c=list`).then((r) => r.json()),
      fetch(`${BASE}/list.php?a=list`).then((r) => r.json()),
    ]).then(([catData, areaData]) => {
      setCategories((catData.meals || []).map((m: { strCategory: string }) => m.strCategory));
      setAreas((areaData.meals || []).map((m: { strArea: string }) => m.strArea));
    });
  }, []);

  // Fetch meals
  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (query.trim()) {
        const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
        data = await res.json();
        setMeals(data.meals || []);
      } else if (selectedCategory) {
        const res = await fetch(`${BASE}/filter.php?c=${encodeURIComponent(selectedCategory)}`);
        data = await res.json();
        setMeals(data.meals || []);
      } else if (selectedArea) {
        const res = await fetch(`${BASE}/filter.php?a=${encodeURIComponent(selectedArea)}`);
        data = await res.json();
        setMeals(data.meals || []);
      } else {
        // Default: load multiple letters for a fuller grid
        const letters = ["a", "b", "c", "d", "e", "f"];
        const results = await Promise.all(
          letters.map((l) => fetch(`${BASE}/search.php?f=${l}`).then((r) => r.json()))
        );
        const allMeals = results.flatMap((r) => r.meals || []);
        setMeals(allMeals.slice(0, 40));
      }
    } catch (err) {
      console.error("Failed to fetch meals:", err);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }, [query, selectedCategory, selectedArea]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory("");
    setSelectedArea("");
    fetchMeals();
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory("");
    setSelectedArea("");
  };

  const hasActiveFilter = query || selectedCategory || selectedArea;

  return (
    <div className="page-enter min-h-screen">
      {/* Header */}
      <div className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border-subtle)]">
        <div className="container-app py-8 md:py-12">
          <h1
            className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2 animate-fade-in-up"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {t.explore.title}
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm animate-fade-in-up delay-100 opacity-0">
            {t.explore.subtitle}
          </p>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-3 mt-6 animate-fade-in-up delay-200 opacity-0">
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              />
              <input
                id="explore-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.nav.search}
                className="input !pl-11 !py-3 text-sm"
              />
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border transition-all duration-300 cursor-pointer ${
                showFilters || hasActiveFilter
                  ? "bg-primary-50 border-primary-300 text-primary-700"
                  : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]"
              }`}
              id="explore-filter-toggle"
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilter && (
                <span className="w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Filter Panel */}
          <div
            className={`overflow-hidden transition-all duration-400 ${
              showFilters ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border-subtle)]">
              {/* Category filters */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                  {t.explore.filterCategory}
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSelectedCategory(""); setSelectedArea(""); }}
                    className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                      !selectedCategory
                        ? "bg-primary-600 text-white"
                        : "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)]"
                    }`}
                  >
                    {t.explore.filterAll}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setSelectedArea(""); setQuery(""); }}
                      className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-primary-600 text-white"
                          : "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area filters */}
              <div>
                <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                  {t.explore.filterArea}
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSelectedArea(""); setSelectedCategory(""); }}
                    className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                      !selectedArea
                        ? "bg-accent-600 text-white"
                        : "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)]"
                    }`}
                  >
                    {t.explore.filterAll}
                  </button>
                  {areas.map((area) => (
                    <button
                      key={area}
                      onClick={() => { setSelectedArea(area); setSelectedCategory(""); setQuery(""); }}
                      className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                        selectedArea === area
                          ? "bg-accent-600 text-white"
                          : "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)]"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilter && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 mt-3 text-xs text-danger-500 hover:text-danger-600 font-medium cursor-pointer"
                >
                  <X size={14} />
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-app py-8">
        {/* Active filter badge */}
        {hasActiveFilter && (
          <div className="flex items-center gap-2 mb-6 text-sm">
            <span className="text-[var(--color-text-muted)]">Showing results for:</span>
            {query && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium">
                &ldquo;{query}&rdquo;
                <button onClick={() => setQuery("")} className="hover:text-primary-900 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium">
                {selectedCategory}
                <button onClick={() => setSelectedCategory("")} className="hover:text-primary-900 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedArea && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-50 text-accent-700 text-xs font-medium">
                {selectedArea}
                <button onClick={() => setSelectedArea("")} className="hover:text-accent-900 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="masonry-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="masonry-item">
                <div className="card overflow-hidden">
                  <div className={`skeleton ${["h-48", "h-60", "h-72", "h-60"][i % 4]}`} />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : meals.length > 0 ? (
          <div className="masonry-grid">
            {meals.map((meal, i) => (
              <RecipeCard
                key={meal.idMeal}
                id={meal.idMeal}
                title={meal.strMeal}
                imageUrl={meal.strMealThumb}
                category={meal.strCategory}
                area={meal.strArea}
                index={i}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] mb-4">
              <ChefHat size={28} />
            </div>
            <p className="text-[var(--color-text-secondary)] mb-1 font-medium">
              {t.explore.noResults}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
