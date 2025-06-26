import { db } from '@/lib/firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { Workout } from '@/lib/types';

export class WorkoutApiError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'WorkoutApiError';
  }
}

export async function getWorkoutsByUser(userId: string): Promise<Workout[]> {
  try {
    const q = query(collection(db, 'workouts'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      ...(doc.data() as Omit<Workout, 'id' | 'date'>),
      id: doc.id,
      date: (doc.data().date instanceof Timestamp)
        ? doc.data().date.toDate().toISOString().slice(0, 10)
        : doc.data().date,
    }));
  } catch (e: unknown) {
    const error = e as { code?: string; message?: string };
    throw new WorkoutApiError('Failed to fetch workouts', error.code);
  }
}

export async function createWorkout(workout: Omit<Workout, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'workouts'), {
      ...workout,
      date: Timestamp.fromDate(new Date(workout.date)),
    });
    return docRef.id;
  } catch (e: unknown) {
    const error = e as { code?: string; message?: string };
    throw new WorkoutApiError('Failed to create workout', error.code);
  }
}

export async function updateWorkout(id: string, workout: Partial<Workout>): Promise<void> {
  try {
    const updateData = {
      ...workout,
      ...(workout.date && { date: Timestamp.fromDate(new Date(workout.date)) }),
    };
    await updateDoc(doc(db, 'workouts', id), updateData);
  } catch (e: unknown) {
    const error = e as { code?: string; message?: string };
    throw new WorkoutApiError('Failed to update workout', error.code);
  }
}

export async function deleteWorkout(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'workouts', id));
  } catch (e: unknown) {
    const error = e as { code?: string; message?: string };
    throw new WorkoutApiError('Failed to delete workout', error.code);
  }
} 