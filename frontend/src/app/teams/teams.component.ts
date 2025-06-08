import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  ngOnInit() {
    // Mock data for demonstration
    this.teams = [
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
      if (this.selectedTeam) {
        // Update existing team
        const index = this.teams.findIndex(t => t.id === this.selectedTeam?.id);
        if (index !== -1) {
          this.teams[index] = {
            ...this.teams[index],
            name: this.formData.name,
            department: this.formData.department,
            capacity: this.formData.capacity
          };
        }
      } else {
        // Create new team
        const newTeam: Team = {
          id: Math.random().toString(36).substr(2, 9),
          name: this.formData.name,
          department: this.formData.department,
          memberCount: 0,
          capacity: this.formData.capacity,
          tasks: 0,
          status: 'active',
          createdAt: new Date(),
          completionRate: 0,
          members: []
        };
        this.teams.push(newTeam);
      }
      this.closeModal();
    }
  }
} 