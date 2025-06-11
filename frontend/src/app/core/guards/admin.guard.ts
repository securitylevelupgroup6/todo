import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Assuming AuthService has role info
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

export const adminGuard: CanActivateFn = (): Observable<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthService); 

  // Check if user is authenticated first
  if (!authService.isAuthenticated()) { 
    router.navigate(['/auth/login']);
    return of(false);
  }

  return authService.getUserRoles().pipe( 
    map(roles => {
      if (roles.includes('ADMIN')) {
        return true;
      } else {
        router.navigate(['/']); 
        return false;
      }
    })
  );
};
