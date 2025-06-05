import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Section Header -->
      <div *ngIf="title || description" class="space-y-1">
        <h3 *ngIf="title" class="text-lg font-medium">{{ title }}</h3>
        <p *ngIf="description" class="text-sm text-muted-foreground">
          {{ description }}
        </p>
      </div>

      <!-- Section Content -->
      <div class="space-y-4">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class FormSectionComponent {
  @Input() title = '';
  @Input() description = '';
} 