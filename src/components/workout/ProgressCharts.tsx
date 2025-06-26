import React from "react";
import ProgressChart from "@/components/dashboard/ProgressChart";

const MOCK_PROGRESS = [
  { week: "Week 1", workouts: 3, calories: 1200 },
  { week: "Week 2", workouts: 4, calories: 1500 },
  { week: "Week 3", workouts: 2, calories: 900 },
  { week: "Week 4", workouts: 5, calories: 1800 },
];

const ProgressCharts: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Monthly Progress</h3>
      <ProgressChart progress={75} />
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Workouts Per Week</h3>
      <div className="flex items-end gap-2 h-32">
        {MOCK_PROGRESS.map((d, i) => (
          <div key={i} className="flex flex-col items-center w-1/5">
            <div
              className="bg-primary rounded-t"
              style={{ height: `${d.workouts * 20}px`, width: '24px' }}
            />
            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">{d.week}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProgressCharts; 