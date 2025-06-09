import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  BackendTodo, 
  TodoResponseDto, 
  CreateTodoRequestDto, 
  UpdateTodoRequestDto 
} from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get user's tasks - calls GET /todo
   * Returns BackendTodo[] with nested TodoState structure
   */
  getTasks(): Observable<BackendTodo[]> {
    return this.http.get<BackendTodo[]>(`${this.apiUrl}/todo`);
  }

  /**
   * Get team tasks - calls GET /todo/team/{teamId}
   * Note: Backend endpoint incorrectly expects a body (UpdateTodoRequest) even for GET
   * We'll use POST method instead to send the required empty body
   */
  getTeamTasks(teamId: number): Observable<TodoResponseDto[]> {
    // Since the backend GET endpoint expects a body, we'll try the request first
    // If it fails, we might need to use a different approach
    return this.http.request<TodoResponseDto[]>('GET', `${this.apiUrl}/todo/team/${teamId}`, {
      body: {}
    });
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
}
