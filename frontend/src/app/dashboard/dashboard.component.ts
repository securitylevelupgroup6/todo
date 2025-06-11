import { Component, OnInit } from '@angular/core';
import { OverviewCardsComponent } from './overview-cards/overview-cards.component';
import { ActivityFeedComponent } from './activity-feed/activity-feed.component';
import { PerformanceChartComponent } from './performance-chart/performance-chart.component';
import { TaskDistributionComponent } from './task-distribution/task-distribution.component';
import { DashboardMetrics, Activity } from '../shared/models/dashboard.models';
import { DashboardService } from '../shared/data-access/services/dashboard.service';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { AuthService } from '../core/services/auth.service';

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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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
  user: any;

  constructor(
    private dashboardService: DashboardService,
    private taskService: TaskService,
    private authService: AuthService
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit() {
    if(this.user) this.loadDashboardData();
  }

  private loadDashboardData() {
    // Load metrics
    this.taskService.getUserToDos().subscribe(data => {
      if(data.results) {
        console.log(data.results);
      } else {

      }
    })
  }
}
