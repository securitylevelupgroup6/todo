import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../ui/buttons/button/button.component';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <section
      class="flex items-start space-x-4 rounded-lg border bg-card p-4"
      [class.border-primary/20]="notification.read"
    >
      <section
        class="flex h-10 w-10 items-center justify-center rounded-full"
        [ngClass]="{
          'text-primary': notification.type === 'info',
          'bg-success/10 text-success': notification.type === 'success',
          'bg-warning/10 text-warning': notification.type === 'warning',
          'bg-destructive/10 text-destructive': notification.type === 'error'
        }"
      >
        <ng-container [ngSwitch]="notification.type">
          <svg
            *ngSwitchCase="'info'"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            *ngSwitchCase="'success'"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <svg
            *ngSwitchCase="'warning'"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <svg
            *ngSwitchCase="'error'"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </ng-container>
      </section>

      <section class="flex-1 space-y-1">
        <section class="flex items-center justify-between">
          <p class="text-sm font-medium">{{ notification.title }}</p>
          <span class="text-xs text-muted-foreground">
            {{ notification.time | date:'short' }}
          </span>
        </section>
        <p class="text-sm text-muted-foreground">{{ notification.message }}</p>
        
        <section *ngIf="notification.actions?.length" class="mt-2 flex items-center space-x-2">
          <app-button
            *ngFor="let action of notification.actions"
            [variant]="action.variant || 'secondary'"
            (onClick)="onAction.emit({ notification, action })"
          >
            {{ action.label }}
          </app-button>
        </section>
      </section>

      <button
        *ngIf="!notification.read"
        type="button"
        class="text-muted-foreground hover:text-foreground"
        (click)="onMarkAsRead.emit(notification)"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>
    </section>
  `,
  styles: []
})
export class NotificationItemComponent {
  @Input() notification: {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    time: Date;
    read: boolean;
    actions?: {
      label: string;
      variant?: 'primary' | 'secondary' | 'muted' | 'destructive';
    }[];
  } = {
    id: '',
    type: 'info',
    title: '',
    message: '',
    time: new Date(),
    read: false
  };

  @Output() onAction = new EventEmitter<{
    notification: any;
    action: any;
  }>();
  @Output() onMarkAsRead = new EventEmitter<any>();
} 