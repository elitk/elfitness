import React from 'react';

interface ProgressChartProps {
  progress: number;
}

/**
 * Simple progress bar chart for dashboard progress metric.
 */
const ProgressChart: React.FC<ProgressChartProps> = ({ progress }) => (
  <div className="w-full max-w-xs">
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Progress</h4>
      <svg viewBox="0 0 100 10" className="w-full h-4">
        <rect x="0" y="0" width="100" height="10" rx="5" fill="#e5e7eb" />
        <rect x="0" y="0" width={progress} height="10" rx="5" fill="#3b82f6" />
      </svg>
      <div className="text-xs text-muted-foreground mt-1">{progress}%</div>
    </div>
  </div>
);

export default ProgressChart; 