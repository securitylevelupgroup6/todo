import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';
import { ButtonComponent } from '../../../ui/buttons/button/button.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, ButtonComponent],
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
          Add Task
        </app-button>
      </section>

      <section class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <app-task-card
          *ngFor="let task of tasks"
          [task]="task"
          (onEdit)="onEdit.emit($event)"
          (onDelete)="onDelete.emit($event)"
        ></app-task-card>
      </section>

      <section
        *ngIf="tasks.length === 0"
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 class="mt-4 text-lg font-semibold">No tasks found</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ emptyStateMessage }}
        </p>
        <app-button
          *ngIf="showAddButton"
          class="mt-4"
          variant="primary"
          (onClick)="onAdd.emit()"
        >
          Add Task
        </app-button>
      </section>
    </section>
  `,
  styles: []
})
export class TaskListComponent {
  @Input() title = 'Tasks';
  @Input() description = 'Manage your tasks';
  @Input() tasks: any[] = [];
  @Input() showAddButton = true;
  @Input() emptyStateMessage = 'Get started by creating a new task.';

  @Output() onAdd = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
} 