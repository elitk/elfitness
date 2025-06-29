// User related types
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date;
  updatedAt: Date;
  height?: number;
  weight?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
}

export interface UserSettings {
  uid: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    workoutReminders: boolean;
    nutritionReminders: boolean;
  };
  units: 'metric' | 'imperial';
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    workoutSharing: boolean;
    progressSharing: boolean;
  };
}

// Authentication types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

// UI Component types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

// Loading and Error types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
}

export interface DashboardStats {
  totalWorkouts: number;
  weeklyCalories: number;
  currentStreak: number;
  monthlyProgress: number;
}

/**
 * Represents a workout session with exercises and metadata.
 */
export interface Workout {
  id: string;
  userId: string;
  name: string;
  date: string;
  duration: number; // in minutes
  exercises: Exercise[];
  calories: number;
  notes?: string;
}

/**
 * Represents a single exercise within a workout.
 */
export interface Exercise {
  name: string;
  category: string;
  sets: number;
  reps: number;
  weight?: number; // in kg or lbs
  duration?: number; // in seconds
  restTime?: number; // in seconds
}

// Nutrition tracking types
export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface Micronutrients {
  sodium?: number;
  potassium?: number;
  calcium?: number;
  iron?: number;
  vitaminC?: number;
  vitaminD?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  servingSize: number;
  servingUnit: string;
  caloriesPerServing: number;
  macros: MacroNutrients;
  micros?: Micronutrients;
  category: string;
  isCustom: boolean;
  userId?: string; // For custom foods
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  foodName: string;
  servings: number;
  calories: number;
  macros: MacroNutrients;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: Date;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodEntry[];
  totalCalories: number;
  totalMacros: MacroNutrients;
}

export interface NutritionEntry {
  id: string;
  userId: string;
  date: Date;
  meals: Meal[];
  totalCalories: number;
  macros: MacroNutrients;
  waterIntake: number; // in ml
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionGoals {
  id: string;
  userId: string;
  dailyCalories: number;
  macroTargets: MacroNutrients;
  waterIntake: number; // in ml
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  meals: {
    [key: string]: { // date string
      breakfast: string[]; // food IDs
      lunch: string[];
      dinner: string[];
      snacks: string[];
    };
  };
  totalCalories: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaterEntry {
  id: string;
  userId: string;
  amount: number; // in ml
  timestamp: Date;
}

export interface NutritionStats {
  avgDailyCalories: number;
  avgDailyProtein: number;
  avgDailyCarbs: number;
  avgDailyFat: number;
  avgWaterIntake: number;
  calorieGoalProgress: number; // percentage
  macroGoalProgress: {
    protein: number;
    carbs: number;
    fat: number;
  };
  streak: number; // days of meeting goals
}

// Form types for nutrition
export interface FoodSearchQuery {
  query: string;
  barcode?: string;
  category?: string;
  limit?: number;
}

export interface AddFoodFormData {
  foodId: string;
  servings: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface CustomFoodFormData {
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  caloriesPerServing: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  category: string;
} 
// MCP types
export interface MCPTool {
  name: string;
  description: string;
  parameters: any;
  function: (params: any, userId: string) => Promise<any>;
}

export interface ToolCall {
  tool_name: string;
  parameters: Record<string, any>;
}

// Basic types for AI Coach functionality

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

export interface AIResponse {
  content: string;
  context?: {
    tokensUsed: number;
    processingTime: number;
    toolsExecuted: number;
  };
  suggestions?: string[];
  followUp?: string[];
}