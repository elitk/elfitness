'use client';
import { useState } from 'react';
import { FoodDiary, WaterTracker } from '@/components/nutrition';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';

const NutritionPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isFuture = (date: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Date Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Nutrition Tracking
            </h1>
            {!isToday(selectedDate) && (
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="flex items-center gap-2"
              >
                <Calendar size={16} />
                Today
              </Button>
            )}
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousDay}
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {formatDate(selectedDate)}
              </h2>
              {isToday(selectedDate) && (
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Today</span>
              )}
              {isFuture(selectedDate) && (
                <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">Future</span>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextDay}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Food Diary - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <FoodDiary selectedDate={selectedDate} />
          </div>

          {/* Sidebar with Water Tracker and other widgets */}
          <div className="space-y-6">
            <WaterTracker selectedDate={selectedDate} />
            
            {/* Quick Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Calories Remaining</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Weekly Average</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">1,890 cal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Streak</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">7 days</span>
                </div>
              </div>
            </div>

            {/* Nutrition Tips */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800 p-6">
              <h3 className="text-lg font-semibold mb-3 text-green-800 dark:text-green-300">
                💡 Nutrition Tips
              </h3>
              <ul className="text-sm text-green-700 dark:text-green-400 space-y-2">
                <li>• Eat protein with every meal</li>
                <li>• Fill half your plate with vegetables</li>
                <li>• Choose whole grains over refined</li>
                <li>• Stay hydrated throughout the day</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionPage; 