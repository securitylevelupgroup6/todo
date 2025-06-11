import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputComponent } from '../../../ui/inputs/form-input/form-input.component';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, FormInputComponent],
  template: `
    <section class="space-y-4">
      <app-form-input
        label="Search"
        [(ngModel)]="filters.search"
        name="search"
        placeholder="Search tasks..."
        (ngModelChange)="onFilterChange.emit(filters)"
      ></app-form-input>

      <section class="grid grid-cols-2 gap-4">
        <section>
          <label class="text-sm font-medium">Status</label>
          <select
            [(ngModel)]="filters.status"
            name="status"
            class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            (ngModelChange)="onFilterChange.emit(filters)"
          >
            <option value="">All</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </section>

        <section>
          <label class="text-sm font-medium">Priority</label>
          <select
            [(ngModel)]="filters.priority"
            name="priority"
            class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            (ngModelChange)="onFilterChange.emit(filters)"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </section>
      </section>

      <section class="flex items-center space-x-2">
        <label class="text-sm font-medium">Sort by:</label>
        <select
          [(ngModel)]="filters.sortBy"
          name="sortBy"
          class="rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          (ngModelChange)="onFilterChange.emit(filters)"
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
        <button
          class="rounded-lg p-2 hover:bg-muted"
          (click)="toggleSortOrder()"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              [attr.d]="filters.sortOrder === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'"
            />
          </svg>
        </button>
      </section>
    </section>
  `,
  styles: []
})
export class TaskFilterComponent {
  @Input() filters: {
    search: string;
    status: string;
    priority: string;
    sortBy: 'dueDate' | 'priority' | 'status';
    sortOrder: 'asc' | 'desc';
  } = {
    search: '',
    status: '',
    priority: '',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  };

  @Output() onFilterChange = new EventEmitter<any>();

  toggleSortOrder(): void {
    this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    this.onFilterChange.emit(this.filters);
  }
} 