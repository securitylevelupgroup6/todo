import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Users, Briefcase, CheckSquare, BarChart2 } from 'lucide-react';
import { DashboardMetrics } from '../../types';

type OverviewCardsProps = {
  metrics: DashboardMetrics;
};

export function OverviewCards({ metrics }: OverviewCardsProps) {
  const cards = [
    {
      title: 'Total Teams',
      value: metrics.totalTeams,
      icon: <Briefcase className="h-5 w-5 text-primary" />,
      description: 'Active teams in the system',
      trend: '+2 this month',
      trendUp: true,
    },
    {
      title: 'Active Users',
      value: metrics.activeUsers,
      icon: <Users className="h-5 w-5 text-secondary" />,
      description: 'Currently active users',
      trend: '+5 this month',
      trendUp: true,
    },
    {
      title: 'Ongoing Tasks',
      value: metrics.ongoingTasks,
      icon: <CheckSquare className="h-5 w-5 text-accent" />,
      description: 'Tasks in progress',
      trend: '-3 this week',
      trendUp: false,
    },
    {
      title: 'Completion Rate',
      value: `${metrics.completionRate}%`,
      icon: <BarChart2 className="h-5 w-5 text-success" />,
      description: 'Average completion rate',
      trend: '+12% this month',
      trendUp: true,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="animate-in">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className="rounded-full bg-muted p-2">{card.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
            <div className="mt-2 flex items-center text-xs">
              <span
                className={
                  card.trendUp
                    ? 'text-success'
                    : 'text-error'
                }
              >
                {card.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}