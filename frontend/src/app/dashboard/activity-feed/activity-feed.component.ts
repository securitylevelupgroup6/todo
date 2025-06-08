import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../../shared/models/dashboard.models';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      @for (activity of activities; track activity.id) {
        <div class="flex gap-4">
          <div class="relative">
            <div class="h-2 w-2 rounded-full bg-primary"></div>
            <div class="absolute left-1/2 top-2 h-full w-px -translate-x-1/2 bg-border"></div>
          </div>
          <div class="flex-1 space-y-1">
            <p class="text-sm text-muted-foreground">{{ activity.description }}</p>
            <p class="text-xs text-muted-foreground">{{ activity.timestamp | date:'short' }}</p>
          </div>
        </div>
      }
      @empty {
        <div class="text-center text-sm text-muted-foreground">
          No recent activity
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ActivityFeedComponent {
  @Input() activities: Activity[] = [];
} 