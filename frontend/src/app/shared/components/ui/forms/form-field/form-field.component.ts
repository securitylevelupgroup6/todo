import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <!-- Label -->
      <div *ngIf="label" class="flex items-center justify-between">
        <label
          [for]="id"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {{ label }}
          <span *ngIf="required" class="text-destructive">*</span>
        </label>
        <div *ngIf="labelHint" class="text-sm text-muted-foreground">
          {{ labelHint }}
        </div>
      </div>

      <!-- Input -->
      <div class="relative">
        <ng-content></ng-content>
        <div
          *ngIf="prefix"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <ng-container *ngTemplateOutlet="prefix"></ng-container>
        </div>
        <div
          *ngIf="suffix"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <ng-container *ngTemplateOutlet="suffix"></ng-container>
        </div>
      </div>

      <!-- Description -->
      <p *ngIf="description" class="text-sm text-muted-foreground">
        {{ description }}
      </p>

      <!-- Error Message -->
      <p *ngIf="error" class="text-sm font-medium text-destructive">
        {{ error }}
      </p>
    </div>
  `,
  styles: []
})
export class FormFieldComponent {
  @Input() id = '';
  @Input() label = '';
  @Input() labelHint = '';
  @Input() description = '';
  @Input() error = '';
  @Input() required = false;

  @ContentChild('prefix') prefix?: TemplateRef<any>;
  @ContentChild('suffix') suffix?: TemplateRef<any>;
} 