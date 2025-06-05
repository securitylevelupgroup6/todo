import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  role: string;
  department: string;
  joinDate: Date;
}

interface NotificationSettings {
  emailNotifications: boolean;
  browserNotifications: boolean;
  weeklySummary: boolean;
  taskUpdates: boolean;
  teamUpdates: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: Date;
  activeSessions: number;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  activeTab: string = 'profile';
  profile: UserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Full-stack developer with a passion for creating beautiful and functional applications.',
    avatar: 'https://github.com/shadcn.png',
    role: 'Senior Developer',
    department: 'Engineering',
    joinDate: new Date('2023-01-15')
  };

  notificationSettings: NotificationSettings = {
    emailNotifications: true,
    browserNotifications: true,
    weeklySummary: true,
    taskUpdates: true,
    teamUpdates: true
  };

  securitySettings: SecuritySettings = {
    twoFactorEnabled: false,
    lastPasswordChange: new Date('2023-12-01'),
    activeSessions: 2
  };

  tabs = [
    { id: 'profile', label: 'Profile', icon: 'user' },
    { id: 'security', label: 'Security', icon: 'lock' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'billing', label: 'Billing', icon: 'credit-card' }
  ];

  constructor() {}

  ngOnInit() {}

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  updateProfile(form: any) {
    if (form.valid) {
      // TODO: Implement profile update logic
      console.log('Profile updated:', this.profile);
    }
  }

  updateNotifications() {
    // TODO: Implement notification settings update logic
    console.log('Notification settings updated:', this.notificationSettings);
  }

  updateSecurity() {
    // TODO: Implement security settings update logic
    console.log('Security settings updated:', this.securitySettings);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  getTabIcon(icon: string): string {
    switch (icon) {
      case 'user':
        return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z';
      case 'lock':
        return 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z';
      case 'bell':
        return 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9';
      case 'credit-card':
        return 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z';
      default:
        return '';
    }
  }
} 