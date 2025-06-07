export interface User {
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

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER'
} 