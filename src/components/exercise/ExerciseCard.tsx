import React from "react";
import { Exercise } from "@/lib/types";

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onClick }) => (
  <div
    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer hover:shadow-md transition"
    onClick={onClick}
    tabIndex={0}
    role={onClick ? 'button' : undefined}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="font-bold text-gray-900 dark:text-white text-lg">{exercise.name}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{exercise.category}</span>
    </div>
    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
      <span>Sets: {exercise.sets}</span>
      <span>Reps: {exercise.reps}</span>
      {exercise.weight !== undefined && <span>Weight: {exercise.weight}kg</span>}
      {exercise.duration !== undefined && <span>Duration: {exercise.duration}s</span>}
      {exercise.restTime !== undefined && <span>Rest: {exercise.restTime}s</span>}
    </div>
  </div>
);

export default ExerciseCard; 