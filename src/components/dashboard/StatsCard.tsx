import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

/**
 * Card for displaying a single dashboard metric.
 */
const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-sm border border-border">
    <div className="text-primary">{icon}</div>
    <div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  </div>
);

export default StatsCard; 