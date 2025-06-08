import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../buttons/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="container mx-auto max-w-7xl px-4 py-6">
      <!-- Dashboard Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">{{ title }}</h1>
          <p class="text-sm text-muted-foreground">{{ description }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <app-button
            *ngIf="showRefresh"
            variant="muted"
            size="sm"
            (onClick)="refresh()"
          >
            Refresh All
          </app-button>
          <ng-content select="[headerActions]"></ng-content>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ng-content></ng-content>
      </div>

      <!-- Dashboard Footer -->
      <div
        *ngIf="showFooter"
        class="mt-6 flex items-center justify-between rounded-lg border bg-muted/50 p-4"
      >
        <div class="text-sm text-muted-foreground">
          <ng-content select="[footer]"></ng-content>
        </div>
        <div class="flex items-center space-x-2">
          <ng-content select="[footerActions]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() showRefresh = true;
  @Input() showFooter = false;

  @Output() onRefresh = new EventEmitter<void>();

  refresh(): void {
    this.onRefresh.emit();
  }
} 