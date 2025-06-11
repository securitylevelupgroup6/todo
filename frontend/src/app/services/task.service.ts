import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of, catchError, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  BackendTodo, 
  TodoResponseDto, 
  CreateTodoRequestDto, 
  UpdateTodoRequestDto 
} from '../models/task.model';
import { TeamResponse, UserResponse } from '../shared/models/team.models';
import { IResponse, observe } from '../shared/functions/helpers.function';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get all tasks from user's teams - calls GET /todo/team/{teamId} for each team
   * Returns BackendTodo[] with nested TodoState structure
   */
  getTasks(): Observable<BackendTodo[]> {
    return this.getUserTeams().pipe(
      switchMap(teams => {
        if (teams.length === 0) {
          return of([]);
        }
        
        // Get tasks from all teams
        const teamTaskRequests = teams.map(team =>
          this.getTeamTasks(team.id).pipe(
            map(tasks => ({ team, tasks })), // Include team info with tasks
            catchError(error => {
              console.error(`Error loading tasks for team ${team.id}:`, error);
              return of({ team, tasks: [] });
            })
          )
        );
        
        return forkJoin(teamTaskRequests).pipe(
          map(teamTaskResults => {
            // Flatten and deduplicate tasks with team information
            const allTasks: { task: TodoResponseDto; team: TeamResponse }[] = [];
            teamTaskResults.forEach(({ team, tasks }) => {
              tasks.forEach(task => {
                // Add task if not already present (deduplicate by ID)
                if (!allTasks.find(t => t.task.id === task.id)) {
                  allTasks.push({ task, team });
                }
              });
            });
            
            // Convert TodoResponseDto[] to BackendTodo[] format with team info
            return allTasks.map(({ task, team }) => this.convertTodoResponseToBackendTodo(task, team));
          })
        );
      })
    );
  }

  /**
   * Get team tasks - calls GET /todo/team/{teamId}
   * Returns TodoResponseDto[] (flattened structure)
   */
  getTeamTasks(teamId: number): Observable<TodoResponseDto[]> {
    return this.http.get<TodoResponseDto[]>(`${this.apiUrl}/todo/team/${teamId}`);
  }

  /**
   * Get user's teams - calls GET /users/teams
   */
  getUserTeams(): Observable<TeamResponse[]> {
    return this.http.get<{teams: TeamResponse[]}>(`${this.apiUrl}/users/teams`).pipe(
      map(response => response.teams || []),
      catchError(error => {
        console.error('Error loading user teams:', error);
        return of([]);
      })
    );
  }

  /**
   * Get team members - calls GET /teams/{teamId}/members
   */
  getTeamMembers(teamId: number): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/teams/${teamId}/members`).pipe(
      catchError(error => {
        console.error(`Error loading members for team ${teamId}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Create a new task - calls POST /todo
   * Returns BackendTodo with nested structure
   */
  createTask(taskData: CreateTodoRequestDto): Observable<BackendTodo> {
    return this.http.post<BackendTodo>(`${this.apiUrl}/todo`, taskData);
  }

  /**
   * Update an existing task - calls PUT /todo/{todoId}
   * Returns TodoResponseDto (flattened structure)
   */
  updateTask(taskData: UpdateTodoRequestDto): Observable<TodoResponseDto> {
    return this.http.put<TodoResponseDto>(`${this.apiUrl}/todo/${taskData.todoId}`, taskData);
  }

  /**
   * Placeholder delete method - shows disabled message
   */
  deleteTask(taskId: number): void {
    console.log('Delete functionality is not yet available for task:', taskId);
    // This method is intentionally non-functional
  }

  /**
   * Convert TodoResponseDto to BackendTodo format for consistency
   */
  private convertTodoResponseToBackendTodo(todoResponse: TodoResponseDto, team: TeamResponse): BackendTodo {
    return {
      id: todoResponse.id,
      todoStateId: todoResponse.id, // Using same ID for todoState
      ownerId: todoResponse.owner?.id || 0,
      todoState: {
        id: todoResponse.id,
        title: todoResponse.title,
        description: todoResponse.description,
        statusId: 1, // Default status ID
        teamId: team.id,
        assigneeId: todoResponse.assignee?.id || 0,
        status: {
          id: 1,
          statusName: todoResponse.status
        },
        team: {
          id: team.id,
          name: team.name
        },
        assignee: todoResponse.assignee ? {
          id: todoResponse.assignee.id,
          user: todoResponse.assignee
        } : undefined
      },
      owner: todoResponse.owner ? {
        id: todoResponse.owner.id,
        user: todoResponse.owner
      } : undefined
    };
  }

  getUserToDos(): Observable<IResponse<any>> {
    return observe(this.http.get<any>(`${this.apiUrl}/todo`));
  }
}
