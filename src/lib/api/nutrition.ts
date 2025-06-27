import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { 
  NutritionEntry, 
  FoodItem, 
  NutritionGoals, 
  WaterEntry, 
  NutritionStats,
  FoodSearchQuery,
  CustomFoodFormData,
} from '@/lib/types';
import { sampleFoods } from '@/lib/data/sampleFoods';

const COLLECTIONS = {
  NUTRITION_ENTRIES: 'nutritionEntries',
  FOOD_ITEMS: 'foodItems',
  NUTRITION_GOALS: 'nutritionGoals',
  MEAL_PLANS: 'mealPlans',
  WATER_ENTRIES: 'waterEntries',
} as const;

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date(timestamp);
};

// Nutrition Entries API
export const nutritionAPI = {
  // Get nutrition entry for a specific date
  async getNutritionEntry(userId: string, date: Date): Promise<NutritionEntry | null> {
    try {
      const dateString = date.toISOString().split('T')[0];
      const q = query(
        collection(db, COLLECTIONS.NUTRITION_ENTRIES),
        where('userId', '==', userId),
        where('date', '==', dateString)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      return {
        id: doc.id,
        ...data,
        date: convertTimestamp(data.date),
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as NutritionEntry;
    } catch (error) {
      console.error('Error getting nutrition entry:', error);
      throw new Error('Failed to get nutrition entry');
    }
  },

  // Get nutrition entries for a date range
  async getNutritionEntries(userId: string, startDate: Date, endDate: Date): Promise<NutritionEntry[]> {
    try {
      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];
      
      const q = query(
        collection(db, COLLECTIONS.NUTRITION_ENTRIES),
        where('userId', '==', userId),
        where('date', '>=', startDateString),
        where('date', '<=', endDateString),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: convertTimestamp(doc.data().date),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      })) as NutritionEntry[];
    } catch (error) {
      console.error('Error getting nutrition entries:', error);
      throw new Error('Failed to get nutrition entries');
    }
  },

  // Create or update nutrition entry
  async saveNutritionEntry(entry: Omit<NutritionEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const dateString = entry.date.toISOString().split('T')[0];
      
      // Check if entry exists for this date
      const existingEntry = await this.getNutritionEntry(entry.userId, entry.date);
      
      const entryData = {
        ...entry,
        date: dateString,
        updatedAt: serverTimestamp(),
      };

      if (existingEntry) {
        // Update existing entry
        const docRef = doc(db, COLLECTIONS.NUTRITION_ENTRIES, existingEntry.id);
        await updateDoc(docRef, entryData);
        return existingEntry.id;
      } else {
        // Create new entry
        const docRef = await addDoc(collection(db, COLLECTIONS.NUTRITION_ENTRIES), {
          ...entryData,
          createdAt: serverTimestamp(),
        });
        return docRef.id;
      }
    } catch (error) {
      console.error('Error saving nutrition entry:', error);
      throw new Error('Failed to save nutrition entry');
    }
  },

  // Delete nutrition entry
  async deleteNutritionEntry(entryId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.NUTRITION_ENTRIES, entryId));
    } catch (error) {
      console.error('Error deleting nutrition entry:', error);
      throw new Error('Failed to delete nutrition entry');
    }
  },
};

// Food Items API
export const foodAPI = {
  // Search food items
  async searchFoods(searchQuery: FoodSearchQuery): Promise<FoodItem[]> {
    try {
      // For development, use sample data
      if (process.env.NODE_ENV === 'development') {
        let foods: FoodItem[] = sampleFoods.map((food, index) => ({
          id: `sample-${index}`,
          ...food,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        if (searchQuery.query) {
          const searchTerm = searchQuery.query.toLowerCase();
          foods = foods.filter(food => 
            food.name.toLowerCase().includes(searchTerm) ||
            food.brand?.toLowerCase().includes(searchTerm)
          );
        }

        if (searchQuery.category) {
          foods = foods.filter(food => food.category === searchQuery.category);
        }

        return foods.slice(0, searchQuery.limit || 50);
      }

      // Production Firebase logic
      let q = query(collection(db, COLLECTIONS.FOOD_ITEMS));
      
      if (searchQuery.category) {
        q = query(q, where('category', '==', searchQuery.category));
      }
      
      q = query(q, limit(searchQuery.limit || 50));
      
      const querySnapshot = await getDocs(q);
      let foods = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      })) as FoodItem[];
      
      if (searchQuery.query) {
        const searchTerm = searchQuery.query.toLowerCase();
        foods = foods.filter(food => 
          food.name.toLowerCase().includes(searchTerm) ||
          food.brand?.toLowerCase().includes(searchTerm)
        );
      }
      
      return foods;
    } catch (error) {
      console.error('Error searching foods:', error);
      throw new Error('Failed to search foods');
    }
  },

  // Get food by ID
  async getFoodItem(foodId: string): Promise<FoodItem | null> {
    try {
      const docRef = doc(db, COLLECTIONS.FOOD_ITEMS, foodId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;
      
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: convertTimestamp(docSnap.data()?.createdAt),
        updatedAt: convertTimestamp(docSnap.data()?.updatedAt),
      } as FoodItem;
    } catch (error) {
      console.error('Error getting food item:', error);
      throw new Error('Failed to get food item');
    }
  },

  // Create custom food
  async createCustomFood(userId: string, foodData: CustomFoodFormData): Promise<string> {
    try {
      const newFood: Omit<FoodItem, 'id'> = {
        name: foodData.name,
        brand: foodData.brand,
        servingSize: foodData.servingSize,
        servingUnit: foodData.servingUnit,
        caloriesPerServing: foodData.caloriesPerServing,
        macros: {
          protein: foodData.protein,
          carbs: foodData.carbs,
          fat: foodData.fat,
          fiber: foodData.fiber,
          sugar: foodData.sugar,
        },
        category: foodData.category,
        isCustom: true,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.FOOD_ITEMS), {
        ...newFood,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating custom food:', error);
      throw new Error('Failed to create custom food');
    }
  },

  // Get user's custom foods
  async getUserCustomFoods(userId: string): Promise<FoodItem[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.FOOD_ITEMS),
        where('userId', '==', userId),
        where('isCustom', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      })) as FoodItem[];
    } catch (error) {
      console.error('Error getting custom foods:', error);
      throw new Error('Failed to get custom foods');
    }
  },
};

// Nutrition Goals API
export const goalsAPI = {
  // Get user's active nutrition goals
  async getNutritionGoals(userId: string): Promise<NutritionGoals | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.NUTRITION_GOALS),
        where('userId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      } as NutritionGoals;
    } catch (error) {
      console.error('Error getting nutrition goals:', error);
      throw new Error('Failed to get nutrition goals');
    }
  },

  // Create or update nutrition goals
  async saveNutritionGoals(goals: Omit<NutritionGoals, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Deactivate existing goals
      const existingGoals = await this.getNutritionGoals(goals.userId);
      if (existingGoals) {
        await updateDoc(doc(db, COLLECTIONS.NUTRITION_GOALS, existingGoals.id), {
          isActive: false,
          updatedAt: serverTimestamp(),
        });
      }

      // Create new goals
      const docRef = await addDoc(collection(db, COLLECTIONS.NUTRITION_GOALS), {
        ...goals,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving nutrition goals:', error);
      throw new Error('Failed to save nutrition goals');
    }
  },
};

// Water Tracking API
export const waterAPI = {
  // Get water entries for a date
  async getWaterEntries(userId: string, date: Date): Promise<WaterEntry[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const q = query(
        collection(db, COLLECTIONS.WATER_ENTRIES),
        where('userId', '==', userId),
        where('timestamp', '>=', Timestamp.fromDate(startOfDay)),
        where('timestamp', '<=', Timestamp.fromDate(endOfDay)),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: convertTimestamp(doc.data().timestamp),
      })) as WaterEntry[];
    } catch (error) {
      console.error('Error getting water entries:', error);
      throw new Error('Failed to get water entries');
    }
  },

  // Add water entry
  async addWaterEntry(userId: string, amount: number): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.WATER_ENTRIES), {
        userId,
        amount,
        timestamp: serverTimestamp(),
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding water entry:', error);
      throw new Error('Failed to add water entry');
    }
  },

  // Delete water entry
  async deleteWaterEntry(entryId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.WATER_ENTRIES, entryId));
    } catch (error) {
      console.error('Error deleting water entry:', error);
      throw new Error('Failed to delete water entry');
    }
  },
};

// Analytics API
export const analyticsAPI = {
  // Get nutrition stats for a period
  async getNutritionStats(userId: string, days: number = 30): Promise<NutritionStats> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const [entries, goals] = await Promise.all([
        nutritionAPI.getNutritionEntries(userId, startDate, endDate),
        goalsAPI.getNutritionGoals(userId)
      ]);
      
      if (entries.length === 0) {
        return {
          avgDailyCalories: 0,
          avgDailyProtein: 0,
          avgDailyCarbs: 0,
          avgDailyFat: 0,
          avgWaterIntake: 0,
          calorieGoalProgress: 0,
          macroGoalProgress: { protein: 0, carbs: 0, fat: 0 },
          streak: 0,
        };
      }
      
      // Calculate averages
      const totalCalories = entries.reduce((sum, entry) => sum + entry.totalCalories, 0);
      const totalProtein = entries.reduce((sum, entry) => sum + entry.macros.protein, 0);
      const totalCarbs = entries.reduce((sum, entry) => sum + entry.macros.carbs, 0);
      const totalFat = entries.reduce((sum, entry) => sum + entry.macros.fat, 0);
      const totalWater = entries.reduce((sum, entry) => sum + entry.waterIntake, 0);
      
      const avgDailyCalories = totalCalories / entries.length;
      const avgDailyProtein = totalProtein / entries.length;
      const avgDailyCarbs = totalCarbs / entries.length;
      const avgDailyFat = totalFat / entries.length;
      const avgWaterIntake = totalWater / entries.length;
      
      // Calculate goal progress
      let calorieGoalProgress = 0;
      let macroGoalProgress = { protein: 0, carbs: 0, fat: 0 };
      
      if (goals) {
        calorieGoalProgress = (avgDailyCalories / goals.dailyCalories) * 100;
        macroGoalProgress = {
          protein: (avgDailyProtein / goals.macroTargets.protein) * 100,
          carbs: (avgDailyCarbs / goals.macroTargets.carbs) * 100,
          fat: (avgDailyFat / goals.macroTargets.fat) * 100,
        };
      }
      
      // Calculate streak (simplified - consecutive days with entries)
      const streak = this.calculateStreak(entries);
      
      return {
        avgDailyCalories,
        avgDailyProtein,
        avgDailyCarbs,
        avgDailyFat,
        avgWaterIntake,
        calorieGoalProgress,
        macroGoalProgress,
        streak,
      };
    } catch (error) {
      console.error('Error getting nutrition stats:', error);
      throw new Error('Failed to get nutrition stats');
    }
  },

  // Helper to calculate streak
  calculateStreak(entries: NutritionEntry[]): number {
    if (entries.length === 0) return 0;
    
    const sortedEntries = entries.sort((a, b) => b.date.getTime() - a.date.getTime());
    let streak = 0;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  },
}; 