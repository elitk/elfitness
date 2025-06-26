import { WorkoutForm, WorkoutHistory, ProgressCharts, WorkoutTimer } from '@/components/workout';

const WorkoutsPage = () => (
  <div className="min-h-screen bg-white dark:bg-background p-4">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-8">Workout Timer</h2>
      <WorkoutTimer />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 mt-12">Create Workout</h1>
      <WorkoutForm />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-12 mb-4">Workout History</h2>
      <WorkoutHistory />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-12 mb-4">Progress Analytics</h2>
      <ProgressCharts />
    </div>
  </div>
);

export default WorkoutsPage; 