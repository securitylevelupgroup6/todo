import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs'; // Ensured map is imported
import { Router } from '@angular/router';
import { User, UserRecord, LoginCredentials } from '../../models/user.model';
import { environment } from '../../../environments/environment';
import { IResponse, observe } from '../../shared/functions/helpers.function';

interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterUser {
  firstName: string;
  lastName: string;
  password: string;
  username: string;
}

export interface AuthRequest {
  requestType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserRecord | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiBaseUrl: string = environment.apiUrl;
  isLoggedIn: boolean = false;

  private requestSubject = new BehaviorSubject<AuthRequest>({requestType: ''});
  public currentAuthType = this.requestSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Load persisted user data from localStorage
    const userRecord = this.getPersistedUser();
    if (userRecord) {
      this.currentUserSubject.next(userRecord);
      this.isLoggedIn = true;
    }
  }

  private getPersistedUser(): UserRecord | null {
    const userJson = localStorage.getItem('currentUser');
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      localStorage.removeItem('currentUser'); // Clear corrupted data
      return null;
    }
  }

  login(credentials: LoginCredentials): Observable<UserRecord> {

    return this.http.post<UserRecord>(`${this.apiBaseUrl}/auth/login`, { ...credentials }, { 
      withCredentials: true // This ensures cookies are sent and received
    }).pipe(
      tap(userRecord => {
        // Backend sets HttpOnly access_token cookie automatically
        // Store user details (not sensitive data) in localStorage
        this.persistUser(userRecord);
        this.currentUserSubject.next(userRecord);
        this.isLoggedIn = true;
      })
    );
  }

  register(userData: RegisterUser): Observable<IResponse<{ otpUri: string }>> {
    return observe(this.http.post<any>(`${this.apiBaseUrl}/auth/register`, userData));
  }

  logout(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/auth/logout`, { 
      withCredentials: true 
    }).pipe(
      tap(() => {
        // Backend clears HttpOnly cookies
        this.clearUser();
        this.currentUserSubject.next(null);
        this.isLoggedIn = false;
        this.router.navigate(['/auth/login']);
      })
    );
  }

  private persistUser(userRecord: UserRecord): void {
    localStorage.setItem('currentUser', JSON.stringify(userRecord));
  }

  private clearUser(): void {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): UserRecord | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn && !!this.getPersistedUser();
  }

  updateAuthRequest(requestType: string) {
    this.requestSubject.next({ requestType: requestType })
  }

  // Add this method to get user roles
  getUserRoles(): Observable<string[]> {
    // This should ideally fetch roles from a secure endpoint or use roles stored during login
    // For now, let's assume roles are part of the UserRecord stored in localStorage
    // Or, if you have an endpoint like /users/roles that returns current user's roles:
    return this.http.get<{ roles: string[] }>(`${this.apiBaseUrl}/users/roles`, { withCredentials: true })
      .pipe(
        map((response: { roles: string[] }) => response.roles || []) // Corrected map usage
      );
  }
}
