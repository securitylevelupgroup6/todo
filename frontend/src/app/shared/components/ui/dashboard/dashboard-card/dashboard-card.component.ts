import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../buttons/button/button.component';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div
      class="rounded-lg border bg-card p-6"
      [class.col-span-1]="!span"
      [class.col-span-2]="span === 2"
      [class.col-span-3]="span === 3"
      [class.col-span-4]="span === 4"
    >
      <!-- Card Header -->
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <p *ngIf="description" class="text-sm text-muted-foreground">
            {{ description }}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <app-button
            *ngIf="showRefresh"
            variant="muted"
            size="sm"
            (onClick)="refresh()"
          >
            Refresh
          </app-button>
          <ng-content select="[cardActions]"></ng-content>
        </div>
      </div>

      <!-- Card Content -->
      <div class="space-y-4">
        <!-- Metric -->
        <div *ngIf="metric" class="space-y-2">
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-bold">{{ metric.value }}</span>
            <span
              *ngIf="metric.change"
              class="text-sm"
              [class.text-success]="metric.change > 0"
              [class.text-destructive]="metric.change < 0"
            >
              {{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%
            </span>
          </div>
          <p *ngIf="metric.label" class="text-sm text-muted-foreground">
            {{ metric.label }}
          </p>
        </div>

        <!-- Chart -->
        <div *ngIf="showChart" class="h-[200px]">
          <ng-content select="[chart]"></ng-content>
        </div>

        <!-- List -->
        <div *ngIf="showList" class="space-y-2">
          <ng-content select="[list]"></ng-content>
        </div>

        <!-- Default Content -->
        <ng-content *ngIf="!metric && !showChart && !showList"></ng-content>
      </div>

      <!-- Card Footer -->
      <div
        *ngIf="showFooter"
        class="mt-4 flex items-center justify-between border-t pt-4"
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
export class DashboardCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() span?: 1 | 2 | 3 | 4;
  @Input() showRefresh = false;
  @Input() showFooter = false;
  @Input() showChart = false;
  @Input() showList = false;
  @Input() metric?: {
    value: string | number;
    label?: string;
    change?: number;
  };

  @Output() onRefresh = new EventEmitter<void>();

  refresh(): void {
    this.onRefresh.emit();
  }
} 