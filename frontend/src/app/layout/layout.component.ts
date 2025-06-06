import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../shared/data-access/services/login.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, LoginComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  sidebarOpen = false;
  user: any;

  constructor(
    private userService: UserService 
  ) {}
  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      if(user) {
        this.user = user;
      } else {
        this.user = null;
      }
    })
  }
} 