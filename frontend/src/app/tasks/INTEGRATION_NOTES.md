# Tasks Component Backend Integration

## Overview
Successfully integrated the `TasksComponent` with the backend `TodoEndpoints` API. This replaces the mock data implementation with live API calls.

## Changes Made

### 1. Created Task Models (`frontend/src/app/models/task.model.ts`)

**New Interfaces:**
- `UserResponseDto` - Maps to backend `UserResponse.cs`
- `TodoResponseDto` - Maps to backend `TodoResponse.cs`
- `BackendTodo` - Maps to backend `Todo.cs` with nested `TodoState`
- `CreateTodoRequestDto` - Maps to backend `CreateTodoRequest.cs`
- `UpdateTodoRequestDto` - Maps to backend `UpdateTodoRequest.cs`
- `FrontendTodoStatus` - Enum for frontend status handling

**Status Mapping:**
- Frontend 'todo' ↔ Backend "CREATED"
- Frontend 'in_progress' ↔ Backend "IN_PROGRESS"
- Frontend 'completed' ↔ Backend "COMPLETED"
- Removed 'review' status (not supported by backend)

### 2. Created Task Service (`frontend/src/app/services/task.service.ts`)

**API Methods:**
- `getTasks()` - GET /todo (returns BackendTodo[])
- `getTeamTasks(teamId)` - GET /todo/team/{teamId} (returns TodoResponseDto[])
- `createTask(data)` - POST /todo (returns BackendTodo)
- `updateTask(data)` - PUT /todo/{todoId} (returns TodoResponseDto)

**Notes:**
- `getTeamTasks()` uses `http.request()` to send body with GET request (backend requirement)
- No delete endpoint available in backend

### 3. Updated TasksComponent (`frontend/src/app/tasks/tasks.component.ts`)

**Major Changes:**
- **Removed Fields:** `priority`, `dueDate`, `createdAt`, `updatedAt` (not in backend model)
- **Updated Task Interface:** 
  - `id`: string → number
  - `status`: string literals → FrontendTodoStatus enum
  - `assignedTo`: custom object → UserResponseDto
  - `team`: custom object → {id: number, name: string}
- **Added Loading States:** `isLoading`, `errorMessage`
- **Mapping Functions:** 
  - `mapBackendTodoToTask()` - For GET /todo responses
  - `mapTodoResponseToTask()` - For PUT responses and team tasks
- **API Integration:**
  - `loadTasks()` - Fetches user tasks on init
  - `createTask()` - Creates new task via API
  - `updateTask()` - Updates existing task via API
  - `deleteTask()` - Local removal only (no backend endpoint)

### 4. Updated Template (`frontend/src/app/tasks/tasks.component.html`)

**Changes:**
- **Removed:** Priority filter dropdown, due date display, priority badges
- **Added:** Loading spinner, error messages, loading states for buttons
- **Updated:** 
  - Status handling to use enum values
  - User display to show initials instead of avatars
  - Form validation and error handling
  - Status dropdown to only show available backend statuses

## Backend API Integration Details

### Authentication
- All endpoints require JWT authentication via HttpOnly cookies
- Uses `withCredentials: true` through auth interceptor

### Data Flow

#### Create Task:
1. User fills form → `CreateTodoRequestDto`
2. POST /todo → Backend creates `Todo` with `TodoState`
3. Returns `BackendTodo` → Mapped to frontend `Task`
4. Added to tasks array

#### Update Task:
1. User edits task → `UpdateTodoRequestDto`
2. PUT /todo/{id} → Backend updates `TodoState`
3. Returns `TodoResponseDto` → Mapped to frontend `Task`
4. Updates tasks array

#### Load Tasks:
1. Component init → GET /todo
2. Returns `BackendTodo[]` with nested data
3. Maps to frontend `Task[]` for display

### Mock Data
- **Teams:** Still using mock data (IDs 1, 2, 3)
- **Users:** Using mock data matching backend UserResponse structure
- In production, these would come from dedicated team/user endpoints

## Backend Model Mapping

### Todo Structure (Backend):
```
Todo {
  id: number
  todoStateId: number
  ownerId: number (TeamMember ID)
  todoState: {
    id: number
    title: string
    description: string
    statusId: number
    teamId: number
    assigneeId: number (TeamMember ID)
    status: { id, statusName }
    team: { id, name }
    assignee: { id, user: { id, username, firstName, lastName } }
  }
  owner: { id, user: { ... } }
}
```

### TodoResponse Structure (Backend):
```
TodoResponse {
  id: number
  title: string
  description: string
  status: string ("CREATED", "IN_PROGRESS", "COMPLETED")
  assignee: UserResponse | null
  owner: UserResponse
}
```

## Known Issues & Limitations

1. **Team Tasks Endpoint:** 
   - Backend GET /todo/team/{teamId} expects a body parameter
   - Frontend uses `http.request()` workaround
   - May need backend fix for proper REST compliance

2. **No Delete Functionality:**
   - Backend doesn't provide DELETE /todo/{id} endpoint
   - Frontend shows delete button but only removes locally

3. **Team Information Missing:**
   - TodoResponse doesn't include team details
   - Frontend relies on form data or mock teams for team names

4. **User/Team Data:**
   - Currently using mock data
   - Production needs dedicated endpoints for users/teams

## Testing Checklist

- [ ] Login and navigate to Tasks page
- [ ] Verify tasks load from backend
- [ ] Test create new task
- [ ] Test edit existing task  
- [ ] Test status filter
- [ ] Test search functionality
- [ ] Verify error handling for API failures
- [ ] Test loading states

## Future Enhancements

1. **Add User/Team Services:**
   - Fetch real user data from backend
   - Fetch team data from backend
   - Replace mock data

2. **Add Delete Endpoint:**
   - Backend: Add DELETE /todo/{id}
   - Frontend: Implement actual delete API call

3. **Add Pagination:**
   - For large task lists
   - Backend support needed

4. **Add Real-time Updates:**
   - WebSocket or polling for task status changes
   - Team collaboration features

## Error Handling

- Network errors show user-friendly messages
- Loading states prevent multiple submissions
- Form validation ensures required fields
- Retry functionality for failed API calls
- Modal error display for create/update operations

## Security Considerations

- All API calls authenticated via HttpOnly cookies
- CORS properly configured for cross-origin requests
- No sensitive data stored in localStorage
- User roles respected (backend validates permissions)
