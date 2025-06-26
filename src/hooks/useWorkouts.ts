"use client";

import { useState, useEffect, useCallback } from "react";
import { Workout } from "@/lib/types";
import {
  getWorkoutsByUser,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  WorkoutApiError,
} from "@/lib/api/workouts";

type WorkoutStatus = "idle" | "loading" | "creating" | "updating" | "deleting";

interface UseWorkoutsReturn {
  workouts: Workout[];
  status: WorkoutStatus;
  error: string | null;
  isLoading: boolean;
  addWorkout: (workout: Omit<Workout, "id">) => Promise<string | null>;
  editWorkout: (id: string, workout: Partial<Workout>) => Promise<boolean>;
  removeWorkout: (id: string) => Promise<boolean>;
  refreshWorkouts: () => Promise<void>;
  clearError: () => void;
}

export const useWorkouts = (userId?: string): UseWorkoutsReturn => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [status, setStatus] = useState<WorkoutStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const isLoading = status !== "idle";


  console.log(workouts, "workouts");
  const fetchWorkouts = useCallback(async () => {
    if (!userId) return;

    setStatus("loading");
    setError(null);

    try {
      const fetchedWorkouts = await getWorkoutsByUser(userId);
      setWorkouts(fetchedWorkouts);
    } catch (err) {
      const errorMessage =
        err instanceof WorkoutApiError
          ? err.message
          : "Failed to fetch workouts";
      setError(errorMessage);
    } finally {
      setStatus("idle");
    }
  }, [userId]);

  const addWorkout = useCallback(
    async (workout: Omit<Workout, "id">): Promise<string | null> => {
      setStatus("creating");
      setError(null);

      try {
        const newWorkoutId = await createWorkout(workout);

        // Immediate optimistic update - add to the beginning of the list
        const newWorkout: Workout = { ...workout, id: newWorkoutId };
        setWorkouts((prev) => [newWorkout, ...prev]);

        setStatus("idle");
        return newWorkoutId;
      } catch (err) {
        const errorMessage =
          err instanceof WorkoutApiError
            ? err.message
            : "Failed to create workout";
        setError(errorMessage);
        setStatus("idle");
        return null;
      }
    },
    []
  );

  const editWorkout = useCallback(
    async (id: string, workoutUpdate: Partial<Workout>): Promise<boolean> => {
      setStatus("updating");
      setError(null);

      try {
        await updateWorkout(id, workoutUpdate);

        // Immediate optimistic update
        setWorkouts((prev) =>
          prev.map((workout) =>
            workout.id === id ? { ...workout, ...workoutUpdate } : workout
          )
        );

        setStatus("idle");
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof WorkoutApiError
            ? err.message
            : "Failed to update workout";
        setError(errorMessage);
        setStatus("idle");
        return false;
      }
    },
    []
  );

  const removeWorkout = useCallback(async (id: string): Promise<boolean> => {
    setStatus("deleting");
    setError(null);

    try {
      await deleteWorkout(id);

      // Immediate optimistic update
      setWorkouts((prev) => prev.filter((workout) => workout.id !== id));

      setStatus("idle");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof WorkoutApiError
          ? err.message
          : "Failed to delete workout";
      setError(errorMessage);
      setStatus("idle");
      return false;
    }
  }, []);

  const refreshWorkouts = useCallback(async () => {
    await fetchWorkouts();
  }, [fetchWorkouts]);

  useEffect(() => {
    if (userId) {
      fetchWorkouts();
    }
  }, [userId, fetchWorkouts]);


  return {
    workouts,
    status,
    error,
    isLoading,
    addWorkout,
    editWorkout,
    removeWorkout,
    refreshWorkouts,
    clearError,
  };
};
