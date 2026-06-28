"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChefHat,
  Plus,
  Minus,
  Upload,
  Eye,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface IngredientField {
  name: string;
  measure: string;
}

export default function RecipeSubmitPage() {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [ingredients, setIngredients] = useState<IngredientField[]>([
    { name: "", measure: "" },
    { name: "", measure: "" },
    { name: "", measure: "" },
  ]);
  const [showPreview, setShowPreview] = useState(false);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", measure: "" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: "name" | "measure", value: string) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const totalSteps = 3;

  const canProceed = () => {
    if (step === 1) return title.trim() && category.trim();
    if (step === 2) return ingredients.some((i) => i.name.trim());
    if (step === 3) return instructions.trim();
    return false;
  };

  const handleSubmit = () => {
    // For now, just show preview
    setShowPreview(true);
  };

  const categories = [
    "Beef", "Chicken", "Dessert", "Lamb", "Miscellaneous",
    "Pasta", "Pork", "Seafood", "Side", "Starter", "Vegan", "Vegetarian",
  ];

  const areas = [
    "American", "British", "Canadian", "Chinese", "Dutch", "Egyptian",
    "French", "Greek", "Indian", "Irish", "Italian", "Japanese",
    "Malaysian", "Mexican", "Moroccan", "Russian", "Spanish", "Thai", "Vietnamese",
  ];

  return (
    <div className="min-h-screen page-enter">
      {/* Header */}
      <div className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border-subtle)]">
        <div className="container-app py-8 md:py-12">
          <div className="flex items-center gap-3 mb-2 animate-fade-in-up">
            <ChefHat size={24} className="text-primary-600" />
            <h1
              className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {t.submit.title}
            </h1>
          </div>
          <p className="text-[var(--color-text-secondary)] text-sm animate-fade-in-up delay-100 opacity-0">
            {t.submit.subtitle}
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-6 animate-fade-in-up delay-200 opacity-0">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex-1 relative">
                <div className={`h-1.5 transition-all duration-500 ${
                  i + 1 <= step ? "bg-primary-600" : "bg-[var(--color-border)]"
                }`} />
              </div>
            ))}
            <span className="text-xs text-[var(--color-text-muted)] ml-2">
              {step}/{totalSteps}
            </span>
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                  {t.submit.recipeName} *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input py-3"
                  placeholder="e.g., Spicy Thai Basil Chicken"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                    {t.submit.recipeCategory} *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input py-3 cursor-pointer"
                  >
                    <option value="">Select...</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                    {t.submit.recipeCuisine}
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="input py-3 cursor-pointer"
                  >
                    <option value="">Select...</option>
                    {areas.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                  {t.submit.recipeImage}
                </label>
                <div className="card border-dashed border-2 p-8 text-center">
                  {imageUrl ? (
                    <div className="relative aspect-video max-w-sm mx-auto overflow-hidden">
                      <Image src={imageUrl} alt="Preview" fill className="object-cover" sizes="400px" />
                      <button
                        onClick={() => setImageUrl("")}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white flex items-center justify-center cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={28} className="mx-auto text-[var(--color-text-muted)] mb-2" />
                      <p className="text-sm text-[var(--color-text-muted)] mb-3">
                        Paste an image URL below
                      </p>
                      <input
                        type="url"
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="input py-2 text-sm max-w-sm mx-auto"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                  {t.submit.recipeVideo}
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="input py-3"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Ingredients */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in-up">
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                Add all the ingredients needed for your recipe.
              </p>

              {ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <span className="text-xs font-bold text-[var(--color-text-muted)] w-6 text-right">{i + 1}.</span>
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => updateIngredient(i, "name", e.target.value)}
                    className="input py-2.5 flex-1"
                    placeholder={t.submit.ingredientName}
                  />
                  <input
                    type="text"
                    value={ing.measure}
                    onChange={(e) => updateIngredient(i, "measure", e.target.value)}
                    className="input py-2.5 w-32"
                    placeholder={t.submit.ingredientMeasure}
                  />
                  <button
                    onClick={() => removeIngredient(i)}
                    className="flex-shrink-0 p-2 text-[var(--color-text-muted)] hover:text-danger-500
                             hover:bg-red-50 transition-all duration-200 cursor-pointer"
                    disabled={ingredients.length <= 1}
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}

              <button
                onClick={addIngredient}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                         text-primary-600 hover:bg-primary-50 transition-colors duration-200 cursor-pointer w-full justify-center
                         border border-dashed border-primary-300"
              >
                <Plus size={16} />
                {t.submit.addIngredient}
              </button>
            </div>
          )}

          {/* Step 3: Instructions */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
                  {t.submit.recipeInstructions} *
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="input py-3 min-h-[300px] resize-y"
                  placeholder="Write each step on a new line...&#10;&#10;1. Prepare the ingredients...&#10;2. Heat the pan...&#10;3. Cook the..."
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--color-border-subtle)]">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary py-2.5 px-6 text-sm flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="btn-primary py-2.5 px-8 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  Next
                  <ArrowRight size={16} />
                </span>
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(true)}
                  className="btn-secondary py-2.5 px-6 text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Eye size={16} />
                  {t.submit.preview}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="btn-primary py-2.5 px-8 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>{t.submit.submitBtn}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in p-4 overflow-y-auto">
          <div className="card w-full max-w-lg p-6 shadow-2xl animate-scale-in my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)]"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                {t.submit.preview}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-[var(--color-surface-alt)] transition-colors duration-200 cursor-pointer"
              >
                <Minus size={18} />
              </button>
            </div>

            {imageUrl && (
              <div className="relative aspect-video overflow-hidden mb-4">
                <Image src={imageUrl} alt={title} fill className="object-cover" sizes="500px" />
              </div>
            )}

            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">{title || "Untitled Recipe"}</h2>
            <div className="flex gap-2 mb-4">
              {category && <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold">{category}</span>}
              {area && <span className="px-2 py-0.5 bg-accent-50 text-accent-700 text-xs font-semibold">{area}</span>}
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">{t.recipe.ingredients}</h4>
              <ul className="space-y-1">
                {ingredients.filter((i) => i.name.trim()).map((ing, i) => (
                  <li key={i} className="text-sm text-[var(--color-text-secondary)]">
                    • {ing.measure} {ing.name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">{t.recipe.instructions}</h4>
              <p className="text-sm text-[var(--color-text-secondary)] whitespace-pre-line">{instructions}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
