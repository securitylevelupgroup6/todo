import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationItemComponent } from '../notification-item/notification-item.component';
import { ButtonComponent } from '../../../ui/buttons/button/button.component';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, NotificationItemComponent, ButtonComponent],
  template: `
    <section class="space-y-4">
      <section class="flex items-center justify-between">
        <section>
          <h2 class="text-2xl font-bold">{{ title }}</h2>
          <p class="text-sm text-muted-foreground">{{ description }}</p>
        </section>
        <section class="flex items-center space-x-2">
          <app-button
            *ngIf="showMarkAllRead && unreadCount > 0"
            variant="secondary"
            (onClick)="onMarkAllRead.emit()"
          >
            Mark all as read
          </app-button>
          <app-button
            *ngIf="showClearAll"
            variant="muted"
            (onClick)="onClearAll.emit()"
          >
            Clear all
          </app-button>
        </section>
      </section>

      <section class="space-y-2">
        <section
          *ngFor="let notification of notifications"
          class="animate-in fade-in slide-in-from-bottom-2"
        >
          <app-notification-item
            [notification]="notification"
            (onAction)="onAction.emit($event)"
            (onMarkAsRead)="onMarkAsRead.emit($event)"
          ></app-notification-item>
        </section>
      </section>

      <section
        *ngIf="notifications.length === 0"
        class="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
      >
        <svg
          class="h-10 w-10 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <h3 class="mt-4 text-lg font-semibold">No notifications</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ emptyStateMessage }}
        </p>
      </section>
    </section>
  `,
  styles: []
})
export class NotificationListComponent {
  @Input() title = 'Notifications';
  @Input() description = 'Stay updated with your latest notifications';
  @Input() notifications: any[] = [];
  @Input() showMarkAllRead = true;
  @Input() showClearAll = true;
  @Input() emptyStateMessage = 'You have no notifications at the moment.';

  @Output() onAction = new EventEmitter<{
    notification: any;
    action: any;
  }>();
  @Output() onMarkAsRead = new EventEmitter<any>();
  @Output() onMarkAllRead = new EventEmitter<void>();
  @Output() onClearAll = new EventEmitter<void>();

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
} 