export interface DashboardMetrics {
  totalTeams: number;
  activeUsers: number;
  ongoingTasks: number;
  completionRate: number;
  tasksByStatus: Record<string, number>;
  teamPerformance: TeamPerformance[];
}

export interface TeamPerformance {
  team: string;
  performance: number;
}

export interface Activity {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  action: string;
  target: string;
  timestamp: string;
  description: string;
}

export type TodoStatusType = 'pending' | 'in_progress' | 'completed' | 'blocked';

// Database Models
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  twoFactorSecret?: string;
}

export interface Team {
  id: number;
  name: string;
  leadUserId: number;
}

export interface TeamMember {
  id: number;
  userId: number;
  teamId: number;
}

export interface Todo {
  id: number;
  currentStateId: number;
  teamOwnerMemberId: number;
}

export interface TodoState {
  id: number;
  title: string;
  description: string;
  statusId: number;
  assigneeMemberId?: number;
}

export interface TodoStatus {
  id: number;
  statusName: string;
}

export interface TodoHistory {
  id: number;
  todoId: number;
  oldStateId: number;
  updatedStateId: number;
  reporterMemberId: number;
  changeDate: string;
} 