import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../buttons/button/button.component';

@Component({
  selector: 'app-data-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="space-y-4">
      <!-- List Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold">{{ title }}</h2>
          <p class="text-sm text-muted-foreground">{{ description }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <ng-content select="[listActions]"></ng-content>
        </div>
      </div>

      <!-- List -->
      <div class="space-y-2">
        <div
          *ngFor="let item of data"
          class="group relative rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
          [class.border-primary/20]="isSelected(item)"
        >
          <div class="flex items-start space-x-4">
            <!-- Selection Checkbox -->
            <div *ngIf="selectable" class="pt-1">
              <input
                type="checkbox"
                [checked]="isSelected(item)"
                (change)="toggleSelect(item)"
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>

            <!-- Item Content -->
            <div class="flex-1">
              <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }">
              </ng-container>
            </div>

            <!-- Item Actions -->
            <div
              *ngIf="actions"
              class="flex items-center space-x-2 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ng-container *ngTemplateOutlet="actions; context: { $implicit: item }">
              </ng-container>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between">
        <div class="text-sm text-muted-foreground">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalItems }} entries
        </div>
        <div class="flex items-center space-x-2">
          <app-button
            variant="muted"
            [disabled]="currentPage === 1"
            (onClick)="onPageChange.emit(currentPage - 1)"
          >
            Previous
          </app-button>
          <div class="flex items-center space-x-1">
            <button
              *ngFor="let page of pageNumbers"
              class="h-8 w-8 rounded-md border"
              [class.border-primary]="page === currentPage"
              [class.bg-primary]="page === currentPage"
              [class.text-primary-foreground]="page === currentPage"
              (click)="onPageChange.emit(page)"
            >
              {{ page }}
            </button>
          </div>
          <app-button
            variant="muted"
            [disabled]="currentPage === totalPages"
            (onClick)="onPageChange.emit(currentPage + 1)"
          >
            Next
          </app-button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        *ngIf="data.length === 0"
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
        <h3 class="mt-4 text-lg font-semibold">No data found</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ emptyStateMessage }}
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class DataListComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() data: any[] = [];
  @Input() selectable = false;
  @Input() actions?: any;
  @Input() itemTemplate?: any;
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Input() emptyStateMessage = 'No data available.';

  @Output() onPageChange = new EventEmitter<number>();
  @Output() onSelectionChange = new EventEmitter<any[]>();

  selectedItems: any[] = [];

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.totalItems);
  }

  isSelected(item: any): boolean {
    return this.selectedItems.includes(item);
  }

  toggleSelect(item: any): void {
    const index = this.selectedItems.indexOf(item);
    if (index === -1) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(index, 1);
    }
    this.onSelectionChange.emit(this.selectedItems);
  }
} 