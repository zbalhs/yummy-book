"use client";

import { useState } from "react";
import { User, ChefHat, Heart, Star, Edit3, Camera } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function ProfilePage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"recipes" | "favorites" | "reviews">("recipes");

  const tabs = [
    { key: "recipes" as const, label: t.profile.myRecipes, icon: ChefHat, count: 0 },
    { key: "favorites" as const, label: t.profile.myFavorites, icon: Heart, count: 0 },
    { key: "reviews" as const, label: t.profile.myReviews, icon: Star, count: 0 },
  ];

  return (
    <div className="min-h-screen page-enter">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary-50 via-cream-50 to-sage-50 border-b border-[var(--color-border-subtle)]">
        <div className="container-app py-10 md:py-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 animate-fade-in-up">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-primary-400 to-primary-600
                            flex items-center justify-center overflow-hidden">
                <User size={40} className="text-white" />
              </div>
              <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100
                               transition-opacity duration-300 cursor-pointer">
                <Camera size={20} className="text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-1"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                YummyBook User
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Food enthusiast & home cook 🍳
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-6">
                {[
                  { label: t.profile.recipesCount, value: 0 },
                  { label: t.profile.favoritesCount, value: 0 },
                  { label: t.profile.reviewsCount, value: 0 },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl font-bold text-[var(--color-text-primary)]">{stat.value}</div>
                    <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit button */}
            <button className="btn-secondary py-2 px-4 text-xs flex items-center gap-2 cursor-pointer">
              <Edit3 size={14} />
              {t.profile.editProfile}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <div className="container-app">
          <div className="flex gap-0 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all duration-300 cursor-pointer ${
                    activeTab === tab.key
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  <span className="ml-1 text-xs text-[var(--color-text-muted)]">({tab.count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container-app py-10">
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <div className="flex items-center justify-center w-16 h-16 bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] mb-4">
            {activeTab === "recipes" && <ChefHat size={28} />}
            {activeTab === "favorites" && <Heart size={28} />}
            {activeTab === "reviews" && <Star size={28} />}
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
            {activeTab === "recipes" && "No recipes yet"}
            {activeTab === "favorites" && "No favorites yet"}
            {activeTab === "reviews" && "No reviews yet"}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">
            {activeTab === "recipes" && "Start sharing your recipes with the community!"}
            {activeTab === "favorites" && "Browse recipes and save your favorites."}
            {activeTab === "reviews" && "Try some recipes and leave your reviews."}
          </p>
        </div>
      </div>
    </div>
  );
}
