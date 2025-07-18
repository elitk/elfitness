import { FoodItem } from '@/lib/types';

export const sampleFoods: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Chicken Breast',
    brand: 'Generic',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 165,
    macros: {
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
    },
    category: 'Meat & Seafood',
    isCustom: false,
  },
  {
    name: 'Brown Rice',
    brand: 'Generic',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 111,
    macros: {
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4,
    },
    category: 'Grains',
    isCustom: false,
  },
  {
    name: 'Broccoli',
    brand: 'Generic',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 34,
    macros: {
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.5,
    },
    category: 'Vegetables',
    isCustom: false,
  },
  {
    name: 'Salmon Fillet',
    brand: 'Generic',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 208,
    macros: {
      protein: 25.4,
      carbs: 0,
      fat: 12.4,
      fiber: 0,
      sugar: 0,
    },
    category: 'Meat & Seafood',
    isCustom: false,
  },
  {
    name: 'Greek Yogurt',
    brand: 'Fage',
    servingSize: 170,
    servingUnit: 'g',
    caloriesPerServing: 100,
    macros: {
      protein: 18,
      carbs: 6,
      fat: 0,
      fiber: 0,
      sugar: 6,
    },
    category: 'Dairy',
    isCustom: false,
  },
  {
    name: 'Banana',
    brand: 'Generic',
    servingSize: 1,
    servingUnit: 'medium',
    caloriesPerServing: 105,
    macros: {
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14.4,
    },
    category: 'Fruits',
    isCustom: false,
  },
  {
    name: 'Almonds',
    brand: 'Generic',
    servingSize: 28,
    servingUnit: 'g',
    caloriesPerServing: 164,
    macros: {
      protein: 6,
      carbs: 6,
      fat: 14,
      fiber: 3.5,
      sugar: 1.2,
    },
    category: 'Nuts & Seeds',
    isCustom: false,
  },
  {
    name: 'Oatmeal',
    brand: 'Quaker',
    servingSize: 40,
    servingUnit: 'g',
    caloriesPerServing: 150,
    macros: {
      protein: 5,
      carbs: 27,
      fat: 3,
      fiber: 4,
      sugar: 1,
    },
    category: 'Grains',
    isCustom: false,
  },
  {
    name: 'Avocado',
    brand: 'Generic',
    servingSize: 100,
    servingUnit: 'g',
    caloriesPerServing: 160,
    macros: {
      protein: 2,
      carbs: 9,
      fat: 15,
      fiber: 7,
      sugar: 0.7,
    },
    category: 'Fruits',
    isCustom: false,
  },
  {
    name: 'Whole Wheat Bread',
    brand: 'Generic',
    servingSize: 1,
    servingUnit: 'slice',
    caloriesPerServing: 81,
    macros: {
      protein: 3.6,
      carbs: 13.8,
      fat: 1.1,
      fiber: 1.9,
      sugar: 1.4,
    },
    category: 'Grains',
    isCustom: false,
  },
]; 