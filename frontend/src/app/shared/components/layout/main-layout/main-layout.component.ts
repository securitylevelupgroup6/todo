import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, FooterComponent],
  template: `
    <div class="relative min-h-screen">
      <app-header
        [navItems]="navItems"
        [showSettings]="showSettings"
        [showProfile]="showProfile"
      ></app-header>
      
      <div class="flex">
        <app-sidebar
          [title]="sidebarTitle"
          [items]="sidebarItems"
        ></app-sidebar>
        
        <main class="flex-1 p-6 ml-64">
          <ng-content></ng-content>
        </main>
      </div>
      
      <app-footer
        [copyright]="copyright"
        [links]="footerLinks"
      ></app-footer>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent {
  @Input() navItems: { label: string; route: string }[] = [];
  @Input() showSettings = true;
  @Input() showProfile = true;
  @Input() sidebarTitle = '';
  @Input() sidebarItems: { label: string; route: string; icon?: string }[] = [];
  @Input() copyright = '© 2024 Task Manager. All rights reserved.';
  @Input() footerLinks: { label: string; href: string }[] = [];
} 