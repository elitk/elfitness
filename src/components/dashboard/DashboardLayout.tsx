import React from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout for the dashboard, including sidebar and responsive design.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-background text-gray-900 dark:text-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-white dark:bg-background">{children}</main>
    </div>
  );
};

export default DashboardLayout; 