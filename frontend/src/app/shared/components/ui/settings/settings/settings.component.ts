import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../buttons/button/button.component';

export interface SettingsNavItem {
  label: string;
  route: string;
  icon?: string;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <div class="container mx-auto max-w-7xl px-4 py-6">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <!-- Navigation -->
        <div class="space-y-1">
          <h2 class="mb-4 text-lg font-semibold">Settings</h2>
          <nav class="space-y-1">
            <a
              *ngFor="let item of navItems"
              [routerLink]="item.route"
              routerLinkActive="bg-muted"
              [class.opacity-50]="item.disabled"
              class="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <!-- Icon -->
              <svg
                *ngIf="item.icon"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  [attr.d]="item.icon"
                />
              </svg>
              <!-- Label -->
              <span>{{ item.label }}</span>
              <!-- Badge -->
              <span
                *ngIf="item.badge"
                class="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground"
              >
                {{ item.badge }}
              </span>
            </a>
          </nav>
        </div>

        <!-- Content -->
        <div class="space-y-6">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold">{{ title }}</h1>
              <p class="text-sm text-muted-foreground">{{ description }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <app-button
                *ngIf="showBack"
                variant="muted"
                size="sm"
                (onClick)="goBack()"
              >
                Back
              </app-button>
              <ng-content select="[headerActions]"></ng-content>
            </div>
          </div>

          <!-- Main Content -->
          <div class="space-y-6">
            <ng-content></ng-content>
          </div>

          <!-- Footer -->
          <div
            *ngIf="showFooter"
            class="flex items-center justify-between rounded-lg border bg-muted/50 p-4"
          >
            <div class="text-sm text-muted-foreground">
              <ng-content select="[footer]"></ng-content>
            </div>
            <div class="flex items-center space-x-2">
              <ng-content select="[footerActions]"></ng-content>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SettingsComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() navItems: SettingsNavItem[] = [];
  @Input() showBack = true;
  @Input() showFooter = false;

  @Output() onBack = new EventEmitter<void>();

  goBack(): void {
    this.onBack.emit();
  }
} 