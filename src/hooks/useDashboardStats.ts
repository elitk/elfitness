'use client'
import { useEffect, useState } from 'react';
import type { DashboardStats } from '@/lib/types';
import { getDashboardStats } from '@/lib/api/dashboardStats';

export function useDashboardStats(userId?: string) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboardStats(userId);
        setStats(data);
      } catch {
        setError('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [userId]);

  return { stats, loading, error };
} 