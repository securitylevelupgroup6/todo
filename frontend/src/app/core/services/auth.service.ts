import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, UserRole } from '../../models/user.model';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiBaseUrl: string = 'https://todo.pastpaperportal.co.za/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // For demo purposes, simulate successful login
    const mockUser: User = {
      id: '1',
      email: email,
      firstName: 'Demo',
      lastName: 'User',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const mockResponse: AuthResponse = {
      user: mockUser,
      token: 'mock-token'
    };

    return of(mockResponse).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(userData: Partial<User>): Observable<AuthResponse> {
    // For demo purposes, simulate successful registration
    const mockUser: User = {
      id: '1',
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const mockResponse: AuthResponse = {
      user: mockUser,
      token: 'mock-token'
    };

    return of(mockResponse).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getLoginInfo(): Observable<any> {
    return this.http.get<Observable<any>>(this.apiBaseUrl);
  }
} 