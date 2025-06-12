import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../core/services/auth.service';
import { 
  BackendTodo, 
  TodoResponseDto, 
  CreateTodoRequestDto, 
  UpdateTodoRequestDto,
  FrontendTodoStatus,
  StatusMapping,
  UserResponseDto
} from '../models/task.model';
import { TeamResponse, UserResponse } from '../shared/models/team.models';
import { catchError, of, forkJoin } from 'rxjs';
import { UserRecord } from '../models/user.model';

interface Task {
  id: number;
  title: string;
  description: string;
  status: FrontendTodoStatus;
  assignedTo: UserResponseDto | null;
  team: {
    id: number;
    name: string;
  };
  owner?: UserResponseDto;
}

interface TaskFormData {
  title: string;
  description: string;
  status: FrontendTodoStatus;
  assignedTo: string | null; // User ID as string for form binding
  team: string; // Team ID as string for form binding
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  showCreateModal: boolean = false;
  selectedTask: Task | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  // Frontend Todo Status enum for use in template
  FrontendTodoStatus = FrontendTodoStatus;
  
  statuses: string[] = ['all', 'todo', 'in_progress', 'completed'];
  
  // Dynamic teams data from backend
  teams: TeamResponse[] = [];
  
  // Dynamic users data from backend (team members)
  users: UserResponse[] = [];
  
  // Available assignees for the selected team
  availableAssignees: UserResponse[] = [];
  
  // Current user's teams
  currentUserTeams: TeamResponse[] = [];
  
  // Current user
  user!: UserRecord | null;

  formData: TaskFormData = {
    title: '',
    description: '',
    status: FrontendTodoStatus.Todo,
    assignedTo: null,
    team: ''
  };

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadInitialData();
    this.user = this.authService.getCurrentUser();
  }

  loadInitialData() {
    this.isLoading = true;
    this.errorMessage = '';

    // Load teams and tasks in parallel
    forkJoin({
      teams: this.taskService.getUserTeams(),
      tasks: this.taskService.getTasks(this.user)
    }).pipe(
      catchError(error => {
        console.error('Error loading initial data:', error);
        this.errorMessage = 'Failed to load data. Please try again.';
        return of({ teams: [], tasks: [] });
      })
    ).subscribe(({ teams, tasks }) => {
      this.currentUserTeams = teams;
      this.teams = teams;
      this.tasks = tasks.map(todo => this.mapBackendTodoToTask(todo));
      
      // Load team members for all teams
      this.loadTeamMembers();
      
      this.isLoading = false;
    });
  }

  private loadTeamMembers() {
    if (this.teams.length === 0) return;

    const memberRequests = this.teams.map(team =>
      this.taskService.getTeamMembers(team.id).pipe(
        catchError(() => of([]))
      )
    );

    forkJoin(memberRequests).subscribe(teamMembersArrays => {
      // Combine all team members into a single unique users list
      const allUsers: UserResponse[] = [];
      teamMembersArrays.forEach(members => {
        members.forEach(member => {
          if (!allUsers.find(u => u.id === member.id)) {
            allUsers.push(member);
          }
        });
      });
      this.users = allUsers;
    });
  }

  loadTasks() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.taskService.getTasks(this.user).subscribe({
      next: (backendTodos: BackendTodo[]) => {
        this.tasks = backendTodos.map(todo => this.mapBackendTodoToTask(todo));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.errorMessage = 'Failed to load tasks. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private mapBackendTodoToTask(backendTodo: BackendTodo): Task {
    const assignedTo = backendTodo.todoState?.assignee?.user || null;
    const team = {
      id: backendTodo.todoState?.team?.id || 0,
      name: backendTodo.todoState?.team?.name || 'Unknown Team'
    };
    const status = backendTodo.todoState?.status?.statusName 
      ? StatusMapping.backendToFrontend(backendTodo.todoState.status.statusName)
      : FrontendTodoStatus.Todo;

    return {
      id: backendTodo.id,
      title: backendTodo.todoState?.title || '',
      description: backendTodo.todoState?.description || '',
      status: status,
      assignedTo: assignedTo,
      team: team,
      owner: backendTodo.owner?.user
    };
  }

  private mapTodoResponseToTask(todoResponse: TodoResponseDto, teamId?: number): Task {
    const team = teamId 
      ? this.teams.find(t => t.id === teamId) || { id: teamId, name: 'Unknown Team' }
      : { id: 0, name: 'Unknown Team' };
    
    const status = StatusMapping.backendToFrontend(todoResponse.status);

    return {
      id: todoResponse.id,
      title: todoResponse.title,
      description: todoResponse.description,
      status: status,
      assignedTo: todoResponse.assignee,
      team: team,
      owner: todoResponse.owner
    };
  }

  // Helper methods for template expressions
  formatStatus(status: string): string {
    if (status === 'all') return 'All Statuses';
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  getTaskCount(status: string): number {
    return this.tasks.filter(t => t.status === status).length;
  }

  get filteredTasks(): Task[] {
    return this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || task.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'todo':
        return 'bg-muted text-muted-foreground';
      case 'in_progress':
        return 'text-primary';
      case 'completed':
        return 'bg-success/10 text-success';
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

  getUserDisplayName(user: UserResponseDto): string {
    return `${user.firstName} ${user.lastName}`;
  }

  openCreateModal() {
    this.selectedTask = null;
    this.formData = {
      title: '',
      description: '',
      status: FrontendTodoStatus.Todo,
      assignedTo: null,
      team: ''
    };
    this.availableAssignees = [];
    this.showCreateModal = true;
  }

  openEditModal(task: Task) {
    this.selectedTask = task;
    this.formData = {
      title: task.title,
      description: task.description,
      status: task.status,
      assignedTo: task.assignedTo?.id.toString() || null,
      team: task.team.id.toString()
    };
    // Load team members for the selected team
    this.onTeamChange(task.team.id.toString());
    this.showCreateModal = true;
  }

  onTeamChange(teamId: string) {
    if (!teamId) {
      this.availableAssignees = [];
      this.formData.assignedTo = null;
      return;
    }

    const teamIdNumber = parseInt(teamId);
    this.taskService.getTeamMembers(teamIdNumber).pipe(
      catchError(error => {
        console.error(`Error loading team members for team ${teamIdNumber}:`, error);
        return of([]);
      })
    ).subscribe(members => {
      this.availableAssignees = members;
      // Reset assignee if current assignee is not in the new team
      if (this.formData.assignedTo) {
        const isAssigneeInTeam = members.some(member => member.id.toString() === this.formData.assignedTo);
        if (!isAssigneeInTeam) {
          this.formData.assignedTo = null;
        }
      }
      // Clear any existing error messages when team changes successfully
      this.errorMessage = '';
    });
  }

  closeModal() {
    this.showCreateModal = false;
    this.selectedTask = null;
    this.errorMessage = '';
    this.availableAssignees = [];
    this.formData = {
      title: '',
      description: '',
      status: FrontendTodoStatus.Todo,
      assignedTo: null,
      team: ''
    };
  }

  saveTask(form: any) {
    if (form.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      if (this.selectedTask) {
        // Update existing task
        this.updateTask();
      } else {
        // Create new task
        this.createTask();
      }
    }
  }

  private createTask() {
    const createRequest: CreateTodoRequestDto = {
      title: this.formData.title,
      description: this.formData.description,
      teamId: parseInt(this.formData.team),
      ownerUserId: parseInt(this.formData.assignedTo!) // User ID of the assignee
    };

    this.taskService.createTask(createRequest).subscribe({
      next: (todoResponse: TodoResponseDto) => {
        // Refresh the entire task list to get the latest data with proper team information
        this.loadTasks();
        this.closeModal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating task:', error);
        if (error.status === 400) {
          this.errorMessage = 'Unable to create task. The selected user may not be a member of the selected team.';
        } else if (error.status === 401) {
          this.errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage = 'You do not have permission to assign tasks to this user.';
        } else {
          this.errorMessage = 'Failed to create task. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  private updateTask() {
    if (!this.selectedTask) return;

    // Validate that assignee is a valid team member if specified
    if (this.formData.assignedTo) {
      const assigneeId = parseInt(this.formData.assignedTo);
      const teamId = parseInt(this.formData.team);
      
      // Check if the assignee is in the available assignees for the selected team
      const isValidAssignee = this.availableAssignees.some(assignee => assignee.id === assigneeId);
      
      if (!isValidAssignee) {
        this.errorMessage = 'The selected assignee is not a member of the selected team. Please choose a valid team member.';
        this.isLoading = false;
        return;
      }
    }

    const updateRequest: UpdateTodoRequestDto = {
      todoId: this.selectedTask.id,
      title: this.formData.title,
      description: this.formData.description,
      status: StatusMapping.frontendToBackend(this.formData.status),
      assigneeId: this.formData.assignedTo ? parseInt(this.formData.assignedTo, 10) : undefined,
      teamId: parseInt(this.formData.team)
    };

    this.taskService.updateTask(updateRequest).subscribe({
      next: (todoResponse: TodoResponseDto) => {
        this.loadTasks();
        this.closeModal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating task:', error);
        if (error.status === 400) {
          this.errorMessage = 'Unable to update task. The selected assignee may not be a member of the selected team.';
        } else if (error.status === 401) {
          this.errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage = 'You do not have permission to update this task.';
        } else {
          this.errorMessage = 'Failed to update task. Please try again.';
        }
        this.isLoading = false;
      }
    });
  }

  deleteTask(task: Task) {
    if (confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
      this.isLoading = true;
      this.errorMessage = '';

      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          // Remove the task from the local array for immediate UI update
          this.tasks = this.tasks.filter(t => t.id !== task.id);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          if (error.status === 401) {
            this.errorMessage = 'Authentication failed. Please log in again.';
          } else if (error.status === 403) {
            this.errorMessage = 'You do not have permission to delete this task.';
          } else if (error.status === 404) {
            this.errorMessage = 'Task not found.';
          } else {
            this.errorMessage = 'Failed to delete task. Please try again.';
          }
          this.isLoading = false;
        }
      });
    }
  }
}
