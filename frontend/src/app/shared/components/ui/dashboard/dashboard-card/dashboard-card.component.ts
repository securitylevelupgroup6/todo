import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../buttons/button/button.component';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <section
      class="rounded-lg border bg-card p-6"
      [class.col-span-1]="!span"
      [class.col-span-2]="span === 2"
      [class.col-span-3]="span === 3"
      [class.col-span-4]="span === 4"
    >
      <!-- Card Header -->
      <section class="mb-4 flex items-center justify-between">
        <section>
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <p *ngIf="description" class="text-sm text-muted-foreground">
            {{ description }}
          </p>
        </section>
        <section class="flex items-center space-x-2">
          <app-button
            *ngIf="showRefresh"
            variant="muted"
            size="sm"
            (onClick)="refresh()"
          >
            Refresh
          </app-button>
          <ng-content select="[cardActions]"></ng-content>
        </section>
      </section>

      <!-- Card Content -->
      <section class="space-y-4">
        <!-- Metric -->
        <section *ngIf="metric" class="space-y-2">
          <section class="flex items-baseline justify-between">
            <span class="text-2xl font-bold">{{ metric.value }}</span>
            <span
              *ngIf="metric.change"
              class="text-sm"
              [class.text-success]="metric.change > 0"
              [class.text-destructive]="metric.change < 0"
            >
              {{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%
            </span>
          </section>
          <p *ngIf="metric.label" class="text-sm text-muted-foreground">
            {{ metric.label }}
          </p>
        </section>

        <!-- Chart -->
        <section *ngIf="showChart" class="h-[200px]">
          <ng-content select="[chart]"></ng-content>
        </section>

        <!-- List -->
        <section *ngIf="showList" class="space-y-2">
          <ng-content select="[list]"></ng-content>
        </section>

        <!-- Default Content -->
        <ng-content *ngIf="!metric && !showChart && !showList"></ng-content>
      </section>

      <!-- Card Footer -->
      <section
        *ngIf="showFooter"
        class="mt-4 flex items-center justify-between border-t pt-4"
      >
        <section class="text-sm text-muted-foreground">
          <ng-content select="[footer]"></ng-content>
        </section>
        <section class="flex items-center space-x-2">
          <ng-content select="[footerActions]"></ng-content>
        </section>
      </section>
    </section>
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