import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'rounded-lg border bg-card p-6 ' + (className || '')">
      <div *ngIf="title" class="mb-4">
        <h3 class="text-xl font-semibold">{{ title }}</h3>
        <p *ngIf="description" class="text-sm text-muted-foreground">{{ description }}</p>
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardComponent {
  @Input() title?: string;
  @Input() description?: string;
  @Input() className?: string;
} 