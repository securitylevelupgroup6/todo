import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamCardComponent } from '../team-card/team-card.component';
import { ButtonComponent } from '../../../ui/buttons/button/button.component';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, TeamCardComponent, ButtonComponent],
  template: `
    <section class="space-y-4">
      <section class="flex items-center justify-between">
        <section>
          <h2 class="text-2xl font-bold">{{ title }}</h2>
          <p class="text-sm text-muted-foreground">{{ description }}</p>
        </section>
        <app-button
          *ngIf="showAddButton"
          variant="primary"
          (onClick)="onAdd.emit()"
        >
          Create Team
        </app-button>
      </section>

      <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <app-team-card
          *ngFor="let team of teams"
          [team]="team"
          (onEdit)="onEdit.emit($event)"
          (onDelete)="onDelete.emit($event)"
        ></app-team-card>
      </section>

      <section
        *ngIf="teams.length === 0"
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 class="mt-4 text-lg font-semibold">No teams found</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ emptyStateMessage }}
        </p>
        <app-button
          *ngIf="showAddButton"
          class="mt-4"
          variant="primary"
          (onClick)="onAdd.emit()"
        >
          Create Team
        </app-button>
      </section>
    </section>
  `,
  styles: []
})
export class TeamListComponent {
  @Input() title = 'Teams';
  @Input() description = 'Manage your teams';
  @Input() teams: any[] = [];
  @Input() showAddButton = true;
  @Input() emptyStateMessage = 'Get started by creating a new team.';

  @Output() onAdd = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
} 