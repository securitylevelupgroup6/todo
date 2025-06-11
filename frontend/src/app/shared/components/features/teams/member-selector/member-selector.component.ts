import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputComponent } from '../../../ui/inputs/form-input/form-input.component';

@Component({
  selector: 'app-member-selector',
  standalone: true,
  imports: [CommonModule, FormInputComponent],
  template: `
    <section class="space-y-4">
      <app-form-input
        label="Search Members"
        [(ngModel)]="search"
        name="search"
        placeholder="Search by name or email..."
        (ngModelChange)="onSearch.emit($event)"
      ></app-form-input>

      <section class="space-y-2">
        <section
          *ngFor="let member of members"
          class="flex items-center justify-between rounded-lg border p-2"
        >
          <section class="flex items-center space-x-2">
            <img
              [src]="member.avatar"
              [alt]="member.name"
              class="h-8 w-8 rounded-full"
            />
            <section>
              <p class="text-sm font-medium">{{ member.name }}</p>
              <p class="text-xs text-muted-foreground">{{ member.email }}</p>
            </section>
          </section>
          <button
            type="button"
            class="text-sm text-primary hover:text-primary/80"
            (click)="onSelect.emit(member)"
          >
            Add
          </button>
        </section>
      </section>

      <section
        *ngIf="members.length === 0"
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <h3 class="mt-4 text-lg font-semibold">No members found</h3>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ emptyStateMessage }}
        </p>
      </section>
    </section>
  `,
  styles: []
})
export class MemberSelectorComponent {
  @Input() members: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  }[] = [];

  @Input() search = '';
  @Input() emptyStateMessage = 'No members match your search.';

  @Output() onSearch = new EventEmitter<string>();
  @Output() onSelect = new EventEmitter<any>();
} 