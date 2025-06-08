import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { DashboardMetrics } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

type TaskDistributionProps = {
  tasksByStatus: DashboardMetrics['tasksByStatus'];
  tasksByPriority: DashboardMetrics['tasksByPriority'];
};

export function TaskDistribution({
  tasksByStatus,
  tasksByPriority,
}: TaskDistributionProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const statusData: ChartData<'doughnut'> = {
    labels: Object.keys(tasksByStatus).map(
      (key) => key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')
    ),
    datasets: [
      {
        data: Object.values(tasksByStatus),
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)', // pending
          'rgba(14, 165, 233, 0.8)', // in_progress
          'rgba(16, 185, 129, 0.8)', // completed
          'rgba(244, 63, 94, 0.8)', // blocked
        ],
        borderWidth: 0,
      },
    ],
  };

  const priorityData: ChartData<'doughnut'> = {
    labels: Object.keys(tasksByPriority).map(
      (key) => key.charAt(0).toUpperCase() + key.slice(1)
    ),
    datasets: [
      {
        data: Object.values(tasksByPriority),
        backgroundColor: [
          'rgba(148, 163, 184, 0.8)', // low
          'rgba(14, 165, 233, 0.8)', // medium
          'rgba(245, 158, 11, 0.8)', // high
          'rgba(244, 63, 94, 0.8)', // urgent
        ],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card className="animate-in">
        <CardHeader>
          <CardTitle>Tasks by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <Doughnut data={statusData} options={options} />
          </div>
        </CardContent>
      </Card>

      <Card className="animate-in">
        <CardHeader>
          <CardTitle>Tasks by Priority</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <Doughnut data={priorityData} options={options} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}