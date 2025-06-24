'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Welcome back, {user?.displayName}!
              </h1>
              <p className="text-text-secondary">
                Ready to crush your fitness goals today?
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Workouts Completed"
              subtitle="This week"
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary mb-2">0</div>
              <p className="text-text-secondary">Keep up the great work!</p>
            </Card>

            <Card
              title="Calories Burned"
              subtitle="This week"
              className="text-center"
            >
              <div className="text-3xl font-bold text-secondary mb-2">0</div>
              <p className="text-text-secondary">Start your first workout!</p>
            </Card>

            <Card
              title="Current Streak"
              subtitle="Days in a row"
              className="text-center"
            >
              <div className="text-3xl font-bold text-accent mb-2">0</div>
              <p className="text-text-secondary">Build your momentum!</p>
            </Card>
          </div>

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
    </ProtectedRoute>
  );
};

export default DashboardPage; 