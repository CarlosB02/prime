import React from 'react';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardMetrics } from './dashboard/DashboardMetrics';
import { DashboardToReview } from './dashboard/DashboardToReview';
import { DashboardWeek } from './dashboard/DashboardWeek';
import { DashboardMessages } from './dashboard/DashboardMessages';
import { DashboardCommunity } from './dashboard/DashboardCommunity';

interface DashboardViewProps {
  onNavigate?: (view: string, id?: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const handleNavigate = (view: string, id?: string) => {
    if (onNavigate) {
      onNavigate(view, id);
    } else {
      console.log(`Navigation triggered to ${view} with id: ${id}`);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <DashboardHeader onNavigate={handleNavigate} />
      
      <DashboardMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardMessages onNavigate={handleNavigate} />
        <DashboardCommunity onNavigate={handleNavigate} />
        <DashboardToReview onNavigate={handleNavigate} />
      </div>
      
      <div className="w-full">
        <DashboardWeek onNavigate={handleNavigate} />
      </div>
    </div>
  );
};

export default DashboardView;
