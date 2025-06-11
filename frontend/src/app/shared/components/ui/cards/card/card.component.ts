import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section [class]="'rounded-lg border bg-card p-6 ' + (className || '')">
      <section *ngIf="title" class="mb-4">
        <h3 class="text-xl font-semibold">{{ title }}</h3>
        <p *ngIf="description" class="text-sm text-muted-foreground">{{ description }}</p>
      </section>
      <ng-content></ng-content>
    </section>
  `,
  styles: []
})
export class CardComponent {
  @Input() title?: string;
  @Input() description?: string;
  @Input() className?: string;
} 