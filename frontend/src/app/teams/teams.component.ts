import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../core/services/auth.service';
import { 
  TeamResponse, 
  UserResponse, 
  CreateTeamRequest, 
  AddTeamMemberRequest, 
  TeamExtended 
} from '../shared/models/team.models';
import { catchError, of, forkJoin } from 'rxjs';

interface Team {
  id: string;
  name: string;
  department: string;
  memberCount: number;
  capacity: number;
  tasks: number;
  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  completionRate: number;
  members: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  }[];
}

interface TeamFormData {
  name: string;
  department: string;
  capacity: number;
  teamLeadUserId?: number;
}

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: Team[] = [];
  apiTeams: TeamResponse[] = [];
  availableUsers: UserResponse[] = [];
  searchTerm: string = '';
  departmentFilter: string = 'all';
  departments: string[] = ['all', 'Engineering', 'Design', 'Marketing', 'Product', 'Sales', 'Support'];
  showCreateModal: boolean = false;
  selectedTeam: Team | null = null;
  formData: TeamFormData = {
    name: '',
    department: '',
    capacity: 5
  };
  loading: boolean = false;
  error: string = '';

  constructor(
    private teamService: TeamService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTeams();
    this.loadUsers();
  }

  private loadTeams(): void {
    this.loading = true;
    this.error = '';

    // Load teams from API - only teams the user is part of
    this.userService.getUserTeams()
      .pipe(
        catchError(error => {
          console.error('Error loading user teams:', error);
          this.error = 'Failed to load your teams. Using fallback data.';
          // Return fallback structure
          return of({ teams: [] });
        })
      )
      .subscribe(response => {
        this.apiTeams = response.teams;
        
        if (this.apiTeams.length === 0 && this.error) {
          // Use mock data as fallback only if there was an error
          this.teams = this.getMockTeams();
        } else if (this.apiTeams.length === 0) {
          // No teams for the user, but no error
          this.teams = [];
          this.error = 'You are not part of any teams yet.';
        } else {
          // Convert API teams to component format
          this.teams = this.apiTeams.map(apiTeam => this.mapApiTeamToComponentTeam(apiTeam));
          
          // Load members for each team
          this.loadTeamMembers();
        }
        
        this.loading = false;
      });
  }

  private loadUsers(): void {
    // Load available users for team management
    this.userService.getAllUsers()
      .pipe(
        catchError(error => {
          console.error('Error loading users:', error);
          return of([]);
        })
      )
      .subscribe(users => {
        this.availableUsers = users;
      });
  }

  private loadTeamMembers(): void {
    // Load members for each team
    const memberRequests = this.apiTeams.map(team => 
      this.teamService.getTeamMembers(team.id)
        .pipe(
          catchError(error => {
            console.error(`Error loading members for team ${team.id}:`, error);
            return of([]);
          })
        )
    );

    forkJoin(memberRequests).subscribe(teamMembersArrays => {
      teamMembersArrays.forEach((members, index) => {
        const teamIndex = this.teams.findIndex(t => t.id === this.apiTeams[index].id.toString());
        if (teamIndex !== -1) {
          this.teams[teamIndex].members = members.map(member => ({
            id: member.id.toString(),
            name: `${member.firstName} ${member.lastName}`,
            avatar: 'https://github.com/shadcn.png',
            role: member.roles.includes('TEAMLEAD') ? 'Team Lead' : 'Member'
          }));
          this.teams[teamIndex].memberCount = members.length;
        }
      });
    });
  }

  private mapApiTeamToComponentTeam(apiTeam: TeamResponse): Team {
    return {
      id: apiTeam.id.toString(),
      name: apiTeam.name,
      department: 'Engineering', // Default department since API doesn't provide this
      memberCount: 0, // Will be updated when members are loaded
      capacity: 10, // Default capacity since API doesn't provide this
      tasks: 0, // Default tasks since API doesn't provide this
      status: 'active',
      createdAt: new Date(),
      completionRate: 0,
      members: []
    };
  }

  private getMockTeams(): Team[] {
    return [
      {
        id: '1',
        name: 'Frontend Development',
        department: 'Engineering',
        memberCount: 8,
        capacity: 10,
        tasks: 15,
        status: 'active',
        createdAt: new Date('2024-01-01'),
        completionRate: 85,
        members: [
          { id: '1', name: 'John Doe', avatar: 'https://github.com/shadcn.png', role: 'Team Lead' },
          { id: '2', name: 'Jane Smith', avatar: 'https://github.com/shadcn.png', role: 'Developer' },
          { id: '3', name: 'Mike Johnson', avatar: 'https://github.com/shadcn.png', role: 'Developer' }
        ]
      },
      {
        id: '2',
        name: 'UI/UX Design',
        department: 'Design',
        memberCount: 5,
        capacity: 6,
        tasks: 8,
        status: 'active',
        createdAt: new Date('2024-01-15'),
        completionRate: 92,
        members: [
          { id: '4', name: 'Sarah Wilson', avatar: 'https://github.com/shadcn.png', role: 'Design Lead' },
          { id: '5', name: 'Tom Brown', avatar: 'https://github.com/shadcn.png', role: 'Designer' }
        ]
      }
    ];
  }

  get filteredTeams(): Team[] {
    return this.teams.filter(team => {
      const matchesSearch = team.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          team.department.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesDepartment = this.departmentFilter === 'all' || team.department === this.departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success';
      case 'inactive':
        return 'bg-warning/10 text-warning';
      case 'archived':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  openCreateModal() {
    this.selectedTeam = null;
    this.formData = {
      name: '',
      department: '',
      capacity: 5
    };
    this.showCreateModal = true;
  }

  openEditModal(team: Team) {
    this.selectedTeam = team;
    this.formData = {
      name: team.name,
      department: team.department,
      capacity: team.capacity
    };
    this.showCreateModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
    this.selectedTeam = null;
    this.formData = {
      name: '',
      department: '',
      capacity: 5
    };
  }

  saveTeam(form: NgForm) {
    if (form.valid) {
      this.loading = true;
      this.error = '';

      if (this.selectedTeam) {
        // Update existing team (using mock update for now)
        const index = this.teams.findIndex(t => t.id === this.selectedTeam?.id);
        if (index !== -1) {
          this.teams[index] = {
            ...this.teams[index],
            name: this.formData.name,
            department: this.formData.department,
            capacity: this.formData.capacity
          };
        }
        this.loading = false;
        this.closeModal();
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
              // Add the new team to the local list
              const newTeam: Team = {
                id: createdTeam.id.toString(),
                name: createdTeam.name,
                department: this.formData.department,
                memberCount: 1, // Team lead is automatically a member
                capacity: this.formData.capacity,
                tasks: 0,
                status: 'active',
                createdAt: new Date(),
                completionRate: 0,
                members: []
              };
              
              this.teams.push(newTeam);
              this.closeModal();
            }
            this.loading = false;
          });
      }
    }
  }

  addTeamMember(teamId: number, userId: number) {
    const request: AddTeamMemberRequest = { userId };
    
    this.teamService.addTeamMember(teamId, request)
      .pipe(
        catchError(error => {
          console.error('Error adding team member:', error);
          this.error = 'Failed to add team member. Please try again.';
          return of(null);
        })
      )
      .subscribe(result => {
        if (result) {
          // Reload team members to update the UI
          this.loadTeamMembers();
        }
      });
  }

  removeTeamMember(teamId: number, userId: number) {
    // Note: The backend doesn't seem to have a remove team member endpoint
    // You may need to add this endpoint to the backend
    console.warn('Remove team member functionality not implemented in backend');
  }
}
