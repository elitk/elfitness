import React from "react";
import Card from "@/components/ui/Card";
import { Workout } from "@/lib/types";

const MOCK_WORKOUTS: Workout[] = [
  {
    id: "1",
    userId: "u1",
    name: "Push Day",
    date: new Date().toISOString().slice(0, 10),
    duration: 60,
    exercises: [
      { name: "Bench Press", category: "Chest", sets: 3, reps: 8 },
      { name: "Overhead Press", category: "Shoulders", sets: 3, reps: 10 },
    ],
    calories: 400,
    notes: "Felt strong!",
  },
  {
    id: "2",
    userId: "u1",
    name: "Leg Day",
    date: new Date().toISOString().slice(0, 10),
    duration: 50,
    exercises: [
      { name: "Squat", category: "Legs", sets: 4, reps: 6 },
    ],
    calories: 350,
  },
];

const WorkoutHistory: React.FC = () => (
  <div className="space-y-4">
    {MOCK_WORKOUTS.map((workout) => (
      <Card key={workout.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-gray-900 dark:text-white text-lg">{workout.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{workout.date}</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
          {workout.exercises.length} exercises • {workout.duration} min • {workout.calories} kcal
        </div>
        {workout.notes && <div className="text-xs text-gray-500 dark:text-gray-400 italic">{workout.notes}</div>}
      </Card>
    ))}
  </div>
);

export default WorkoutHistory; 