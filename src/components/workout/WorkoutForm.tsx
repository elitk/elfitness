"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Exercise } from "@/lib/types";
import { z } from "zod";
import { ExerciseEntry } from './index';
import { ExerciseLibrary } from '../exercise';

const exerciseSchema = z.object({
  name: z.string().min(2, 'Exercise name required'),
  category: z.string().min(2, 'Category required'),
  sets: z.number().min(1, 'At least 1 set'),
  reps: z.number().min(1, 'At least 1 rep'),
  weight: z.number().optional(),
  duration: z.number().optional(),
  restTime: z.number().optional(),
});

const workoutSchema = z.object({
  name: z.string().min(2, "Workout name is required"),
  date: z.string(),
  duration: z.number().min(1, "Duration required"),
  notes: z.string().optional(),
  exercises: z.array(exerciseSchema).min(1, 'Add at least one exercise'),
});

type WorkoutFormData = z.infer<typeof workoutSchema>;

const WorkoutForm: React.FC = () => {
  const [formData, setFormData] = useState<WorkoutFormData>({
    name: "",
    date: new Date().toISOString().slice(0, 10),
    duration: 0,
    notes: "",
    exercises: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof WorkoutFormData, string>>>({});
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleChange = (field: keyof WorkoutFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const result = workoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof WorkoutFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as keyof WorkoutFormData] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Submission logic will go here
  };

  const handleExerciseChange = (idx: number, updated: Exercise) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => (i === idx ? updated : ex)),
    }));
  };

  const handleAddExercise = () => {
    setFormData((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name: '', category: '', sets: 1, reps: 1 } as Exercise,
      ],
    }));
  };

  const handleRemoveExercise = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== idx),
    }));
  };

  const handleSelectFromLibrary = (exercise: Exercise) => {
    setFormData((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { ...exercise },
      ],
    }));
    setLibraryOpen(false);
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-white dark:bg-surface text-gray-900 dark:text-white border-app">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Workout Name"
          placeholder="e.g. Push Day"
          value={formData.name}
          onChange={(v) => handleChange("name", v)}
          error={errors.name}
          required
        />
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(v) => handleChange("date", v)}
          error={errors.date}
          required
        />
        <Input
          label="Duration (minutes)"
          type="number"
          value={formData.duration.toString()}
          onChange={(v) => handleChange("duration", Number(v))}
          error={errors.duration}
          required
        />
        <Input
          label="Notes"
          placeholder="Optional notes"
          value={formData.notes || ""}
          onChange={(v) => handleChange("notes", v)}
          error={errors.notes}
        />
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900 dark:text-white">Exercises</span>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={handleAddExercise}>
                + Add Blank
              </Button>
              <Button type="button" variant="outline" onClick={() => setLibraryOpen(true)}>
                + From Library
              </Button>
            </div>
          </div>
          <ExerciseLibrary open={libraryOpen} onClose={() => setLibraryOpen(false)} onSelect={handleSelectFromLibrary} />
          {formData.exercises.length === 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">No exercises added yet.</div>
          )}
          {formData.exercises.map((exercise, idx) => (
            <ExerciseEntry
              key={idx}
              exercise={exercise}
              onChange={(ex) => handleExerciseChange(idx, ex)}
              onRemove={() => handleRemoveExercise(idx)}
              index={idx}
            />
          ))}
          {errors.exercises && (
            <div className="text-error text-xs mb-2">{errors.exercises}</div>
          )}
        </div>
        <Button type="submit" className="w-full">
          Save Workout
        </Button>
      </form>
    </Card>
  );
};

export default WorkoutForm; 