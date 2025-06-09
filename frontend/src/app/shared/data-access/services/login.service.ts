import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRecord } from '../../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isLoggedIn: boolean = false;

  private currentUserSubject = new BehaviorSubject<UserRecord | null>(this.getPersistedUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Initialize login status based on persisted user data
    const user = this.getPersistedUser();
    this.isLoggedIn = !!user;
  }

  public getPersistedUser(): UserRecord | null {
    const userJson = localStorage.getItem('currentUser');
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      localStorage.removeItem('currentUser'); // Clear corrupted data
      return null;
    }
  }

  updateUser(userRecord: UserRecord): void {
    if (userRecord) {
      this.isLoggedIn = true;
      localStorage.setItem('currentUser', JSON.stringify(userRecord));
      this.currentUserSubject.next(userRecord);
    } else {
      this.clearUser();
    }
  }

  clearUser(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): UserRecord | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserValue(): UserRecord | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn && !!this.getPersistedUser();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return roles.some(role => user.roles.includes(role));
  }
}
