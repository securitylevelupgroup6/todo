import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-2">
      <label *ngIf="label" [for]="id" class="text-sm font-medium leading-none">{{ label }}</label>
      <input
        [type]="type"
        [id]="id"
        [name]="name"
        [placeholder]="placeholder"
        [required]="required"
        [disabled]="disabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
        class="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <p *ngIf="error" class="text-sm text-destructive">{{ error }}</p>
    </section>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() id?: string;
  @Input() name?: string;
  @Input() placeholder?: string;
  @Input() required = false;
  @Input() disabled = false;
  @Input() error?: string;

  value: string = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
} 