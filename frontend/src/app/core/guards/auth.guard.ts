import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../../shared/data-access/services/login.service';

export const authGuard = () => {
  const router = inject(Router);
  const userService = inject(UserService);

  if (userService.isAuthenticated()) {
    return true;
  }
  router.navigate(['/auth/login']);
  return false;
}; 