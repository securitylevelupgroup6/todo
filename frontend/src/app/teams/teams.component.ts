import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../core/services/auth.service';
import { TaskService } from '../services/task.service';
import { 
  TeamResponse, 
  UserResponse, 
  CreateTeamRequest, 
  AddTeamMemberRequest, 
  TeamExtended 
} from '../shared/models/team.models';
import { TodoResponseDto } from '../models/task.model';
import { catchError, of, forkJoin } from 'rxjs';

interface TeamDisplayData {
  id: string;
  name: string;
  memberCount: number;
  createdAt: Date;
  completionRate?: number;
  taskCount?: number;
  activeTasks?: number;
  status?: 'active' | 'inactive' | 'archived';
  teamLead?: UserResponse;
  members: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    user: UserResponse;
  }[];
  todos?: TodoResponseDto[];
}

interface TeamFormData {
  name: string;
  teamLeadUserId?: number;
}

interface AddMemberFormData {
  userId?: number;
  username?: string;
  addBy: 'userId' | 'username';
}

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: TeamDisplayData[] = [];
  searchTerm: string = '';
  showCreateModal: boolean = false;
  showDetailsModal: boolean = false;
  showAddMemberModal: boolean = false;
  selectedTeam: TeamDisplayData | null = null;
  formData: TeamFormData = { name: '' };
  addMemberFormData: AddMemberFormData = { addBy: 'username' };
  loading: boolean = false;
  error: string = '';
  teamStats: { [teamId: string]: any } = {};

  constructor(
    private teamService: TeamService,
    private userService: UserService,
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.loadTeamsWithFullDetails();
  }

  private loadTeamsWithFullDetails(): void {
    this.loading = true;
    this.error = '';

    // Use the enhanced team service to get teams with complete details
    this.teamService.getTeamsWithDetails()
      .pipe(
        catchError(error => {
          console.error('Error loading teams with details:', error);
          this.error = 'Failed to load your teams. Please try again.';
          return of([]);
        })
      )
      .subscribe(teamsWithDetails => {
        if (teamsWithDetails.length === 0 && !this.error) {
          this.teams = [];
          this.error = 'You are not part of any teams yet.';
        } else {
          // Convert TeamExtended to TeamDisplayData
          this.teams = teamsWithDetails.map(team => this.mapExtendedTeamToDisplayData(team));
          
          // Load additional statistics for each team
          this.loadTeamStatistics();
        }
        this.loading = false;
      });
  }

  private mapExtendedTeamToDisplayData(extendedTeam: TeamExtended): TeamDisplayData {
    return {
      id: extendedTeam.id.toString(),
      name: extendedTeam.name,
      memberCount: extendedTeam.memberCount,
      createdAt: extendedTeam.createdAt || new Date(),
      completionRate: extendedTeam.completionRate,
      taskCount: extendedTeam.tasks,
      status: extendedTeam.status,
      teamLead: extendedTeam.teamLead,
      members: extendedTeam.members.map(member => {
        // Check if this member is the team lead by comparing IDs
        const isTeamLead = extendedTeam.teamLead && extendedTeam.teamLead.id === member.id;
        return {
          id: member.id.toString(),
          name: `${member.firstName} ${member.lastName}`,
          avatar: 'https://github.com/shadcn.png',
          role: isTeamLead ? 'Team Lead' : 'Member',
          user: member
        };
      })
    };
  }

  private loadTeamStatistics(): void {
    // Load detailed statistics for each team
    const statsRequests = this.teams.map(team => 
      this.teamService.getTeamStats(parseInt(team.id))
        .pipe(
          catchError(error => {
            console.error(`Error loading stats for team ${team.id}:`, error);
            return of({
              memberCount: 0,
              totalTodos: 0,
              completedTodos: 0,
              completionRate: 0,
              activeTodos: 0
            });
          })
        )
    );

    forkJoin(statsRequests).subscribe(statsArray => {
      statsArray.forEach((stats, index) => {
        const teamId = this.teams[index].id;
        this.teamStats[teamId] = stats;
        
        // Update team display data with fresh stats
        this.teams[index].taskCount = stats.totalTodos;
        this.teams[index].activeTasks = stats.activeTodos;
        this.teams[index].completionRate = stats.completionRate;
        this.teams[index].memberCount = stats.memberCount;
      });
    });
  }

  get filteredTeams(): TeamDisplayData[] {
    return this.teams.filter(team => {
      return team.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  getStatusColor(status: string | undefined): string {
    // Handle team status colors
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      // Handle todo status colors
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'created':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getCompletionRateDisplay(rate?: number): string {
    if (rate === undefined || rate === null) return '0%';
    return `${Math.round(rate)}%`;
  }

  // Modal Management
  openCreateModal() {
    this.selectedTeam = null;
    this.formData = { name: '' };
    this.showCreateModal = true;
  }

  openEditModal(team: TeamDisplayData) {
    this.selectedTeam = team;
    this.formData = { name: team.name };
    this.showCreateModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
    this.selectedTeam = null;
    this.formData = { name: '' };
  }

  openDetailsModal(team: TeamDisplayData) {
    this.selectedTeam = team;
    // Load team todos for the details modal
    this.loadTeamTodos(parseInt(team.id));
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedTeam = null;
  }

  openAddMemberModal(team: TeamDisplayData) {
    this.selectedTeam = team;
    this.addMemberFormData = { addBy: 'username' };
    this.showAddMemberModal = true;
  }

  closeAddMemberModal() {
    this.showAddMemberModal = false;
    this.selectedTeam = null;
    this.addMemberFormData = { addBy: 'username' };
  }

  // Team Operations
  saveTeam(form: NgForm) {
    if (form.valid) {
      this.loading = true;
      this.error = '';

      if (this.selectedTeam) {
        // Update existing team (Note: Backend doesn't have update endpoint)
        this.error = 'Team editing is not yet supported by the backend.';
        this.loading = false;
        return;
      } else {
        // Create new team via API
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          this.error = 'User not authenticated';
          this.loading = false;
          return;
        }

        const createRequest: CreateTeamRequest = {
          name: this.formData.name,
          teamLeadUserId: this.formData.teamLeadUserId || currentUser.id || 1
        };

        this.teamService.createTeam(createRequest)
          .pipe(
            catchError(error => {
              console.error('Error creating team:', error);
              this.error = 'Failed to create team. Please try again.';
              this.loading = false;
              return of(null);
            })
          )
          .subscribe(createdTeam => {
            if (createdTeam) {
              this.closeModal();
              // Reload all teams to get the updated data
              this.loadTeamsWithFullDetails();
            }
            this.loading = false;
          });
      }
    }
  }

  addTeamMember(form: NgForm) {
    if (form.valid && this.selectedTeam) {
      this.loading = true;
      this.error = '';

      // Build request based on addBy selection
      const request: AddTeamMemberRequest = {};
      if (this.addMemberFormData.addBy === 'userId' && this.addMemberFormData.userId) {
        request.userId = this.addMemberFormData.userId;
      } else if (this.addMemberFormData.addBy === 'username' && this.addMemberFormData.username) {
        request.username = this.addMemberFormData.username;
      } else {
        this.error = 'Please provide either a User ID or Username.';
        this.loading = false;
        return;
      }
      
      this.teamService.addTeamMember(parseInt(this.selectedTeam.id), request)
        .pipe(
          catchError(error => {
            console.error('Error adding team member:', error);
            this.error = 'Failed to add team member. Please try again.';
            this.loading = false;
            return of(null);
          })
        )
        .subscribe(result => {
          if (result) {
            this.closeAddMemberModal();
            // Reload teams to update member counts and data
            this.loadTeamsWithFullDetails();
          }
          this.loading = false;
        });
    }
  }

  removeTeamMember(teamId: number, userId: number) {
    // Note: The backend doesn't have a remove team member endpoint
    this.error = 'Remove team member functionality is not yet implemented in the backend.';
    console.warn('Remove team member functionality not implemented in backend');
  }

  private loadTeamTodos(teamId: number): void {
    if (!this.selectedTeam) return;

    this.teamService.getTeamTodos(teamId)
      .pipe(
        catchError(error => {
          console.error(`Error loading todos for team ${teamId}:`, error);
          return of([]);
        })
      )
      .subscribe(todos => {
        if (this.selectedTeam) {
          this.selectedTeam.todos = todos;
        }
      });
  }

  // Todo Management within Teams
  createTodoForTeam(teamId: number): void {
    // This could navigate to a todo creation page with team context
    console.log('Create todo for team:', teamId);
    // Implementation would depend on your todo creation flow
  }

  viewTeamTodos(teamId: number): void {
    // This could navigate to a filtered todo view for the team
    console.log('View todos for team:', teamId);
    // Implementation would navigate to tasks page with team filter
  }

  // User Role Checks
  canEditTeam(team: TeamDisplayData): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;
    
    // Check if user is team lead or has admin role
    return team.teamLead?.id === currentUser.id || 
           (currentUser.roles || []).includes('ADMIN') ||
           (currentUser.roles || []).includes('TEAM_LEAD');
  }

  canAddMembers(team: TeamDisplayData): boolean {
    return this.canEditTeam(team);
  }

  canRemoveMembers(team: TeamDisplayData): boolean {
    return this.canEditTeam(team);
  }

  // Utility Methods
  getMemberRoleColor(role: string): string {
    switch (role.toLowerCase()) {
      case 'team lead':
      case 'teamlead':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }

  getTeamStatusText(status?: string): string {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'archived':
        return 'Archived';
      default:
        return 'Active';
    }
  }

  refreshTeamData(): void {
    this.loadTeamsWithFullDetails();
  }

  // Utility function for template
  parseInt(value: string): number {
    return parseInt(value, 10);
  }
}
