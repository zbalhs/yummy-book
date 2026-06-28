const BASE_URL = process.env.NEXT_PUBLIC_MEALDB_BASE_URL || "https://www.themealdb.com/api/json/v1/1";

export interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  [key: string]: string | null;
}

export interface MealDBCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface MealDBFilterResult {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

// Search meal by name
export async function searchMealByName(name: string): Promise<MealDBMeal[]> {
  const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(name)}`);
  const data = await res.json();
  return data.meals || [];
}

// Search meals by first letter
export async function searchMealByLetter(letter: string): Promise<MealDBMeal[]> {
  const res = await fetch(`${BASE_URL}/search.php?f=${letter}`);
  const data = await res.json();
  return data.meals || [];
}

// Lookup meal by id
export async function lookupMealById(id: string): Promise<MealDBMeal | null> {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await res.json();
  return data.meals?.[0] || null;
}

// Get random meal
export async function getRandomMeal(): Promise<MealDBMeal | null> {
  const res = await fetch(`${BASE_URL}/random.php`);
  const data = await res.json();
  return data.meals?.[0] || null;
}

// Get multiple random meals (making multiple calls)
export async function getRandomMeals(count: number): Promise<MealDBMeal[]> {
  const promises = Array.from({ length: count }, () => getRandomMeal());
  const results = await Promise.all(promises);
  // Deduplicate by id
  const seen = new Set<string>();
  return results.filter((meal): meal is MealDBMeal => {
    if (!meal || seen.has(meal.idMeal)) return false;
    seen.add(meal.idMeal);
    return true;
  });
}

// Get all categories with descriptions
export async function getCategories(): Promise<MealDBCategory[]> {
  const res = await fetch(`${BASE_URL}/categories.php`);
  const data = await res.json();
  return data.categories || [];
}

// List all category names
export async function listCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/list.php?c=list`);
  const data = await res.json();
  return (data.meals || []).map((m: { strCategory: string }) => m.strCategory);
}

// List all area names
export async function listAreas(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/list.php?a=list`);
  const data = await res.json();
  return (data.meals || []).map((m: { strArea: string }) => m.strArea);
}

// Filter by category
export async function filterByCategory(category: string): Promise<MealDBFilterResult[]> {
  const res = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  const data = await res.json();
  return data.meals || [];
}

// Filter by area
export async function filterByArea(area: string): Promise<MealDBFilterResult[]> {
  const res = await fetch(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
  const data = await res.json();
  return data.meals || [];
}

// Filter by ingredient
export async function filterByIngredient(ingredient: string): Promise<MealDBFilterResult[]> {
  const res = await fetch(`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
  const data = await res.json();
  return data.meals || [];
}

// Extract ingredients from a meal object
export function extractIngredients(meal: MealDBMeal): { name: string; measure: string }[] {
  const ingredients: { name: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      ingredients.push({
        name: name.trim(),
        measure: measure?.trim() || "",
      });
    }
  }
  return ingredients;
}
