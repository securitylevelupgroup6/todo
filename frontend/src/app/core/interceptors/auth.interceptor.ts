import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);

  // Clone the request to add withCredentials for cookie-based auth
  const authRequest = request.clone({
    withCredentials: true
  });

  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Clear any persisted user data and redirect to login
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token'); // Legacy cleanup
        localStorage.removeItem('user'); // Legacy cleanup
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};
