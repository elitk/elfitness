import React, { useState } from "react";
import { Exercise } from "@/lib/types";
import { ExerciseCard } from ".";

interface ExerciseLibraryProps {
  onSelect: (exercise: Exercise) => void;
  onClose: () => void;
  open: boolean;
}

const MOCK_EXERCISES: Exercise[] = [
  { name: "Bench Press", category: "Chest", sets: 3, reps: 8 },
  { name: "Squat", category: "Legs", sets: 4, reps: 6 },
  { name: "Deadlift", category: "Back", sets: 3, reps: 5 },
  { name: "Plank", category: "Core", sets: 3, reps: 1, duration: 60 },
];

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ onSelect, onClose, open }) => {
  const [search, setSearch] = useState("");
  const filtered = MOCK_EXERCISES.filter(
    (ex) =>
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.category.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Exercise Library</h2>
        <input
          className="w-full mb-4 p-2 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filtered.length === 0 && <div className="text-gray-500 dark:text-gray-400">No exercises found.</div>}
          {filtered.map((ex, i) => (
            <ExerciseCard
              key={i}
              exercise={ex}
              onClick={() => onSelect(ex)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseLibrary; 