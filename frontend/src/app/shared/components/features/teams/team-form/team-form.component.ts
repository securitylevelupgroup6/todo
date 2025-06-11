import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputComponent } from '../../../ui/inputs/form-input/form-input.component';
import { ButtonComponent } from '../../../ui/buttons/button/button.component';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, FormInputComponent, ButtonComponent],
  template: `
    <form (ngSubmit)="onSubmit.emit(team)" class="space-y-4">
      <app-form-input
        label="Team Name"
        [(ngModel)]="team.name"
        name="name"
        required
        [error]="errors.name"
      ></app-form-input>

      <app-form-input
        label="Description"
        [(ngModel)]="team.description"
        name="description"
        [error]="errors.description"
      ></app-form-input>

      <section>
        <label class="text-sm font-medium">Team Members</label>
        <section class="mt-2 space-y-2">
          <section
            *ngFor="let member of team.members"
            class="flex items-center justify-between rounded-lg border p-2"
          >
            <section class="flex items-center space-x-2">
              <img
                [src]="member.avatar"
                [alt]="member.name"
                class="h-8 w-8 rounded-full"
              />
              <span class="text-sm">{{ member.name }}</span>
            </section>
            <button
              type="button"
              class="text-sm text-destructive hover:text-destructive/80"
              (click)="removeMember(member)"
            >
              Remove
            </button>
          </section>
        </section>
        <button
          type="button"
          class="mt-2 text-sm text-primary hover:text-primary/80"
          (click)="onAddMember.emit()"
        >
          + Add Member
        </button>
      </section>

      <section class="flex justify-end space-x-2">
        <app-button
          type="button"
          variant="muted"
          (onClick)="onCancel.emit()"
        >
          Cancel
        </app-button>
        <app-button
          type="submit"
          variant="primary"
        >
          {{ submitLabel }}
        </app-button>
      </section>
    </form>
  `,
  styles: []
})
export class TeamFormComponent {
  @Input() team: {
    id?: string;
    name: string;
    description: string;
    members: {
      id: string;
      name: string;
      avatar: string;
    }[];
  } = {
    name: '',
    description: '',
    members: []
  };

  @Input() errors: {
    name?: string;
    description?: string;
  } = {};

  @Input() submitLabel = 'Create Team';

  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onAddMember = new EventEmitter<void>();

  removeMember(member: any): void {
    this.team.members = this.team.members.filter(m => m.id !== member.id);
  }
} 