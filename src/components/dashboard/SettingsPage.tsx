"use client";

import React, { useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Moon, Sun, Bell, User, Shield, Download } from "lucide-react";

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useSettings();
  const [workoutReminders, setWorkoutReminders] = useState(false);
  const [progressUpdates, setProgressUpdates] = useState(true);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance Section */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Appearance
                </h2>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Switch between light and dark themes
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={theme === "dark"}
                  onClick={toggleTheme}
                  className={`
                    relative inline-flex h-7 w-12 items-center rounded-full transition-colors
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800
                    ${theme === "dark" ? "bg-primary" : "bg-gray-300"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform
                      ${theme === "dark" ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                  <span className="sr-only">Toggle dark mode</span>
                </button>
              </div>
            </div>
          </Card>

          {/* Notifications Section */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Workout Reminders
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Get reminded about your scheduled workouts
                    </p>
                  </div>
                                     <button
                     type="button"
                     role="switch"
                     aria-checked={workoutReminders}
                     onClick={() => setWorkoutReminders(!workoutReminders)}
                     className={`
                       relative inline-flex h-7 w-12 items-center rounded-full transition-colors
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800
                       ${workoutReminders ? "bg-primary" : "bg-gray-300"}
                     `}
                   >
                     <span
                       className={`
                         inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform
                         ${workoutReminders ? "translate-x-6" : "translate-x-1"}
                       `}
                     />
                     <span className="sr-only">Toggle workout reminders</span>
                   </button>
                </div>

                                 <div className="flex items-center justify-between">
                   <div>
                     <h3 className="font-medium text-gray-900 dark:text-white">
                       Progress Updates
                     </h3>
                     <p className="text-sm text-gray-600 dark:text-gray-300">
                       Weekly progress and milestone notifications
                     </p>
                   </div>
                   <button
                     type="button"
                     role="switch"
                     aria-checked={progressUpdates}
                     onClick={() => setProgressUpdates(!progressUpdates)}
                     className={`
                       relative inline-flex h-7 w-12 items-center rounded-full transition-colors
                       focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800
                       ${progressUpdates ? "bg-primary" : "bg-gray-300"}
                     `}
                   >
                     <span
                       className={`
                         inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform
                         ${progressUpdates ? "translate-x-6" : "translate-x-1"}
                       `}
                     />
                     <span className="sr-only">Toggle progress updates</span>
                   </button>
                 </div>
              </div>
            </div>
          </Card>

          {/* Account Section */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Account
                </h2>
              </div>
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Manage Subscription
                </Button>
              </div>
            </div>
          </Card>

          {/* Privacy & Security Section */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900">
                  <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Privacy & Security
                </h2>
              </div>
              
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Data Export
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>

          {/* Data Section */}
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                  <Download className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Data Management
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Units
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Choose your preferred measurement system
                    </p>
                  </div>
                                     <select 
                     className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1"
                     value={units}
                     onChange={(e) => setUnits(e.target.value as 'metric' | 'imperial')}
                   >
                     <option value="metric">Metric (kg, cm)</option>
                     <option value="imperial">Imperial (lbs, ft)</option>
                   </select>
                </div>
                
                <Button variant="outline" className="w-full justify-start">
                  Export My Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Import Workout Data
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 