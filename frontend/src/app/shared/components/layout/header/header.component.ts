import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <section class="container flex h-14 items-center">
        <section class="mr-4 flex">
          <a class="mr-6 flex items-center space-x-2" routerLink="/">
            <span class="font-bold">Task Manager</span>
          </a>
          <nav class="flex items-center space-x-6 text-sm font-medium">
            <a
              *ngFor="let item of navItems"
              [routerLink]="item.route"
              routerLinkActive="text-foreground"
              [routerLinkActiveOptions]="{ exact: true }"
              class="transition-colors hover:text-foreground/80"
            >
              {{ item.label }}
            </a>
          </nav>
        </section>
        <section class="profile flex flex-1 items-center justify-end space-x-4">
          <nav class="flex items-center space-x-2">
            <button
              *ngIf="showProfile"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
              (click)="onProfileClick.emit()"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </nav>
          <button mat-button>Logout</button>
        </section>
      </section>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() navItems: { label: string; route: string }[] = [];
  @Input() showSettings = true;
  @Input() showProfile = true;
  @Output() onSettingsClick = new EventEmitter<void>();
  @Output() onProfileClick = new EventEmitter<void>();
} 