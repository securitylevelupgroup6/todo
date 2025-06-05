import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardMetrics } from '../../shared/models/dashboard.models';

@Component({
  selector: 'app-overview-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <!-- Total Teams -->
      <div class="rounded-lg border bg-card p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="rounded-full bg-primary/10 p-3">
            <svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-muted-foreground">Total Teams</p>
            <h3 class="text-2xl font-bold">{{ metrics.totalTeams }}</h3>
          </div>
        </div>
      </div>

      <!-- Active Users -->
      <div class="rounded-lg border bg-card p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="rounded-full bg-primary/10 p-3">
            <svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-muted-foreground">Active Users</p>
            <h3 class="text-2xl font-bold">{{ metrics.activeUsers }}</h3>
          </div>
        </div>
      </div>

      <!-- Ongoing Tasks -->
      <div class="rounded-lg border bg-card p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="rounded-full bg-primary/10 p-3">
            <svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-muted-foreground">Ongoing Tasks</p>
            <h3 class="text-2xl font-bold">{{ metrics.ongoingTasks }}</h3>
          </div>
        </div>
      </div>

      <!-- Completion Rate -->
      <div class="rounded-lg border bg-card p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <div class="rounded-full bg-primary/10 p-3">
            <svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-muted-foreground">Completion Rate</p>
            <h3 class="text-2xl font-bold">{{ metrics.completionRate }}%</h3>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class OverviewCardsComponent {
  @Input() metrics!: DashboardMetrics;
} 