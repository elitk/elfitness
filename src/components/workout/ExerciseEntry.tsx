import React from "react";
import Input from "@/components/ui/Input";
import { Exercise } from "@/lib/types";

interface ExerciseEntryProps {
  exercise: Exercise;
  onChange: (exercise: Exercise) => void;
  onRemove?: () => void;
  index: number;
}

const categories = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Cardio",
  "Other",
];

const ExerciseEntry: React.FC<ExerciseEntryProps> = ({ exercise, onChange, onRemove, index }) => {
  const handleFieldChange = (field: keyof Exercise, value: string | number | undefined) => {
    onChange({ ...exercise, [field]: value });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700 flex flex-col gap-2 relative">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900 dark:text-white">Exercise {index + 1}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 dark:text-red-400 hover:underline text-sm"
            aria-label="Remove exercise"
          >
            Remove
          </button>
        )}
      </div>
      <Input
        label="Name"
        placeholder="e.g. Bench Press"
        value={exercise.name}
        onChange={(v) => handleFieldChange("name", v)}
        required
      />
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <select
          className="w-full rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm p-2"
          value={exercise.category}
          onChange={(e) => handleFieldChange("category", e.target.value)}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <Input
          label="Sets"
          type="number"
          value={exercise.sets.toString()}
          onChange={(v) => handleFieldChange("sets", Number(v))}
          required
        />
        <Input
          label="Reps"
          type="number"
          value={exercise.reps.toString()}
          onChange={(v) => handleFieldChange("reps", Number(v))}
          required
        />
        <Input
          label="Weight (kg)"
          type="number"
          value={exercise.weight?.toString() || ""}
          onChange={(v) => handleFieldChange("weight", v ? Number(v) : undefined)}
        />
        <Input
          label="Duration (sec)"
          type="number"
          value={exercise.duration?.toString() || ""}
          onChange={(v) => handleFieldChange("duration", v ? Number(v) : undefined)}
        />
        <Input
          label="Rest (sec)"
          type="number"
          value={exercise.restTime?.toString() || ""}
          onChange={(v) => handleFieldChange("restTime", v ? Number(v) : undefined)}
        />
      </div>
    </div>
  );
};

export default ExerciseEntry; 