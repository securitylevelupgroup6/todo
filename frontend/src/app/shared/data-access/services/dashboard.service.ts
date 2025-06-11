import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardMetrics, Activity, Team, Todo, TodoState, TodoStatus } from '../../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  // Mock data
  private mockTeams: Team[] = [
    { id: 1, name: 'Team Alpha', leadUserId: 1 },
    { id: 2, name: 'Team Beta', leadUserId: 2 },
    { id: 3, name: 'Team Gamma', leadUserId: 3 }
  ];

  private mockTodos: Todo[] = [
    { id: 1, currentStateId: 1, teamOwnerMemberId: 1 },
    { id: 2, currentStateId: 2, teamOwnerMemberId: 1 },
    { id: 3, currentStateId: 3, teamOwnerMemberId: 2 },
    { id: 4, currentStateId: 1, teamOwnerMemberId: 3 }
  ];

  private mockTodoStates: TodoState[] = [
    { id: 1, title: 'Implement Login', description: 'Create login functionality', statusId: 1 },
    { id: 2, title: 'Design Dashboard', description: 'Create dashboard layout', statusId: 2 },
    { id: 3, title: 'API Integration', description: 'Integrate backend APIs', statusId: 3 },
    { id: 4, title: 'Testing', description: 'Write unit tests', statusId: 1 }
  ];

  private mockTodoStatuses: TodoStatus[] = [
    { id: 1, statusName: 'todo' },
    { id: 2, statusName: 'in_progress' },
    { id: 3, statusName: 'completed' }
  ];

  private mockActivities: Activity[] = [
    {
      id: 1,
      user: { id: 1, firstName: 'John', lastName: 'Doe' },
      action: 'created',
      target: 'Implement Login',
      timestamp: new Date().toISOString(),
      description: 'John Doe created a new task: Implement Login'
    },
    {
      id: 2,
      user: { id: 2, firstName: 'Jane', lastName: 'Smith' },
      action: 'updated',
      target: 'Design Dashboard',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      description: 'Jane Smith updated the task: Design Dashboard'
    },
    {
      id: 3,
      user: { id: 3, firstName: 'Mike', lastName: 'Johnson' },
      action: 'completed',
      target: 'API Integration',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      description: 'Mike Johnson completed the task: API Integration'
    }
  ];

  getDashboardMetrics(): Observable<DashboardMetrics> {
    const tasksByStatus = this.calculateTasksByStatus(this.mockTodos, this.mockTodoStates, this.mockTodoStatuses);
    const teamPerformance = this.calculateTeamPerformance(this.mockTeams, this.mockTodos, this.mockTodoStates);

    return of({
      totalTeams: this.mockTeams.length,
      activeUsers: this.calculateActiveUsers(this.mockTeams),
      ongoingTasks: this.calculateOngoingTasks(this.mockTodos, this.mockTodoStates, this.mockTodoStatuses),
      completionRate: this.calculateCompletionRate(this.mockTodos, this.mockTodoStates, this.mockTodoStatuses),
      tasksByStatus,
      teamPerformance,
      completedTodos: 0,
    });
  }

  getActivities(): Observable<Activity[]> {
    return of(this.mockActivities);
  }

  private calculateTasksByStatus(
    todos: Todo[],
    todoStates: TodoState[],
    todoStatuses: TodoStatus[]
  ): Record<string, number> {
    const statusCounts: Record<string, number> = {};
    
    todos.forEach(todo => {
      const currentState = todoStates.find(state => state.id === todo.currentStateId);
      if (currentState) {
        const status = todoStatuses.find(s => s.id === currentState.statusId);
        if (status) {
          statusCounts[status.statusName] = (statusCounts[status.statusName] || 0) + 1;
        }
      }
    });

    return statusCounts;
  }

  private calculateTeamPerformance(
    teams: Team[],
    todos: Todo[],
    todoStates: TodoState[]
  ) {
    return teams.map(team => {
      const teamTodos = todos.filter(todo => todo.teamOwnerMemberId === team.id);
      const completedTodos = teamTodos.filter(todo => {
        const state = todoStates.find(s => s.id === todo.currentStateId);
        return state?.statusId === 3; // Assuming 3 is the ID for 'completed' status
      });

      return {
        team: team.name,
        performance: teamTodos.length ? (completedTodos.length / teamTodos.length) * 100 : 0
      };
    });
  }

  private calculateActiveUsers(teams: Team[]): number {
    return teams.length * 2; // Mock: 2 active users per team
  }

  private calculateOngoingTasks(
    todos: Todo[],
    todoStates: TodoState[],
    todoStatuses: TodoStatus[]
  ): number {
    return todos.filter(todo => {
      const state = todoStates.find(s => s.id === todo.currentStateId);
      if (state) {
        const status = todoStatuses.find(s => s.id === state.statusId);
        return status?.statusName === 'in_progress';
      }
      return false;
    }).length;
  }

  private calculateCompletionRate(
    todos: Todo[],
    todoStates: TodoState[],
    todoStatuses: TodoStatus[]
  ): number {
    const completedTodos = todos.filter(todo => {
      const state = todoStates.find(s => s.id === todo.currentStateId);
      if (state) {
        const status = todoStatuses.find(s => s.id === state.statusId);
        return status?.statusName === 'completed';
      }
      return false;
    });

    return todos.length ? (completedTodos.length / todos.length) * 100 : 0;
  }
} 