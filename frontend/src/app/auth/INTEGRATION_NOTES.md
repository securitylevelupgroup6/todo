# Multifactor Authentication Integration Notes

## Overview
This document outlines the integration of multifactor authentication (MFA) with the login flow and the implementation of persistent cookie-based authentication to align with the backend's HttpOnly cookie strategy.

## Backend Authentication Strategy
The backend (`backend/TODO-API/`) uses:
- JWT tokens stored in HttpOnly cookies (`access_token` and `refresh_token`)
- Cookie-based authentication instead of Bearer tokens
- MFA required for all login attempts (username + password + OTP)

## Frontend Changes Made

### 1. User Models (`frontend/src/app/models/user.model.ts`)
- Added `UserRecord` interface for safe localStorage persistence
- Added `LoginCredentials` interface for login flow
- Separated sensitive data (password, OTP) from persistent data

### 2. Auth Service (`frontend/src/app/core/services/auth.service.ts`)
- Updated to use `withCredentials: true` for cookie-based authentication
- Maps frontend credentials to backend API format (`Username`, `Password`, `Otp`)
- Handles user data persistence in localStorage (UserRecord only)
- Removed Bearer token logic in favor of HttpOnly cookies

### 3. Auth Interceptor (`frontend/src/app/core/interceptors/auth.interceptor.ts`)
- Changed from Bearer token to `withCredentials: true`
- Handles 401 errors by clearing localStorage and redirecting to login

### 4. User Service (`frontend/src/app/shared/data-access/services/login.service.ts`)
- Updated to work with `UserRecord` instead of sensitive `User` data
- Added role-based helper methods (`hasRole`, `hasAnyRole`)
- Manages localStorage persistence of user details

### 5. MFA Component (`frontend/src/app/auth/multifactor-authentication/multifactor-authentication.component.ts`)
- Enhanced error handling with specific error messages
- Added loading states and form validation
- Uses new `LoginCredentials` interface
- Properly integrates with AuthService and UserService

### 6. MFA Template (`frontend/src/app/auth/multifactor-authentication/multifactor-authentication.component.html`)
- Added error message display
- Enhanced submit button with loading state
- Better UX with disabled states

## Authentication Flow

### Login Process:
1. User enters username/password in `LoginComponent`
2. Form validation passes, `loginRequest` is set to `true`
3. UI switches to `MultifactorAuthenticationComponent`
4. User enters OTP
5. MFA component calls `AuthService.login()` with complete credentials
6. Backend validates and sets HttpOnly cookies (`access_token`, `refresh_token`)
7. Frontend receives `UserRecord` and stores in localStorage
8. User is redirected to dashboard

### Logout Process:
1. `AuthService.logout()` calls backend `/auth/logout`
2. Backend clears HttpOnly cookies
3. Frontend clears localStorage
4. User is redirected to login page

### Session Persistence:
- HttpOnly cookies persist across browser sessions (85 days expiry)
- User details in localStorage allow UI to show user info
- `isAuthenticated()` checks both localStorage and login state

## Security Considerations
- Sensitive data (passwords, OTPs) are never stored in localStorage
- HttpOnly cookies prevent XSS attacks on tokens
- CORS configured with `withCredentials: true`
- User roles stored for frontend authorization checks

## API Mapping
Frontend → Backend:
```typescript
{
  userName: string,     → Username: string,
  password: string,     → Password: string,
  otp: string          → Otp: string
}
```

Backend Response:
```typescript
{
  id: number,
  userName: string,
  firstName: string,
  lastName: string,
  roles: string[]
}
```

## Testing Checklist
- [ ] Login with valid credentials shows MFA screen
- [ ] Invalid OTP shows appropriate error message
- [ ] Successful login persists across browser refresh
- [ ] Logout clears all authentication data
- [ ] 401 responses redirect to login page
- [ ] Roles are properly stored and accessible
- [ ] Network requests include credentials automatically

## Future Enhancements
- Add refresh token logic for automatic token renewal
- Implement remember me functionality
- Add session timeout warnings
- Enhanced MFA setup flow for new users
