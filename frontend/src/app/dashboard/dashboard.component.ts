import { Component, OnInit } from '@angular/core';
import { OverviewCardsComponent } from './overview-cards/overview-cards.component';
import { ActivityFeedComponent } from './activity-feed/activity-feed.component';
import { PerformanceChartComponent } from './performance-chart/performance-chart.component';
import { TaskDistributionComponent } from './task-distribution/task-distribution.component';
import { DashboardMetrics, Activity } from '../shared/models/dashboard.models';
import { DashboardService } from '../shared/data-access/services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    OverviewCardsComponent,
    ActivityFeedComponent,
    PerformanceChartComponent,
    TaskDistributionComponent
  ],
  template: `
    <main class="min-h-screen bg-background">
      <!-- Header Section -->
      <header class="border-b bg-card">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p class="text-muted-foreground">Welcome back! Here's an overview of your task management system.</p>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="container mx-auto px-4 py-6">
        <!-- Overview Cards -->
        <section class="mb-8">
          <app-overview-cards [metrics]="metrics"></app-overview-cards>
        </section>

        <!-- Charts and Activity Feed -->
        <section class="grid gap-6 md:grid-cols-12">
          <!-- Performance Chart -->
          <article class="md:col-span-8">
            <div class="rounded-lg border bg-card p-6 shadow-sm">
              <h2 class="mb-4 text-lg font-semibold">Team Performance</h2>
              <app-performance-chart [teamPerformance]="metrics.teamPerformance"></app-performance-chart>
            </div>
          </article>

          <!-- Activity Feed -->
          <aside class="md:col-span-4">
            <div class="rounded-lg border bg-card p-6 shadow-sm">
              <h2 class="mb-4 text-lg font-semibold">Recent Activity</h2>
              <app-activity-feed [activities]="activities"></app-activity-feed>
            </div>
          </aside>
        </section>

        <!-- Task Distribution -->
        <section class="mt-6">
          <div class="rounded-lg border bg-card p-6 shadow-sm">
            <h2 class="mb-4 text-lg font-semibold">Task Distribution</h2>
            <app-task-distribution [tasksByStatus]="metrics.tasksByStatus"></app-task-distribution>
          </div>
        </section>
      </div>
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }

    .container {
      max-width: 1280px;
    }

    @media (max-width: 768px) {
      .container {
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
  `]
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
