import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserService } from '../shared/data-access/services/login.service';
import { UserRecord } from '../models/user.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    HeaderComponent, 
    SidebarComponent, 
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  sidebarOpen = false;
  user: UserRecord | null = null;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userService.currentUser$.subscribe((user: UserRecord | null) => {
      this.user = user;
    });
  }
}
