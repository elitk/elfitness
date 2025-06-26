'use client';
import { useState } from 'react';
import { useNutritionEntry } from '@/hooks/useNutrition';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FoodSearch from '@/components/nutrition/FoodSearch';
import MacroTracker from '@/components/nutrition/MacroTracker';
import { FoodEntry } from '@/lib/types';

interface FoodDiaryProps {
  selectedDate?: Date;
}

const FoodDiary = ({ selectedDate = new Date() }: FoodDiaryProps) => {
  const { user } = useAuth();
  const { entry, loading, error, addFoodToMeal } = useNutritionEntry(user?.uid, selectedDate);
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  const mealTypes = [
    { type: 'breakfast' as const, label: 'Breakfast', icon: '🌅' },
    { type: 'lunch' as const, label: 'Lunch', icon: '☀️' },
    { type: 'dinner' as const, label: 'Dinner', icon: '🌙' },
    { type: 'snack' as const, label: 'Snacks', icon: '🍎' },
  ];

  const getMealData = (mealType: string) => {
    return entry?.meals.find(meal => meal.type === mealType) || {
      id: '',
      type: mealType as any,
      foods: [],
      totalCalories: 0,
      totalMacros: { protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 },
    };
  };

  const handleAddFood = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedMealType(mealType);
    setShowAddFood(true);
  };

  const formatMacro = (value: number) => Math.round(value * 10) / 10;

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>Error loading food diary: {error}</p>
          <Button variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Daily Summary - {selectedDate.toLocaleDateString()}
          </h2>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {entry?.totalCalories || 0} cal
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Calories</p>
          </div>
        </div>
        
        {entry && (
          <MacroTracker 
            current={entry.macros}
            goals={{ protein: 150, carbs: 250, fat: 80, fiber: 25, sugar: 50 }}
          />
        )}
      </Card>

      {/* Meals */}
      <div className="space-y-4">
        {mealTypes.map(({ type, label, icon }) => {
          const meal = getMealData(type);
          
          return (
            <Card key={type} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{label}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {meal.totalCalories} calories • 
                      P: {formatMacro(meal.totalMacros.protein)}g • 
                      C: {formatMacro(meal.totalMacros.carbs)}g • 
                      F: {formatMacro(meal.totalMacros.fat)}g
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddFood(type)}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Food
                </Button>
              </div>

              {/* Food Items */}
              {meal.foods.length > 0 ? (
                <div className="space-y-2">
                  {meal.foods.map((food, index) => (
                    <FoodItem key={`${food.id}-${index}`} food={food} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>No foods added yet</p>
                  <p className="text-sm">Tap &quot;Add Food&quot; to get started</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Food Search Modal */}
      {showAddFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Add Food to {mealTypes.find(m => m.type === selectedMealType)?.label}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddFood(false)}
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto">
              <FoodSearch
                onFoodSelect={(food, servings) => {
                  addFoodToMeal(food, servings, selectedMealType);
                  setShowAddFood(false);
                }}
                selectedMealType={selectedMealType}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Individual Food Item Component
const FoodItem = ({ food }: { food: FoodEntry }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-gray-100">{food.foodName}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {food.servings} serving(s) • {food.calories} cal
        </p>
        <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>P: {Math.round(food.macros.protein * 10) / 10}g</span>
          <span>C: {Math.round(food.macros.carbs * 10) / 10}g</span>
          <span>F: {Math.round(food.macros.fat * 10) / 10}g</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">
          <Edit2 size={14} />
        </Button>
        <Button variant="ghost" size="sm">
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
};

export default FoodDiary; 