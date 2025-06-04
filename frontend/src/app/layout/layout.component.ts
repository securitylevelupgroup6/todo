import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  template: `
    <body class="min-h-screen bg-background">
      <app-sidebar [sidebarOpen]="sidebarOpen" (sidebarOpenChange)="sidebarOpen = $event"></app-sidebar>
      
      <section class="lg:pl-72 transition-all duration-300">
        <app-header (sidebarOpenChange)="sidebarOpen = $event"></app-header>
        <main class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <router-outlet></router-outlet>
        </main>
      </section>
    </body>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class LayoutComponent {
  sidebarOpen = false;
} 