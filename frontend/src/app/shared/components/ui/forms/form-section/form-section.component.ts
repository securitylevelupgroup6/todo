import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="space-y-6">
      <!-- Section Header -->
      <section *ngIf="title || description" class="space-y-1">
        <h3 *ngIf="title" class="text-lg font-medium">{{ title }}</h3>
        <p *ngIf="description" class="text-sm text-muted-foreground">
          {{ description }}
        </p>
      </section>

      <!-- Section Content -->
      <section class="space-y-4">
        <ng-content></ng-content>
      </section>
    </section>
  `,
  styles: []
})
export class FormSectionComponent {
  @Input() title = '';
  @Input() description = '';
} 