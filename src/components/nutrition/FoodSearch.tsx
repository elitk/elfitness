"use client";
import { useState, useEffect } from "react";
import { useFoodSearch } from "@/hooks/useNutrition";
import { Search, Utensils } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { FoodItem } from "@/lib/types";

interface FoodSearchProps {
  onFoodSelect: (food: FoodItem, servings: number) => void;
  selectedMealType: string;
}

const FoodSearch = ({ onFoodSelect, selectedMealType }: FoodSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servings, setServings] = useState("1");

  const { foods, loading, error, searchFoods } = useFoodSearch();

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchFoods({ query: searchQuery, limit: 20 });
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, searchFoods]);

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
  };

  const handleAddFood = () => {
    if (selectedFood) {
      const servingCount = Math.max(0.1, parseFloat(servings) || 1);
      onFoodSelect(selectedFood, servingCount);
      setSelectedFood(null);
      setServings("1");
      setSearchQuery("");
    }
  };

  const formatNutrition = (value: number, servingSize: number) => {
    return Math.round(value * servingSize * 10) / 10;
  };

  if (selectedFood) {
    const servingCount = Math.max(0.1, parseFloat(servings) || 1);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFood(null)}
          >
            ← Back
          </Button>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Add to {selectedMealType}
          </h3>
        </div>

        {/* Selected Food Details */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
            {selectedFood.name}
          </h4>
          {selectedFood.brand && (
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {selectedFood.brand}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Per {selectedFood.servingSize} {selectedFood.servingUnit}
          </p>
        </div>

        {/* Serving Size Input */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Number of servings
          </label>
          <Input
            type="number"
            value={servings}
            onChange={setServings}
            placeholder="1"
            className="w-full"
          />
        </div>

        {/* Nutrition Preview */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h5 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
            Nutrition (for {servingCount} serving{servingCount !== 1 ? "s" : ""}
            )
          </h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Calories</p>
              <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                {Math.round(selectedFood.caloriesPerServing * servingCount)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Protein</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {formatNutrition(selectedFood.macros.protein, servingCount)}g
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Carbs</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {formatNutrition(selectedFood.macros.carbs, servingCount)}g
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Fat</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {formatNutrition(selectedFood.macros.fat, servingCount)}g
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Fiber</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {formatNutrition(selectedFood.macros.fiber, servingCount)}g
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Sugar</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {formatNutrition(selectedFood.macros.sugar, servingCount)}g
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleAddFood} className="flex-1">
            Add to {selectedMealType}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          type="text"
          placeholder="Search for foods..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="pl-10"
        />
      </div>

      {/* Search Results */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-600 dark:text-red-400">
          <p>Error searching foods: {error}</p>
        </div>
      )}

      {!loading && !error && searchQuery.length >= 2 && foods.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Utensils
            size={48}
            className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
          />
          <p>No foods found for &quot;{searchQuery}&quot;</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}

      {foods.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {foods.map((food) => (
            <FoodResultItem
              key={food.id}
              food={food}
              onSelect={() => handleFoodSelect(food)}
            />
          ))}
        </div>
      )}

      {searchQuery.length < 2 && !loading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Search
            size={48}
            className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
          />
          <p>Start typing to search for foods</p>
          <p className="text-sm">Enter at least 2 characters</p>
        </div>
      )}
    </div>
  );
};

// Food Result Item Component
const FoodResultItem = ({
  food,
  onSelect,
}: {
  food: FoodItem;
  onSelect: () => void;
}) => {
  return (
    <div
      onClick={onSelect}
      className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
    >
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">
          {food.name}
        </h4>
        {food.brand && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {food.brand}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {food.caloriesPerServing} cal per {food.servingSize}{" "}
          {food.servingUnit}
        </p>
      </div>
      <div className="text-right text-sm text-gray-600 dark:text-gray-300">
        <p>P: {food.macros.protein}g</p>
        <p>C: {food.macros.carbs}g</p>
        <p>F: {food.macros.fat}g</p>
      </div>
    </div>
  );
};

export default FoodSearch;
