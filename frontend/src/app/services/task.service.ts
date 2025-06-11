import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  BackendTodo, 
  TodoResponseDto, 
  CreateTodoRequestDto, 
  UpdateTodoRequestDto 
} from '../models/task.model';
import { TeamResponse, UserResponse } from '../shared/models/team.models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get all tasks for the authenticated user - calls GET /todo
   * Returns BackendTodo[] with nested TodoState structure
   */
  getTasks(): Observable<BackendTodo[]> {
    return this.http.get<BackendTodo[]>(`${this.apiUrl}/todo`).pipe(
      catchError(error => {
        console.error('Error loading tasks:', error);
        return of([]);
      })
    );
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
   * Returns TodoResponseDto (flattened structure)
   */
  createTask(taskData: CreateTodoRequestDto): Observable<TodoResponseDto> {
    return this.http.post<TodoResponseDto>(`${this.apiUrl}/todo`, taskData);
  }

  /**
   * Update an existing task - calls PUT /todo
   * Returns TodoResponseDto (flattened structure)
   */
  updateTask(taskData: UpdateTodoRequestDto): Observable<TodoResponseDto> {
    return this.http.put<TodoResponseDto>(`${this.apiUrl}/todo`, taskData);
  }

  /**
   * Get team member data including the team_member.id for a specific user in a team
   * Returns the full team member response which includes the team_member.id
   */
  getTeamMemberData(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teams/${teamId}/team-members`).pipe(
      catchError(error => {
        console.error(`Error loading team member data for team ${teamId}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Delete a task - calls DELETE /todo/delete/{todoId}
   * Returns void on successful deletion
   */
  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/todo/delete/${taskId-1}`);
  }

}
