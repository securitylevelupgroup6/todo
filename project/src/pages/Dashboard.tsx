import React from 'react';
import { OverviewCards } from '../components/dashboard/OverviewCards';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { PerformanceChart } from '../components/dashboard/PerformanceChart';
import { TaskDistribution } from '../components/dashboard/TaskDistribution';
import { dashboardMetrics, activities } from '../data/mockData';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your task management system.</p>
      </div>
      
      <OverviewCards metrics={dashboardMetrics} />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <PerformanceChart teamPerformance={dashboardMetrics.teamPerformance} />
        </div>
        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
      
      <TaskDistribution 
        tasksByStatus={dashboardMetrics.tasksByStatus} 
        tasksByPriority={dashboardMetrics.tasksByPriority} 
      />
    </div>
  );
}