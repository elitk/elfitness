'use client';
import { useState, useEffect, useCallback } from 'react';
import { nutritionAPI, foodAPI, waterAPI } from '@/lib/api/nutrition';
import { NutritionEntry, FoodItem, WaterEntry, FoodSearchQuery, Meal } from '@/lib/types';

// Hook for managing daily nutrition entry
export const useNutritionEntry = (userId: string | undefined, date: Date) => {
  const [entry, setEntry] = useState<NutritionEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntry = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const nutritionEntry = await nutritionAPI.getNutritionEntry(userId, date);
      setEntry(nutritionEntry);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch nutrition entry');
    } finally {
      setLoading(false);
    }
  }, [userId, date]);

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  const addFoodToMeal = useCallback(async (
    foodItem: FoodItem, 
    servings: number, 
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ) => {
    if (!userId) return;

    try {
      const foodEntry = {
        id: `${foodItem.id}-${Date.now()}`,
        foodId: foodItem.id,
        foodName: foodItem.name,
        servings,
        calories: foodItem.caloriesPerServing * servings,
        macros: {
          protein: foodItem.macros.protein * servings,
          carbs: foodItem.macros.carbs * servings,
          fat: foodItem.macros.fat * servings,
          fiber: foodItem.macros.fiber * servings,
          sugar: foodItem.macros.sugar * servings,
        },
        mealType,
        timestamp: new Date(),
      };

      // Update or create entry
      let updatedEntry: NutritionEntry;
      
      if (entry) {
        // Find existing meal or create new one
        let meal = entry.meals.find(m => m.type === mealType);
        if (!meal) {
          meal = {
            id: `${mealType}-${Date.now()}`,
            type: mealType,
            foods: [],
            totalCalories: 0,
            totalMacros: { protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 },
          };
          entry.meals.push(meal);
        }

        // Add food to meal
        meal.foods.push(foodEntry);
        
        // Recalculate meal totals
        meal.totalCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);
        meal.totalMacros = meal.foods.reduce((totals, food) => ({
          protein: totals.protein + food.macros.protein,
          carbs: totals.carbs + food.macros.carbs,
          fat: totals.fat + food.macros.fat,
          fiber: totals.fiber + food.macros.fiber,
          sugar: totals.sugar + food.macros.sugar,
        }), { protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 });

        // Recalculate entry totals
        updatedEntry = {
          ...entry,
          totalCalories: entry.meals.reduce((sum, meal) => sum + meal.totalCalories, 0),
          macros: entry.meals.reduce((totals, meal) => ({
            protein: totals.protein + meal.totalMacros.protein,
            carbs: totals.carbs + meal.totalMacros.carbs,
            fat: totals.fat + meal.totalMacros.fat,
            fiber: totals.fiber + meal.totalMacros.fiber,
            sugar: totals.sugar + meal.totalMacros.sugar,
          }), { protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }),
        };
      } else {
        // Create new entry
        const newMeal: Meal = {
          id: `${mealType}-${Date.now()}`,
          type: mealType,
          foods: [foodEntry],
          totalCalories: foodEntry.calories,
          totalMacros: foodEntry.macros,
        };

        updatedEntry = {
          id: '',
          userId,
          date,
          meals: [newMeal],
          totalCalories: foodEntry.calories,
          macros: foodEntry.macros,
          waterIntake: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      // Save to database
      await nutritionAPI.saveNutritionEntry(updatedEntry);
      setEntry(updatedEntry);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add food');
    }
  }, [userId, entry, date]);

  return {
    entry,
    loading,
    error,
    addFoodToMeal,
    refetch: fetchEntry,
  };
};

// Hook for food search
export const useFoodSearch = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFoods = useCallback(async (query: FoodSearchQuery) => {
    if (!query.query || query.query.length < 2) {
      setFoods([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await foodAPI.searchFoods(query);
      setFoods(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search foods');
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCustomFood = useCallback(async (userId: string, foodData: any) => {
    try {
      setLoading(true);
      setError(null);
      const foodId = await foodAPI.createCustomFood(userId, foodData);
      // Optionally refresh the search results
      return foodId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create custom food');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    foods,
    loading,
    error,
    searchFoods,
    createCustomFood,
  };
};

// Hook for water tracking
export const useWaterTracking = (userId: string | undefined, date: Date) => {
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWaterEntries = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      setWaterEntries([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const entries = await waterAPI.getWaterEntries(userId, date);
      setWaterEntries(entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch water entries');
    } finally {
      setLoading(false);
    }
  }, [userId, date]);

  useEffect(() => {
    fetchWaterEntries();
  }, [fetchWaterEntries]);

  const addWaterEntry = useCallback(async (amount: number) => {
    if (!userId) return;

    try {
      await waterAPI.addWaterEntry(userId, amount);
      await fetchWaterEntries(); // Refetch to update the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add water entry');
    }
  }, [userId, fetchWaterEntries]);

  const totalWater = waterEntries.reduce((sum, entry) => sum + entry.amount, 0);

  return {
    waterEntries,
    totalWater,
    loading,
    error,
    addWaterEntry,
    refetch: fetchWaterEntries,
  };
}; 