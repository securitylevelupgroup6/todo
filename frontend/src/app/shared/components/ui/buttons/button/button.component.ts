import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [class]="'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ' + 
        (variant === 'primary' ? 'bg-primary text-primary-foreground hover:bg-primary hover:bg-opacity-90' : 
         variant === 'secondary' ? 'bg-secondary text-secondary-foreground hover:bg-secondary hover:bg-opacity-90' :
         'bg-muted text-muted-foreground hover:bg-muted hover:bg-opacity-80')"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'muted' = 'primary';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
} 