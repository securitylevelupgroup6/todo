import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../buttons/button/button.component';

interface Step {
  title: string;
  description?: string;
  icon?: string;
  completed?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-form-stepper',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <section class="space-y-8">
      <!-- Steps -->
      <nav aria-label="Progress">
        <ol role="list" class="space-y-4 md:flex md:space-x-8 md:space-y-0">
          <li *ngFor="let step of steps; let i = index" class="md:flex-1">
            <section
              class="group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              [class.border-primary]="currentStep === i"
              [class.border-muted]="currentStep !== i"
            >
              <span class="text-sm font-medium"
                [class.text-primary]="currentStep === i"
                [class.text-muted-foreground]="currentStep !== i"
              >
                Step {{ i + 1 }}
              </span>
              <span class="text-sm font-medium">{{ step.title }}</span>
              <span *ngIf="step.description" class="text-sm text-muted-foreground">
                {{ step.description }}
              </span>
            </section>
          </li>
        </ol>
      </nav>

      <!-- Step Content -->
      <section class="mt-8">
        <ng-content></ng-content>
      </section>

      <!-- Navigation -->
      <section class="mt-8 flex justify-between">
        <app-button
          *ngIf="currentStep > 0"
          variant="muted"
          (onClick)="onPrevious.emit()"
        >
          Previous
        </app-button>
        <section *ngIf="currentStep === 0"></section>

        <app-button
          *ngIf="currentStep < steps.length - 1"
          (onClick)="onNext.emit()"
        >
          Next
        </app-button>
        <app-button
          *ngIf="currentStep === steps.length - 1"
          (onClick)="onSubmit.emit()"
        >
          Submit
        </app-button>
      </section>
    </section>
  `,
  styles: []
})
export class FormStepperComponent {
  @Input() steps: Step[] = [];
  @Input() currentStep = 0;

  @Output() onNext = new EventEmitter<void>();
  @Output() onPrevious = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<void>();
} 