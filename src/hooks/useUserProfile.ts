import { useEffect, useState, useCallback } from 'react';
import type { UserProfile } from '@/lib/types';
import { getUserProfile, updateUserProfile } from '@/lib/api/userProfile';

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserProfile(userId);
        setProfile(data);
      } catch {
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!userId) return;
    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    try {
      await updateUserProfile(userId, data);
      setProfile((prev) => ({ ...prev, ...data } as UserProfile));
      setUpdateSuccess(true);
    } catch {
      setUpdateError('Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  }, [userId]);

  return { profile, loading, error, updateProfile, updating, updateError, updateSuccess };
} 