import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'teams',
        loadComponent: () => import('./teams/teams.component').then(m => m.TeamsComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./tasks/tasks.component').then(m => m.TasksComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./role-component/role-management.component').then(m => m.RoleManagementComponent),
        canActivate: [adminGuard]
      }
    ]
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
