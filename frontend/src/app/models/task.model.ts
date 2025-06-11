// User Response DTO matching backend UserResponse.cs
export interface UserResponseDto {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[] | null; // Backend can return null for roles
}

// Frontend Todo Status Enum
export enum FrontendTodoStatus {
  Todo = 'todo',         // Maps to backend "CREATED"
  InProgress = 'in_progress', // Maps to backend "IN_PROGRESS"
  Completed = 'completed'  // Maps to backend "COMPLETED"
}

// Backend Todo Status Names
export type BackendTodoStatusName = "CREATED" | "IN_PROGRESS" | "COMPLETED";

// Todo Response DTO matching backend TodoResponse.cs
export interface TodoResponseDto {
  id: number;
  title: string;
  description: string;
  status: BackendTodoStatusName;
  assignee: UserResponseDto | null;
  owner: UserResponseDto;
}

// Backend Todo Status matching TodoStatus.cs
export interface BackendTodoStatus {
  id: number;
  statusName: BackendTodoStatusName;
}

// Backend Team Member 
export interface BackendTeamMember {
  id: number;
  user?: UserResponseDto;
  teamId?: number;
}

// Backend Team
export interface BackendTeam {
  id: number;
  name?: string;
}

// Backend Todo State matching TodoState.cs
export interface BackendTodoState {
  id: number;
  title: string;
  description: string;
  statusId: number;
  teamId: number;
  assigneeId: number | null;
  status?: BackendTodoStatus;
  team?: BackendTeam;
  assignee?: BackendTeamMember | null;
}

// Backend Todo matching Todo.cs
export interface BackendTodo {
  id: number;
  todoStateId: number;
  ownerId: number;
  todoState?: BackendTodoState;
  owner?: BackendTeamMember;
  team?: {
    id: number;
    name: string;
    teamLeadId: number;
  }
}

// Create Todo Request DTO matching CreateTodoRequest.cs
export interface CreateTodoRequestDto {
  title: string;
  description: string;
  teamId: number;
  ownerUserId: number; // User ID of the assignee
}

// Update Todo Request DTO matching UpdateTodoRequest.cs
export interface UpdateTodoRequestDto {
  todoId: number;
  title?: string;
  description?: string;
  status?: BackendTodoStatusName;
  assigneeId?: number; // User ID of the new assignee
  teamId?: number;
}

// Status mapping utilities
export const StatusMapping = {
  frontendToBackend: (status: FrontendTodoStatus): BackendTodoStatusName => {
    switch (status) {
      case FrontendTodoStatus.Todo:
        return "CREATED";
      case FrontendTodoStatus.InProgress:
        return "IN_PROGRESS";
      case FrontendTodoStatus.Completed:
        return "COMPLETED";
      default:
        return "CREATED";
    }
  },
  
  backendToFrontend: (statusName: BackendTodoStatusName): FrontendTodoStatus => {
    switch (statusName) {
      case "CREATED":
        return FrontendTodoStatus.Todo;
      case "IN_PROGRESS":
        return FrontendTodoStatus.InProgress;
      case "COMPLETED":
        return FrontendTodoStatus.Completed;
      default:
        return FrontendTodoStatus.Todo;
    }
  }
};