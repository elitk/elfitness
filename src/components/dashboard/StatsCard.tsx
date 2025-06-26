import React from "react";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

/**
 * Card for displaying a single dashboard metric.
 */
const StatsCard: React.FC<StatsCardProps> = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col items-center">
    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
      {value}
    </span>
    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
  </div>
);

export default StatsCard;
