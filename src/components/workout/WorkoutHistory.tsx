'use client'
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useWorkouts } from "@/hooks/useWorkouts";
import { Pencil, Trash2 } from "lucide-react";

const WorkoutHistory: React.FC = () => {
  const { user } = useAuth();
  const { workouts, status, error, removeWorkout } = useWorkouts(user?.uid);

  console.log(workouts, 'workouts in history');
  const isLoading = status === 'loading';
  const isDeleting = status === 'deleting';

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await removeWorkout(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
        <p className="text-red-800 dark:text-red-200">Error loading workouts: {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
        <p className="text-gray-600 dark:text-gray-300">Please log in to view your workout history</p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="p-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-2">No workouts yet</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Create your first workout above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Card key={workout.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-900 dark:text-white text-lg">{workout.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{workout.date}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                {workout.exercises.length} exercises • {workout.duration} min • {workout.calories} kcal
              </div>
              {workout.notes && (
                <div className="text-xs text-gray-500 dark:text-gray-400 italic">{workout.notes}</div>
              )}
            </div>
            
            <div className="flex gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // TODO: Implement edit functionality
                  console.log('Edit workout:', workout.id);
                }}
                className="p-2"
                aria-label="Edit workout"
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(workout.id, workout.name)}
                disabled={isDeleting}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                aria-label="Delete workout"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
          
          {workout.exercises.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Exercises:</div>
              <div className="flex flex-wrap gap-1">
                {workout.exercises.map((exercise, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded"
                  >
                    {exercise.name} ({exercise.sets}×{exercise.reps})
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default WorkoutHistory; 