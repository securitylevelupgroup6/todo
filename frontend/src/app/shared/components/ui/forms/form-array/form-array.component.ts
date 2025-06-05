import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../buttons/button/button.component';

@Component({
  selector: 'app-form-array',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium">{{ title }}</h3>
          <p *ngIf="description" class="text-sm text-muted-foreground">
            {{ description }}
          </p>
        </div>
        <app-button
          *ngIf="!disabled"
          variant="outline"
          (onClick)="onAdd.emit()"
        >
          Add {{ itemLabel }}
        </app-button>
      </div>

      <!-- Items -->
      <div class="space-y-4">
        <div
          *ngFor="let item of items; let i = index"
          class="group relative rounded-lg border bg-card p-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }">
              </ng-container>
            </div>
            <button
              *ngIf="!disabled"
              class="ml-4 text-muted-foreground hover:text-destructive"
              (click)="onRemove.emit(i)"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        *ngIf="items.length === 0"
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <h3 class="mt-4 text-lg font-semibold">No {{ itemLabel }}s added</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ emptyStateMessage }}
        </p>
        <app-button
          *ngIf="!disabled"
          class="mt-4"
          variant="outline"
          (onClick)="onAdd.emit()"
        >
          Add {{ itemLabel }}
        </app-button>
      </div>
    </div>
  `,
  styles: []
})
export class FormArrayComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() items: any[] = [];
  @Input() itemLabel = 'Item';
  @Input() disabled = false;
  @Input() emptyStateMessage = 'Add your first item to get started.';

  @Output() onAdd = new EventEmitter<void>();
  @Output() onRemove = new EventEmitter<number>();

  @ContentChild('itemTemplate') itemTemplate?: TemplateRef<any>;
} 