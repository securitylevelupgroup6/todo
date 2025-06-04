import { Component, OnInit } from '@angular/core';
import { OverviewCardsComponent } from './overview-cards/overview-cards.component';
import { ActivityFeedComponent } from './activity-feed/activity-feed.component';
import { PerformanceChartComponent } from './performance-chart/performance-chart.component';
import { TaskDistributionComponent } from './task-distribution/task-distribution.component';
import { DashboardMetrics, Activity } from '../shared/models/dashboard.models';
import { DashboardService } from '../shared/data-access/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    OverviewCardsComponent,
    ActivityFeedComponent,
    PerformanceChartComponent,
    TaskDistributionComponent
  ],
  template: `
    <main class="space-y-6 p-6">
      <header>
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <p class="text-muted-foreground">Overview of your task management system.</p>
      </header>
      
      <app-overview-cards [metrics]="metrics"></app-overview-cards>
      
      <section class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <article class="md:col-span-2">
          <app-performance-chart [teamPerformance]="metrics.teamPerformance"></app-performance-chart>
        </article>
        <aside>
          <app-activity-feed [activities]="activities"></app-activity-feed>
        </aside>
      </section>
      
      <app-task-distribution 
        [tasksByStatus]="metrics.tasksByStatus">
      </app-task-distribution>
    </main>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  metrics: DashboardMetrics = {
    totalTeams: 0,
    activeUsers: 0,
    ongoingTasks: 0,
    completionRate: 0,
    tasksByStatus: {},
    teamPerformance: []
  };

  activities: Activity[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Load metrics
    this.dashboardService.getDashboardMetrics().subscribe(
      metrics => {
        this.metrics = metrics;
      },
      error => {
        console.error('Error loading dashboard metrics:', error);
      }
    );

    // Load activities
    this.dashboardService.getActivities().subscribe(
      activities => {
        this.activities = activities;
      },
      error => {
        console.error('Error loading activities:', error);
      }
    );
  }
}
