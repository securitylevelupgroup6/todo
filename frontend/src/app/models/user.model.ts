export interface User {
  id?: number;
  userName: string;
  password: string;
  otp: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for user data that can be safely stored in localStorage
export interface UserRecord {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

// Interface for login credentials (temporary, not stored)
export interface LoginCredentials {
  userName: string;
  password: string;
  otp: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER'
}
