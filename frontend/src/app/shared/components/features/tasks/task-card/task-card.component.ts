import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../ui/buttons/button/button.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="rounded-lg border bg-card p-4">
      <div class="flex items-start justify-between">
        <div class="space-y-1">
          <h3 class="font-medium">{{ task.title }}</h3>
          <p class="text-sm text-muted-foreground">{{ task.description }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <span
            [class]="'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' +
              (task.status === 'completed' ? 'bg-green-100 text-green-800' :
               task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
               'bg-yellow-100 text-yellow-800')"
          >
            {{ task.status }}
          </span>
          <span
            [class]="'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' +
              (task.priority === 'high' ? 'bg-red-100 text-red-800' :
               task.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
               'bg-green-100 text-green-800')"
          >
            {{ task.priority }}
          </span>
        </div>
      </div>
      
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center space-x-2 text-sm text-muted-foreground">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{{ task.dueDate | date }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <app-button
            variant="secondary"
            (onClick)="onEdit.emit(task)"
          >
            Edit
          </app-button>
          <app-button
            variant="muted"
            (onClick)="onDelete.emit(task)"
          >
            Delete
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TaskCardComponent {
  @Input() task: {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: Date;
  } = {
    id: '',
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date()
  };
  
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
} 