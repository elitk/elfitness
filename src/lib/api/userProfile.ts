import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { UserProfile } from '@/lib/types';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, data, { merge: true });
} 