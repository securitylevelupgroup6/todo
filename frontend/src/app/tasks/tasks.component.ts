import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  assignedTo: {
    id: string;
    name: string;
    avatar: string;
  } | null;
  team: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface TaskFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date;
  assignedTo: string | null;
  team: string;
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
  priorityFilter: string = 'all';
  showCreateModal: boolean = false;
  selectedTask: Task | null = null;

  statuses: string[] = ['all', 'todo', 'in_progress', 'review', 'completed'];
  priorities: string[] = ['all', 'low', 'medium', 'high', 'urgent'];
  teams = [
    { id: '1', name: 'Frontend Development' },
    { id: '2', name: 'UI/UX Design' },
    { id: '3', name: 'Backend Development' }
  ];
  users = [
    { id: '1', name: 'John Doe', avatar: 'https://github.com/shadcn.png' },
    { id: '2', name: 'Jane Smith', avatar: 'https://github.com/shadcn.png' },
    { id: '3', name: 'Mike Johnson', avatar: 'https://github.com/shadcn.png' }
  ];

  formData: TaskFormData = {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date(),
    assignedTo: null,
    team: ''
  };

  // Helper methods for template expressions
  formatStatus(status: string): string {
    if (status === 'all') return 'All Statuses';
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  formatPriority(priority: string): string {
    if (priority === 'all') return 'All Priorities';
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  }

  getTaskCount(status: string): number {
    return this.tasks.filter(t => t.status === status).length;
  }

  getOverdueCount(): number {
    return this.tasks.filter(t => this.getTimeRemaining(t.dueDate) === 'Overdue').length;
  }

  ngOnInit() {
    // Mock data for demonstration
    this.tasks = [
      {
        id: '1',
        title: 'Implement user authentication',
        description: 'Add JWT-based authentication to the application',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date('2024-03-15'),
        assignedTo: this.users[0],
        team: this.teams[0],
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
      },
      {
        id: '2',
        title: 'Design new dashboard layout',
        description: 'Create a modern and responsive dashboard design',
        status: 'review',
        priority: 'medium',
        dueDate: new Date('2024-03-20'),
        assignedTo: this.users[1],
        team: this.teams[1],
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-10')
      }
    ];
  }

  get filteredTasks(): Task[] {
    return this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || task.status === this.statusFilter;
      const matchesPriority = this.priorityFilter === 'all' || task.priority === this.priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'todo':
        return 'bg-muted text-muted-foreground';
      case 'in_progress':
        return 'bg-primary/10 text-primary';
      case 'review':
        return 'bg-warning/10 text-warning';
      case 'completed':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'low':
        return 'bg-success/10 text-success';
      case 'medium':
        return 'bg-warning/10 text-warning';
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'urgent':
        return 'bg-destructive text-destructive-foreground';
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

  getTimeRemaining(date: Date): string {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) {
      return 'Overdue';
    } else if (days === 0) {
      return 'Due today';
    } else if (days === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${days} days`;
    }
  }

  openCreateModal() {
    this.selectedTask = null;
    this.formData = {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(),
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
      priority: task.priority,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo?.id || null,
      team: task.team.id
    };
    this.showCreateModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
    this.selectedTask = null;
    this.formData = {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(),
      assignedTo: null,
      team: ''
    };
  }

  saveTask(form: any) {
    if (form.valid) {
      if (this.selectedTask) {
        // Update existing task
        const index = this.tasks.findIndex(t => t.id === this.selectedTask?.id);
        if (index !== -1) {
          const assignedTo = this.formData.assignedTo ? 
            this.users.find(u => u.id === this.formData.assignedTo) || null : null;
          const team = this.teams.find(t => t.id === this.formData.team);
          
          if (team) {
            this.tasks[index] = {
              ...this.tasks[index],
              title: this.formData.title,
              description: this.formData.description,
              status: this.formData.status as Task['status'],
              priority: this.formData.priority as Task['priority'],
              dueDate: this.formData.dueDate,
              assignedTo,
              team,
              updatedAt: new Date()
            };
          }
        }
      } else {
        // Create new task
        const assignedTo = this.formData.assignedTo ? 
          this.users.find(u => u.id === this.formData.assignedTo) || null : null;
        const team = this.teams.find(t => t.id === this.formData.team);
        
        if (team) {
          const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title: this.formData.title,
            description: this.formData.description,
            status: this.formData.status as Task['status'],
            priority: this.formData.priority as Task['priority'],
            dueDate: this.formData.dueDate,
            assignedTo,
            team,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          this.tasks.push(newTask);
        }
      }
      this.closeModal();
    }
  }

  deleteTask(task: Task) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }
} 