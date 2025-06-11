import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Assuming AuthService has role info
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export const adminGuard: CanActivateFn = (): Observable<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthService); // Use your actual AuthService

  // Check if user is authenticated first
  if (!authService.isAuthenticated()) { // Assuming an isAuthenticated method
    router.navigate(['/auth/login']);
    return of(false);
  }

  // Check if user has ADMIN role
  // This depends on how roles are stored and accessed in your AuthService
  return authService.getUserRoles().pipe( // Assuming getUserRoles() returns Observable<string[]>
    map(roles => {
      if (roles.includes('ADMIN')) {
        return true;
      } else {
        router.navigate(['/']); // Or a 'forbidden' page
        return false;
      }
    })
  );
};
