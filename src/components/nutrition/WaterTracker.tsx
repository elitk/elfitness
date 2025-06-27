"use client";
import { useState } from "react";
import { useWaterTracking } from "@/hooks/useNutrition";
import { useAuth } from "@/hooks/useAuth";
import { Droplets } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface WaterTrackerProps {
  selectedDate?: Date;
  goalAmount?: number; // in ml
}

const WaterTracker = ({
  selectedDate = new Date(),
  goalAmount = 2000, // 2L default goal
}: WaterTrackerProps) => {
  const { user } = useAuth();
  const { waterEntries, totalWater, loading, error, addWaterEntry } =
    useWaterTracking(user?.uid, selectedDate);
  const [isAdding, setIsAdding] = useState(false);

  // Quick add amounts in ml
  const quickAmounts = [
    { label: "1 Cup", amount: 250, icon: "☕" },
    { label: "1 Glass", amount: 350, icon: "🥤" },
    { label: "Bottle", amount: 500, icon: "🍶" },
    { label: "Large Bottle", amount: 750, icon: "💧" },
  ];

  const progressPercentage = Math.min((totalWater / goalAmount) * 100, 100);
  const isGoalReached = totalWater >= goalAmount;

  const handleQuickAdd = async (amount: number) => {
    if (!user) return;

    setIsAdding(true);
    try {
      await addWaterEntry(amount);
    } catch (err) {
      console.error("Failed to add water:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const formatAmount = (ml: number) => {
    if (ml >= 1000) {
      return `${(ml / 1000).toFixed(1)}L`;
    }
    return `${ml}ml`;
  };

  const getTimeDisplay = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading && waterEntries.length === 0) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="text-blue-500 dark:text-blue-400" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Water Intake
            </h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatAmount(totalWater)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              of {formatAmount(goalAmount)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isGoalReached ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {isGoalReached && (
            <p className="text-green-600 dark:text-green-400 text-sm font-medium text-center">
              🎉 Daily goal reached!
            </p>
          )}
        </div>

        {/* Quick Add Buttons */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Quick Add
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {quickAmounts.map((item) => (
              <Button
                key={item.amount}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAdd(item.amount)}
                disabled={isAdding}
                className="flex items-center gap-2 p-3 h-auto"
              >
                <span className="text-lg">{item.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatAmount(item.amount)}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Water Entries Today */}
        {waterEntries.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Today&apos;s Entries ({waterEntries.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {waterEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Droplets
                      className="text-blue-500 dark:text-blue-400"
                      size={16}
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatAmount(entry.amount)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {getTimeDisplay(entry.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {waterEntries.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Droplets
              size={48}
              className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
            />
            <p>No water logged today</p>
            <p className="text-sm">Start tracking your hydration!</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Hydration Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
            💡 Hydration Tips
          </h5>
          <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
            <li>• Drink water when you wake up</li>
            <li>• Have a glass before each meal</li>
            <li>• Keep a water bottle nearby</li>
            <li>• Set reminders throughout the day</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default WaterTracker;
