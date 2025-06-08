export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'team_lead' | 'member';
  avatar: string;
  department: string;
  status: 'active' | 'inactive';
  lastActive: string;
  createdAt: string;
};

export type Team = {
  id: string;
  name: string;
  description: string;
  department: string;
  memberCount: number;
  capacity: number;
  status: 'active' | 'inactive';
  createdAt: string;
  tasks: number;
  completionRate: number;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string | null;
  teamId: string | null;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type Activity = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  timestamp: string;
};

export type Role = {
  id: string;
  name: string;
  permissions: Permission[];
};

export type Permission = {
  id: string;
  name: string;
  description: string;
};

export type DashboardMetrics = {
  totalTeams: number;
  activeUsers: number;
  ongoingTasks: number;
  completionRate: number;
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  teamPerformance: {
    teamId: string;
    teamName: string;
    completionRate: number;
  }[];
};