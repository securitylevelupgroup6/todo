import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FormSectionComponent } from '../form-section/form-section.component';
import { FormGroupComponent } from '../form-group/form-group.component';
import { FormInputComponent } from '../../inputs/form-input/form-input.component';
import { ButtonComponent } from '../../buttons/button/button.component';

interface FormFieldConfig {
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  options?: { label: string; value: any }[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
}

interface FormSectionConfig {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
}

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormFieldComponent,
    FormSectionComponent,
    FormGroupComponent,
    FormInputComponent,
    ButtonComponent
  ],
  template: `
    <app-form-group
      [disabled]="disabled"
      [errors]="errors"
      (onSubmit)="onSubmit.emit()"
      (onValueChange)="onValueChange.emit($event)"
    >
      <ng-container *ngFor="let section of sections">
        <app-form-section
          [title]="section.title"
          [description]="section.description"
        >
          <ng-container *ngFor="let field of section.fields">
            <app-form-field
              [label]="field.label"
              [id]="field.name"
              [required]="field.required"
              [description]="field.description"
            >
              <!-- Text Input -->
              <app-form-input
                *ngIf="field.type === 'text'"
                [type]="'text'"
                [id]="field.name"
                [name]="field.name"
                [placeholder]="field.placeholder"
                [required]="field.required"
                [disabled]="field.disabled"
                [pattern]="field.validation?.pattern"
                [minLength]="field.validation?.minLength"
                [maxLength]="field.validation?.maxLength"
              ></app-form-input>

              <!-- Email Input -->
              <app-form-input
                *ngIf="field.type === 'email'"
                [type]="'email'"
                [id]="field.name"
                [name]="field.name"
                [placeholder]="field.placeholder"
                [required]="field.required"
                [disabled]="field.disabled"
                [pattern]="field.validation?.pattern"
              ></app-form-input>

              <!-- Password Input -->
              <app-form-input
                *ngIf="field.type === 'password'"
                [type]="'password'"
                [id]="field.name"
                [name]="field.name"
                [placeholder]="field.placeholder"
                [required]="field.required"
                [disabled]="field.disabled"
                [minLength]="field.validation?.minLength"
                [maxLength]="field.validation?.maxLength"
              ></app-form-input>

              <!-- Number Input -->
              <app-form-input
                *ngIf="field.type === 'number'"
                [type]="'number'"
                [id]="field.name"
                [name]="field.name"
                [placeholder]="field.placeholder"
                [required]="field.required"
                [disabled]="field.disabled"
                [min]="field.validation?.min"
                [max]="field.validation?.max"
              ></app-form-input>

              <!-- Select Input -->
              <select
                *ngIf="field.type === 'select'"
                [id]="field.name"
                [name]="field.name"
                [required]="field.required"
                [disabled]="field.disabled"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="" disabled selected>{{ field.placeholder }}</option>
                <option *ngFor="let option of field.options" [value]="option.value">
                  {{ option.label }}
                </option>
              </select>

              <!-- Checkbox Input -->
              <section *ngIf="field.type === 'checkbox'" class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  [id]="field.name"
                  [name]="field.name"
                  [required]="field.required"
                  [disabled]="field.disabled"
                  class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label [for]="field.name" class="text-sm font-medium">
                  {{ field.label }}
                </label>
              </section>

              <!-- Radio Input -->
              <section *ngIf="field.type === 'radio'" class="space-y-2">
                <section *ngFor="let option of field.options" class="flex items-center space-x-2">
                  <input
                    type="radio"
                    [id]="option.value"
                    [name]="field.name"
                    [value]="option.value"
                    [required]="field.required"
                    [disabled]="field.disabled"
                    class="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <label [for]="option.value" class="text-sm font-medium">
                    {{ option.label }}
                  </label>
                </section>
              </section>

              <!-- Textarea Input -->
              <textarea
                *ngIf="field.type === 'textarea'"
                [id]="field.name"
                [name]="field.name"
                [placeholder]="field.placeholder"
                [required]="field.required"
                [disabled]="field.disabled"
                [minLength]="field.validation?.minLength"
                [maxLength]="field.validation?.maxLength"
                class="w-full rounded-md border border-input bg-background px-3 py-2"
                rows="4"
              ></textarea>
            </app-form-field>
          </ng-container>
        </app-form-section>
      </ng-container>

      <!-- Form Actions -->
      <ng-template #actions>
        <app-button
          *ngIf="showCancel"
          variant="muted"
          (onClick)="onCancel.emit()"
        >
          Cancel
        </app-button>
        <app-button
          type="submit"
          [disabled]="disabled"
        >
          {{ submitLabel }}
        </app-button>
      </ng-template>
    </app-form-group>
  `,
  styles: []
})
export class FormBuilderComponent {
  @Input() sections: FormSectionConfig[] = [];
  @Input() disabled = false;
  @Input() errors: string[] = [];
  @Input() showCancel = true;
  @Input() submitLabel = 'Submit';

  @Output() onSubmit = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onValueChange = new EventEmitter<any>();
} 