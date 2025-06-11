import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputComponent } from '../../../ui/inputs/form-input/form-input.component';
import { ButtonComponent } from '../../../ui/buttons/button/button.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormInputComponent, ButtonComponent],
  template: `
    <form (ngSubmit)="onSubmit.emit(task)" class="space-y-4">
      <app-form-input
        label="Title"
        [(ngModel)]="task.title"
        name="title"
        required
        [error]="errors.title"
      ></app-form-input>

      <app-form-input
        label="Description"
        [(ngModel)]="task.description"
        name="description"
        [error]="errors.description"
      ></app-form-input>

      <section class="grid grid-cols-2 gap-4">
        <section>
          <label class="text-sm font-medium">Status</label>
          <select
            [(ngModel)]="task.status"
            name="status"
            class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </section>

        <section>
          <label class="text-sm font-medium">Priority</label>
          <select
            [(ngModel)]="task.priority"
            name="priority"
            class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </section>
      </section>

      <app-form-input
        label="Due Date"
        type="date"
        [(ngModel)]="task.dueDate"
        name="dueDate"
        required
        [error]="errors.dueDate"
      ></app-form-input>

      <section class="flex justify-end space-x-2">
        <app-button
          type="button"
          variant="muted"
          (onClick)="onCancel.emit()"
        >
          Cancel
        </app-button>
        <app-button
          type="submit"
          variant="primary"
        >
          {{ submitLabel }}
        </app-button>
      </section>
    </form>
  `,
  styles: []
})
export class TaskFormComponent {
  @Input() task: {
    id?: string;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
  } = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  };

  @Input() errors: {
    title?: string;
    description?: string;
    dueDate?: string;
  } = {};

  @Input() submitLabel = 'Create Task';

  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();
} 