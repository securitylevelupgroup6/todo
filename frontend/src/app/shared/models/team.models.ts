export interface TeamResponse {
  id: number;
  name: string;
  teamLeadId: number;
  teamLead: UserResponse;
}

export interface UserResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface CreateTeamRequest {
  name: string;
  teamLeadUserId: number;
}

export interface AddTeamMemberRequest {
  userId: number;
}

export interface TeamMemberResponse {
  id: number;
  userId: number;
  teamId: number;
  user: UserResponse;
  team: TeamResponse;
}

// Extended team interface for the component
export interface TeamExtended extends TeamResponse {
  department?: string;
  memberCount: number;
  capacity?: number;
  tasks?: number;
  status?: 'active' | 'inactive' | 'archived';
  createdAt?: Date;
  completionRate?: number;
  members: UserResponse[];
}
