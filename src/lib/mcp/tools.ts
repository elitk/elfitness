import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { startOfWeek } from 'date-fns';

export async function getWaterThisWeek({ userId }: { userId: string }) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const q = query(
    collection(db, 'water_entries'),
    where('userId', '==', userId),
    where('timestamp', '>=', Timestamp.fromDate(weekStart)),
  );
  const snap = await getDocs(q);
  const litres = snap.docs.reduce((sum, d) => sum + d.data().ml, 0) / 1000;
  return { litres: +litres.toFixed(1) };
}

export async function getCaloriesThisWeek({ userId }: { userId: string }) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const q = query(
    collection(db, 'workouts'),
    where('userId', '==', userId),
    where('timestamp', '>=', Timestamp.fromDate(weekStart)),
  );
  const snap = await getDocs(q);
  const kcal = snap.docs.reduce((sum, d) => sum + d.data().calories, 0);
  return { kcal };
}

export const TOOL_MAP = {
  getWaterThisWeek,
  getCaloriesThisWeek,
} as const;
