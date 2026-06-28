"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Search,
  Trash2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface PlannedMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

type MealType = "breakfast" | "lunch" | "dinner";
type PlannerData = Record<string, Record<MealType, PlannedMeal | null>>;

export default function PlannerPage() {
  const { t } = useI18n();
  const [currentWeek, setCurrentWeek] = useState(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  const [plannerData, setPlannerData] = useState<PlannerData>({});
  const [showSearch, setShowSearch] = useState<{ day: string; type: MealType } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlannedMeal[]>([]);
  const [searching, setSearching] = useState(false);

  const days = [
    t.planner.monday,
    t.planner.tuesday,
    t.planner.wednesday,
    t.planner.thursday,
    t.planner.friday,
    t.planner.saturday,
    t.planner.sunday,
  ];

  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

  const mealLabels: Record<MealType, string> = {
    breakfast: t.planner.breakfast,
    lunch: t.planner.lunch,
    dinner: t.planner.dinner,
  };

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeek);
    d.setDate(currentWeek.getDate() + i);
    return d;
  });

  const getDateKey = (date: Date) => date.toISOString().split("T")[0];

  useEffect(() => {
    const saved = localStorage.getItem("yummybook-planner");
    if (saved) {
      try {
        setPlannerData(JSON.parse(saved));
      } catch {
        setPlannerData({});
      }
    }
  }, []);

  const savePlanner = (data: PlannerData) => {
    setPlannerData(data);
    localStorage.setItem("yummybook-planner", JSON.stringify(data));
  };

  const navigateWeek = (direction: number) => {
    const next = new Date(currentWeek);
    next.setDate(next.getDate() + direction * 7);
    setCurrentWeek(next);
  };

  const searchMeals = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();
      setSearchResults(data.meals || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const addMealToPlan = (meal: PlannedMeal) => {
    if (!showSearch) return;
    const { day, type } = showSearch;
    const newData = { ...plannerData };
    if (!newData[day]) newData[day] = { breakfast: null, lunch: null, dinner: null };
    newData[day][type] = meal;
    savePlanner(newData);
    setShowSearch(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeMealFromPlan = (day: string, type: MealType) => {
    const newData = { ...plannerData };
    if (newData[day]) {
      newData[day][type] = null;
      savePlanner(newData);
    }
  };

  const clearWeek = () => {
    const newData = { ...plannerData };
    weekDates.forEach((d) => {
      const key = getDateKey(d);
      delete newData[key];
    });
    savePlanner(newData);
  };

  const formatWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${start.toLocaleDateString("en", { month: "short", day: "numeric" })} — ${end.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  return (
    <div className="min-h-screen page-enter">
      {/* Header */}
      <div className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border-subtle)]">
        <div className="container-app py-8 md:py-12">
          <div className="flex items-center gap-3 mb-2 animate-fade-in-up">
            <CalendarDays size={24} className="text-primary-600" />
            <h1
              className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t.planner.title}
            </h1>
          </div>
          <p className="text-[var(--color-text-secondary)] text-sm animate-fade-in-up delay-100 opacity-0">
            {t.planner.subtitle}
          </p>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Week navigation */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up delay-200 opacity-0">
          <button
            onClick={() => navigateWeek(-1)}
            className="flex items-center justify-center w-10 h-10 hover:bg-[var(--color-surface-alt)]
                     text-[var(--color-text-secondary)] transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {formatWeekRange()}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={clearWeek}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium
                       text-danger-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
            >
              <Trash2 size={14} />
              {t.planner.clearWeek}
            </button>
            <button
              onClick={() => navigateWeek(1)}
              className="flex items-center justify-center w-10 h-10 hover:bg-[var(--color-surface-alt)]
                       text-[var(--color-text-secondary)] transition-all duration-200 cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto -mx-5 px-5 pb-4">
          <div className="grid grid-cols-7 gap-3 min-w-[900px]">
            {/* Day headers */}
            {weekDates.map((date, i) => {
              const isToday = getDateKey(date) === getDateKey(new Date());
              return (
                <div
                  key={i}
                  className={`text-center py-3 mb-2 animate-fade-in-down ${
                    isToday
                      ? "bg-primary-600 text-white"
                      : "bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]"
                  }`}
                  style={{ animationDelay: `${i * 50 + 300}ms`, opacity: 0 }}
                >
                  <div className="text-xs font-semibold uppercase tracking-wider">{days[i]}</div>
                  <div className="text-lg font-bold">{date.getDate()}</div>
                </div>
              );
            })}

            {/* Meal slots */}
            {mealTypes.map((type) =>
              weekDates.map((date, dayIdx) => {
                const key = getDateKey(date);
                const meal = plannerData[key]?.[type] || null;

                return (
                  <div
                    key={`${key}-${type}`}
                    className="card p-2 min-h-[100px] flex flex-col animate-fade-in-up"
                    style={{ animationDelay: `${(dayIdx + mealTypes.indexOf(type) * 7) * 30 + 400}ms`, opacity: 0 }}
                  >
                    <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">
                      {mealLabels[type]}
                    </span>

                    {meal ? (
                      <div className="flex-1 group relative">
                        <div className="relative aspect-video overflow-hidden mb-1.5">
                          <Image
                            src={meal.strMealThumb}
                            alt={meal.strMeal}
                            fill
                            sizes="150px"
                            className="object-cover"
                          />
                          <button
                            onClick={() => removeMealFromPlan(key, type)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white
                                     flex items-center justify-center opacity-0 group-hover:opacity-100
                                     transition-opacity duration-200 cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        <p className="text-xs font-medium text-[var(--color-text-primary)] line-clamp-2">
                          {meal.strMeal}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowSearch({ day: key, type })}
                        className="flex-1 flex flex-col items-center justify-center gap-1
                                 border border-dashed border-[var(--color-border)]
                                 text-[var(--color-text-muted)] hover:text-primary-600 hover:border-primary-300
                                 transition-all duration-200 cursor-pointer p-2"
                      >
                        <Plus size={16} />
                        <span className="text-[10px]">{t.planner.addMeal}</span>
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-4">
          <div className="card w-full max-w-md p-6 shadow-2xl max-h-[80vh] flex flex-col animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                {t.planner.addMeal}
              </h3>
              <button
                onClick={() => { setShowSearch(null); setSearchResults([]); setSearchQuery(""); }}
                className="p-2 hover:bg-[var(--color-surface-alt)] transition-colors duration-200 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); searchMeals(); }}
              className="relative mb-4"
            >
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.search}
                className="input !pl-10 !py-2.5 text-sm"
                autoFocus
              />
            </form>

            <div className="flex-1 overflow-y-auto space-y-2">
              {searching ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <div className="skeleton w-14 h-14 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="skeleton h-4 w-3/4" />
                        <div className="skeleton h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((meal) => (
                  <button
                    key={meal.idMeal}
                    onClick={() => addMealToPlan(meal)}
                    className="flex items-center gap-3 w-full p-2 hover:bg-[var(--color-surface-alt)]
                             transition-colors duration-200 text-left cursor-pointer"
                  >
                    <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden">
                      <Image
                        src={meal.strMealThumb}
                        alt={meal.strMeal}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] line-clamp-1">
                        {meal.strMeal}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Click to add
                      </p>
                    </div>
                    <Plus size={16} className="text-primary-600" />
                  </button>
                ))
              ) : searchQuery ? (
                <p className="text-center py-8 text-sm text-[var(--color-text-muted)]">
                  No results. Try another search term.
                </p>
              ) : (
                <p className="text-center py-8 text-sm text-[var(--color-text-muted)]">
                  Search for a recipe to add to your plan.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
