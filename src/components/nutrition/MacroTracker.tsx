'use client';
import { MacroNutrients } from '@/lib/types';

interface MacroTrackerProps {
  current: MacroNutrients;
  goals: MacroNutrients;
  className?: string;
}

const MacroTracker = ({ current, goals, className = '' }: MacroTrackerProps) => {
  const macros = [
    {
      name: 'Protein',
      current: current.protein,
      goal: goals.protein,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100 dark:bg-blue-900/30',
      unit: 'g',
    },
    {
      name: 'Carbs',
      current: current.carbs,
      goal: goals.carbs,
      color: 'bg-green-500',
      lightColor: 'bg-green-100 dark:bg-green-900/30',
      unit: 'g',
    },
    {
      name: 'Fat',
      current: current.fat,
      goal: goals.fat,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      unit: 'g',
    },
    {
      name: 'Fiber',
      current: current.fiber,
      goal: goals.fiber,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100 dark:bg-purple-900/30',
      unit: 'g',
    },
  ];

  const formatValue = (value: number) => Math.round(value * 10) / 10;

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Macronutrients</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {macros.map((macro) => {
          const percentage = Math.min((macro.current / macro.goal) * 100, 100);
          const isOverGoal = macro.current > macro.goal;
          
          return (
            <div key={macro.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {macro.name}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatValue(macro.current)}/{formatValue(macro.goal)}{macro.unit}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className={`w-full ${macro.lightColor} rounded-full h-2 overflow-hidden`}>
                <div
                  className={`h-full transition-all duration-300 ${
                    isOverGoal ? 'bg-red-500' : macro.color
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              
              {/* Percentage Text */}
              <div className="text-right">
                <span className={`text-xs ${
                  isOverGoal ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {Math.round(percentage)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Protein</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {formatValue(current.protein)}g
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round((current.protein * 4))} cal
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Carbs</p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              {formatValue(current.carbs)}g
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round((current.carbs * 4))} cal
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Fat</p>
            <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
              {formatValue(current.fat)}g
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round((current.fat * 9))} cal
            </p>
          </div>
        </div>
      </div>

      {/* Macro Ratio Chart */}
      <MacroChart current={current} />
    </div>
  );
};

// Macro Ratio Pie Chart Component
const MacroChart = ({ current }: { current: MacroNutrients }) => {
  const totalCals = (current.protein * 4) + (current.carbs * 4) + (current.fat * 9);
  
  if (totalCals === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        <p className="text-sm">No macros logged yet</p>
      </div>
    );
  }
  
  const proteinCals = current.protein * 4;
  const carbCals = current.carbs * 4;
  const fatCals = current.fat * 9;
  
  const proteinPerc = (proteinCals / totalCals) * 100;
  const carbPerc = (carbCals / totalCals) * 100;
  const fatPerc = (fatCals / totalCals) * 100;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Calorie Distribution</h4>
      
      {/* Simple Bar Chart */}
      <div className="flex h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
        <div 
          className="bg-blue-500" 
          style={{ width: `${proteinPerc}%` }}
          title={`Protein: ${Math.round(proteinPerc)}%`}
        />
        <div 
          className="bg-green-500" 
          style={{ width: `${carbPerc}%` }}
          title={`Carbs: ${Math.round(carbPerc)}%`}
        />
        <div 
          className="bg-yellow-500" 
          style={{ width: `${fatPerc}%` }}
          title={`Fat: ${Math.round(fatPerc)}%`}
        />
      </div>
      
      {/* Legend */}
      <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span>P: {Math.round(proteinPerc)}%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span>C: {Math.round(carbPerc)}%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
          <span>F: {Math.round(fatPerc)}%</span>
        </div>
      </div>
    </div>
  );
};

export default MacroTracker; 