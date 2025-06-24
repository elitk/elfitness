import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { DashboardStats } from '@/lib/types';

/**
 * Fetch dashboard stats for a user from Firestore.
 */
export async function getDashboardStats(userId: string): Promise<DashboardStats | null> {
  const statsRef = doc(db, 'dashboardStats', userId);
  const statsSnap = await getDoc(statsRef);
  if (statsSnap.exists()) {
    return statsSnap.data() as DashboardStats;
  }
  return null;
}

/**
 * Update dashboard stats for a user in Firestore.
 */
export async function updateDashboardStats(userId: string, data: Partial<DashboardStats>): Promise<void> {
  const statsRef = doc(db, 'dashboardStats', userId);
  await setDoc(statsRef, data, { merge: true });
} 