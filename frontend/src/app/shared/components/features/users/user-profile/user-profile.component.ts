import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../ui/buttons/button/button.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <section class="rounded-lg border bg-card p-6">
      <section class="flex items-start space-x-4">
        <section class="relative">
          <img
            [src]="user.avatar"
            [alt]="user.name"
            class="h-20 w-20 rounded-full object-cover"
          />
          <button
            *ngIf="editable"
            type="button"
            class="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-white hover:bg-primary/90"
            (click)="onEditAvatar.emit()"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </section>
        
        <section class="flex-1 space-y-1">
          <section class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">{{ user.name }}</h3>
            <section class="flex items-center space-x-2">
              <app-button
                *ngIf="editable"
                variant="secondary"
                (onClick)="onEdit.emit()"
              >
                Edit Profile
              </app-button>
            </section>
          </section>
          
          <p class="text-sm text-muted-foreground">{{ user.email }}</p>
          
          <section class="flex items-center space-x-4 text-sm text-muted-foreground">
            <section class="flex items-center space-x-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{{ user.role }}</span>
            </section>
            <section class="flex items-center space-x-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Joined {{ user.joinedAt | date }}</span>
            </section>
          </section>
        </section>
      </section>

      <section *ngIf="user.bio" class="mt-4">
        <p class="text-sm text-muted-foreground">{{ user.bio }}</p>
      </section>

      <section *ngIf="user.stats" class="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
        <section class="text-center">
          <p class="text-2xl font-semibold">{{ user.stats.teams }}</p>
          <p class="text-sm text-muted-foreground">Teams</p>
        </section>
        <section class="text-center">
          <p class="text-2xl font-semibold">{{ user.stats.tasks }}</p>
          <p class="text-sm text-muted-foreground">Tasks</p>
        </section>
        <section class="text-center">
          <p class="text-2xl font-semibold">{{ user.stats.completed }}</p>
          <p class="text-sm text-muted-foreground">Completed</p>
        </section>
      </section>
    </section>
  `,
  styles: []
})
export class UserProfileComponent {
  @Input() user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    joinedAt: Date;
    bio?: string;
    stats?: {
      teams: number;
      tasks: number;
      completed: number;
    };
  } = {
    id: '',
    name: '',
    email: '',
    avatar: '',
    role: '',
    joinedAt: new Date()
  };

  @Input() editable = false;

  @Output() onEdit = new EventEmitter<void>();
  @Output() onEditAvatar = new EventEmitter<void>();
} 