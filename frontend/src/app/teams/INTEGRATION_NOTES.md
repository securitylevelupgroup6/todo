# Teams Component Integration with Backend API

## Overview
This document outlines the integration between the frontend Teams component and the backend Team API endpoints.

## Implemented Features

### ✅ Completed Integrations
1. **Create Team** - `POST /teams`
   - Uses `CreateTeamRequest` with name and teamLeadUserId
   - Automatically adds team lead as team member
   - Authorization: Requires TEAMLEAD role

2. **Add Team Member** - `POST /teams/{teamId}/members`
   - Uses `AddTeamMemberRequest` with userId
   - Authorization: Requires TEAMLEAD role

3. **Get Team Members** - `GET /teams/{teamId}/members`
   - Returns array of `UserResponse` objects
   - Authorization: Requires USER or TEAMLEAD role

4. **Get User Teams** - `GET /users/teams`
   - Returns object with `{ teams: TeamResponse[] }`
   - Shows only teams the authenticated user is part of
   - Authorization: Requires USER role
   - Uses JWT from cookies for authentication

### 📝 TypeScript Models Created
- `TeamResponse` - Matches backend Team model
- `UserResponse` - Matches backend UserResponse model
- `CreateTeamRequest` - For team creation
- `AddTeamMemberRequest` - For adding team members
- `TeamMemberResponse` - For team member operations
- `TeamExtended` - Extended interface for UI needs

### 🔧 Services Created
- `TeamService` - Handles all team-related API calls
- `UserService` - Handles user-related API calls (extended for team management)

## Missing Backend Endpoints

### ❌ Required Endpoints Not Available
1. **Get All Teams** - `GET /teams`
   - Currently assumed but not implemented in backend
   - **UPDATE**: Now using `GET /users/teams` to get teams user is part of
   - This provides a more user-centric view of teams

2. **Update Team** - `PUT /teams/{teamId}`
   - Needed for editing team details
   - Should accept partial team updates

3. **Delete Team** - `DELETE /teams/{teamId}`
   - Needed for team management
   - Should handle cleanup of team members

4. **Remove Team Member** - `DELETE /teams/{teamId}/members/{userId}`
   - Needed to remove users from teams
   - Authorization: Should require TEAMLEAD role

5. **Get All Users** - `GET /users`
   - Needed for team member selection
   - Should return list of available users

## Fallback Behavior

### Mock Data
- Component falls back to mock data if API calls fail
- Error handling displays user-friendly messages
- Graceful degradation ensures UI remains functional

### Error Handling
- All API calls wrapped with error handling
- Console logging for debugging
- User feedback through error messages

## Usage Notes

### Authentication
- All API calls require JWT authentication
- Token handled by `AuthInterceptor`
- Current user obtained from `AuthService`

### Authorization Requirements
- Team creation: TEAMLEAD role
- Adding members: TEAMLEAD role
- Viewing teams: USER or TEAMLEAD role

### Frontend-Only Features
Some UI features are maintained in frontend only:
- Department classification
- Team capacity limits
- Task counts
- Completion rates
- Team status (active/inactive/archived)

## Recommendations for Backend

1. **Add missing CRUD endpoints** for complete team management
2. **Implement team filtering** by user permissions
3. **Add department field** to Team model for better organization
4. **Add capacity and status fields** for enhanced team management
5. **Consider pagination** for large team lists
6. **Add team statistics endpoints** for dashboard integration

## Future Enhancements

1. **Real-time updates** using SignalR for team changes
2. **Team avatars** and custom branding
3. **Team templates** for quick setup
4. **Advanced permissions** for granular access control
5. **Team analytics** and performance metrics
