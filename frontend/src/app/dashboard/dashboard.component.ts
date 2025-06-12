import { Component, OnInit } from '@angular/core';
import { OverviewCardsComponent } from './overview-cards/overview-cards.component';
import { DashboardMetrics, Activity } from '../shared/models/dashboard.models';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { AuthService } from '../core/services/auth.service';
import { TeamResponse } from '../shared/models/team.models';
import { BackendTodo } from '../models/task.model';
import { UserRecord } from '../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    OverviewCardsComponent,
  ],  
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  metrics: DashboardMetrics = {
    totalTeams: 0,
    activeUsers: 0,
    ongoingTasks: 0,
    completionRate: 0,
    completedTodos: 0,
  };

  activities: Activity[] = [];
  user: UserRecord | null;
  teams: TeamResponse[] = [];

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
  ) {
    this.user = this.authService.getCurrentUser();
  }

  ngOnInit() {
    if(this.user) {
      this.loadDashboardData();
    }
  }

  private loadDashboardData(): void {
    // Load metrics
    this.taskService.getUserToDos(this.user).subscribe(data => {
      if(data.results) {
        const outstandingTodos: number = this.getTodoStateCount(data.results, 'created') + this.getTodoStateCount(data.results, 'in_progress');
        const completedTodos: number = this.getTodoStateCount(data.results, 'completed');
        this.metrics = {
          totalTeams: this.getTeamCount(data.results),
          activeUsers: 0,
          ongoingTasks: outstandingTodos,
          completionRate: data.results.length > 0 ? (completedTodos / data.results.length) * 100 : 0,
          completedTodos: completedTodos || 0,
        }
      } else {

      }
    })
  }

  getTodoStateCount(todos: BackendTodo[], statusOfTodo: string): number {
    const stateCount: number = todos.map(
      (todo: BackendTodo) => todo.todoState?.status?.statusName
    ).filter(status => status?.toLowerCase() === statusOfTodo).length;
    return isNaN(stateCount) || !stateCount ? 0 : stateCount
  }

  getTeamCount(todos: BackendTodo[]): number {
    const teamCount: number = [...new Set(todos.map(
      (todo: BackendTodo) => todo.team?.name
    ))].length;
    return isNaN(teamCount) || !teamCount ? 0 : teamCount;
  }
}
