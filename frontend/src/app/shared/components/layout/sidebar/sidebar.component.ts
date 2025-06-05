import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background">
      <div class="flex h-14 items-center border-b px-4">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
      </div>
      <nav class="flex-1 space-y-1 p-4">
        <a
          *ngFor="let item of items"
          [routerLink]="item.route"
          routerLinkActive="bg-accent text-accent-foreground"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
        >
          <svg
            *ngIf="item.icon"
            class="mr-3 h-4 w-4"
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
          {{ item.label }}
        </a>
      </nav>
      <div class="border-t p-4">
        <ng-content></ng-content>
      </div>
    </aside>
  `,
  styles: []
})
export class SidebarComponent {
  @Input() title = '';
  @Input() items: {
    label: string;
    route: string;
    icon?: string;
  }[] = [];
} 