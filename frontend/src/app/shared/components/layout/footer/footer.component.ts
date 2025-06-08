import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="border-t bg-background">
      <div class="container flex h-14 items-center justify-between">
        <p class="text-sm text-muted-foreground">
          {{ copyright }}
        </p>
        <nav class="flex items-center space-x-4">
          <a
            *ngFor="let link of links"
            [href]="link.href"
            class="text-sm text-muted-foreground hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  @Input() copyright = '© 2024 Task Manager. All rights reserved.';
  @Input() links: { label: string; href: string }[] = [];
} 