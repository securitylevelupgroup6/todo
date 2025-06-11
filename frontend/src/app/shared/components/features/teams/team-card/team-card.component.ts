import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../ui/buttons/button/button.component';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <section class="rounded-lg border bg-card p-4">
      <section class="flex items-start justify-between">
        <section class="space-y-1">
          <h3 class="font-medium">{{ team.name }}</h3>
          <p class="text-sm text-muted-foreground">{{ team.description }}</p>
        </section>
        <section class="flex items-center space-x-2">
          <span
            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-primary"
          >
            {{ team.members.length }} members
          </span>
        </section>
      </section>
      
      <section class="mt-4">
        <section class="flex -space-x-2">
          <section
            *ngFor="let member of team.members.slice(0, 5)"
            class="inline-block h-8 w-8 rounded-full ring-2 ring-background"
            [title]="member.name"
          >
            <img
              [src]="member.avatar"
              [alt]="member.name"
              class="h-full w-full rounded-full object-cover"
            />
          </section>
          <section
            *ngIf="team.members.length > 5"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium ring-2 ring-background"
          >
            +{{ team.members.length - 5 }}
          </section>
        </section>
      </section>
      
      <section class="mt-4 flex items-center justify-between">
        <section class="flex items-center space-x-2 text-sm text-muted-foreground">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Created {{ team.createdAt | date }}</span>
        </section>
        <section class="flex items-center space-x-2">
          <app-button
            variant="secondary"
            (onClick)="onEdit.emit(team)"
          >
            Edit
          </app-button>
          <app-button
            variant="muted"
            (onClick)="onDelete.emit(team)"
          >
            Delete
          </app-button>
        </section>
      </section>
    </section>
  `,
  styles: []
})
export class TeamCardComponent {
  @Input() team: {
    id: string;
    name: string;
    description: string;
    members: {
      id: string;
      name: string;
      avatar: string;
    }[];
    createdAt: Date;
  } = {
    id: '',
    name: '',
    description: '',
    members: [],
    createdAt: new Date()
  };
  
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
} 