'use client';
import Button from '@/components/ui/Button';
import StatsCard from '@/components/dashboard/StatsCard';
import ProgressChart from '@/components/dashboard/ProgressChart';
import { Dumbbell, Flame, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const DashboardPage = () => {
  const { user, loading: userLoading } = useAuth();
  const { stats, loading, error } = useDashboardStats(user?.uid);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Optionally redirect or show nothing
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome back, {user.displayName || 'User'}!
            </h1>
            <p className="text-text-secondary">
              Ready to crush your fitness goals today?
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error">{error}</div>
        ) : !stats ? (
          <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">No stats available yet. Start your first workout!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard icon={<Dumbbell size={28} />} label="Workouts" value={stats.totalWorkouts} />
            <StatsCard icon={<Flame size={28} />} label="Weekly Calories" value={stats.weeklyCalories} />
            <StatsCard icon={<TrendingUp size={28} />} label="Streak" value={stats.currentStreak + ' days'} />
            <div className="flex flex-col items-center justify-center bg-card rounded-lg shadow-sm border border-border p-4">
              <div className="mb-2 text-sm text-muted-foreground">Monthly Progress</div>
              <ProgressChart progress={stats.monthlyProgress} />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-16 text-lg">
              Start Workout
            </Button>
            <Button variant="secondary" className="h-16 text-lg">
              Log Nutrition
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 