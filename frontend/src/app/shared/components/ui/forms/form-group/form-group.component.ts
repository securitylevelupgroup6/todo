import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="space-y-4"
      [class.opacity-50]="disabled"
      [class.pointer-events-none]="disabled"
    >
      <!-- Form Content -->
      <form
        [class.space-y-4]="true"
        (ngSubmit)="onSubmit.emit()"
        #form="ngForm"
      >
        <ng-content></ng-content>

        <!-- Form Actions -->
        <div *ngIf="showActions" class="flex items-center justify-end space-x-2">
          <ng-container *ngTemplateOutlet="actions"></ng-container>
        </div>
      </form>

      <!-- Form Errors -->
      <div *ngIf="errors.length > 0" class="rounded-md bg-destructive/15 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-destructive">Form Errors</h3>
            <div class="mt-2 text-sm text-destructive">
              <ul class="list-disc space-y-1 pl-5">
                <li *ngFor="let error of errors">{{ error }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormGroupComponent),
      multi: true
    }
  ]
})
export class FormGroupComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() showActions = true;
  @Input() errors: string[] = [];

  @Output() onSubmit = new EventEmitter<void>();
  @Output() onValueChange = new EventEmitter<any>();

  @ContentChild('actions') actions?: TemplateRef<any>;

  private _value: any = {};
  private _onChange: (value: any) => void = () => {};
  private _onTouched: () => void = () => {};

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
    this._onChange(value);
    this.onValueChange.emit(value);
  }

  writeValue(value: any): void {
    this._value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  updateValue(key: string, value: any): void {
    this._value = {
      ...this._value,
      [key]: value
    };
    this._onChange(this._value);
    this.onValueChange.emit(this._value);
  }

  validate(): boolean {
    return this.errors.length === 0;
  }
} 