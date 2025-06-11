import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../../shared/models/dashboard.models';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-4">
      @for (activity of activities; track activity.id) {
        <section class="flex gap-4">
          <section class="relative">
            <section class="h-2 w-2 rounded-full bg-primary"></section>
            <section class="absolute left-1/2 top-2 h-full w-px -translate-x-1/2 bg-border"></section>
          </section>
          <section class="flex-1 space-y-1">
            <p class="text-sm text-muted-foreground">{{ activity.description }}</p>
            <p class="text-xs text-muted-foreground">{{ activity.timestamp | date:'short' }}</p>
          </section>
        </section>
      }
      @empty {
        <section class="text-center text-sm text-muted-foreground">
          No recent activity
        </section>
      }
    </section>
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