import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskService } from '../services/task.service';
import { UserService } from '../shared/data-access/services/login.service';
import { 
  BackendTodo, 
  TodoResponseDto, 
  CreateTodoRequestDto, 
  UpdateTodoRequestDto,
  FrontendTodoStatus,
  StatusMapping,
  UserResponseDto
} from '../models/task.model';

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
  
  // Mock teams data - in a real app, this would come from a teams service
  teams = [
    { id: 1, name: 'Frontend Development' },
    { id: 2, name: 'UI/UX Design' },
    { id: 3, name: 'Backend Development' }
  ];
  
  // Mock users data - in a real app, this would come from a users service
  users = [
    { id: 1, username: 'jdoe', firstName: 'John', lastName: 'Doe', roles: ['USER'] },
    { id: 2, username: 'jsmith', firstName: 'Jane', lastName: 'Smith', roles: ['USER'] },
    { id: 3, username: 'mjohnson', firstName: 'Mike', lastName: 'Johnson', roles: ['TEAM_LEAD'] }
  ];

  formData: TaskFormData = {
    title: '',
    description: '',
    status: FrontendTodoStatus.Todo,
    assignedTo: null,
    team: ''
  };

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.taskService.getTasks().subscribe({
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
    const teamId = backendTodo.todoState?.teamId || 0;
    const team = this.teams.find(t => t.id === teamId) || { id: teamId, name: 'Unknown Team' };
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
        return 'bg-primary/10 text-primary';
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
    this.showCreateModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
    this.selectedTask = null;
    this.errorMessage = '';
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
      next: (backendTodo: BackendTodo) => {
        const newTask = this.mapBackendTodoToTask(backendTodo);
        this.tasks.push(newTask);
        this.closeModal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.errorMessage = 'Failed to create task. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private updateTask() {
    if (!this.selectedTask) return;

    const updateRequest: UpdateTodoRequestDto = {
      todoId: this.selectedTask.id,
      title: this.formData.title,
      description: this.formData.description,
      status: StatusMapping.frontendToBackend(this.formData.status),
      assigneeId: this.formData.assignedTo ? parseInt(this.formData.assignedTo) : undefined,
      teamId: parseInt(this.formData.team)
    };

    this.taskService.updateTask(updateRequest).subscribe({
      next: (todoResponse: TodoResponseDto) => {
        const updatedTask = this.mapTodoResponseToTask(todoResponse, parseInt(this.formData.team));
        const index = this.tasks.findIndex(t => t.id === this.selectedTask!.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.closeModal();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.errorMessage = 'Failed to update task. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteTask(task: Task) {
    if (confirm('Are you sure you want to delete this task?')) {
      // Note: No delete endpoint available in backend, so we'll just remove from local array
      // In a real app, you would call a delete API endpoint here
      const index = this.tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        this.tasks.splice(index, 1);
      }
    }
  }
}
