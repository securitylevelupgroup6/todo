import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, UserRole } from '../../models/user.model';
import { environment } from '../../../environments/environment';
import { FormGroup } from '@angular/forms';
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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiBaseUrl: string = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(userInfo: { userName: string; password: string, otp: string }): Observable<IResponse<any>> {
    return observe(this.http.post<any>(`${this.apiBaseUrl}/auth/login`, userInfo));
  }

  register(userData: RegisterUser): Observable<IResponse<{ otpUri: string }>> {
    return observe(this.http.post<any>(`${this.apiBaseUrl}/auth/register`, userData));
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


} 