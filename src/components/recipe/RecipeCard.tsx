"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Clock, ChefHat, Star } from "lucide-react";
import { useState } from "react";

interface RecipeCardProps {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
  area?: string;
  rating?: number;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  index?: number;
  heightVariant?: "short" | "medium" | "tall";
}

export default function RecipeCard({
  id,
  title,
  imageUrl,
  category,
  area,
  rating,
  isFavorited = false,
  onToggleFavorite,
  index = 0,
  heightVariant,
}: RecipeCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [imgLoaded, setImgLoaded] = useState(false);

  const heights = {
    short: "h-48",
    medium: "h-60",
    tall: "h-72",
  };

  const height =
    heightVariant ||
    (["short", "medium", "tall", "medium"] as const)[index % 4];

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(!favorited);
    onToggleFavorite?.(id);
  };

  return (
    <Link
      href={`/recipe/${id}`}
      className="masonry-item block card group animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
      id={`recipe-card-${id}`}
    >
      {/* Image */}
      <div className={`relative ${heights[height]} overflow-hidden bg-[var(--color-surface-alt)]`}>
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 flex items-center justify-center w-9 h-9
                   bg-white/90 backdrop-blur-sm shadow-lg
                   hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95 z-10 cursor-pointer"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={16}
            className={`transition-all duration-300 ${
              favorited
                ? "fill-red-500 text-red-500 scale-110"
                : "text-gray-600"
            }`}
          />
        </button>

        {/* Category badge */}
        {category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider
                         bg-primary-600 text-white">
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] leading-snug line-clamp-2 mb-2
                     group-hover:text-primary-600 transition-colors duration-300">
          {title}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {area && (
              <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                <ChefHat size={12} />
                {area}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              <Clock size={12} />
              30m
            </span>
          </div>

          {rating !== undefined && rating > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
              <Star size={12} className="fill-amber-500 text-amber-500" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
