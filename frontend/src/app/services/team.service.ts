import { Injectable } from '@angular/core';
import { Observable, map, catchError, of, forkJoin, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import {
  TeamResponse,
  UserResponse,
  CreateTeamRequest,
  AddTeamMemberRequest,
  TeamMemberResponse,
  TeamExtended
} from '../shared/models/team.models';
import { TodoResponseDto } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  constructor(private apiService: ApiService) {}

  createTeam(request: CreateTeamRequest): Observable<TeamResponse> {
    return this.apiService.post<TeamResponse>('/teams', request);
  }

  addTeamMember(teamId: number, request: AddTeamMemberRequest): Observable<TeamMemberResponse> {
    return this.apiService.post<TeamMemberResponse>(`/teams/${teamId}/members`, request);
  }

  getTeamMembers(teamId: number): Observable<UserResponse[]> {
    return this.apiService.get<UserResponse[]>(`/teams/${teamId}/members`);
  }

  getUserTeams(): Observable<{ teams: TeamResponse[] }> {
    return this.apiService.get<{ teams: TeamResponse[] }>('/users/teams');
  }

  getTeamTodos(teamId: number): Observable<TodoResponseDto[]> {
    return this.apiService.get<TodoResponseDto[]>(`/todo/team/${teamId}`);
  }

  getTeamWithDetails(teamId: number): Observable<TeamExtended | null> {
    return forkJoin({
      team: this.getUserTeams().pipe(
        map(response => response.teams.find(t => t.id === teamId) || null),
        catchError(() => of(null))
      ),
      members: this.getTeamMembers(teamId).pipe(
        catchError(() => of([]))
      ),
      todos: this.getTeamTodos(teamId).pipe(
        catchError(() => of([]))
      )
    }).pipe(
      map(({ team, members, todos }) => {
        if (!team) return null;
        
        const completedTodos = todos.filter(todo => 
          todo.status?.toUpperCase() === 'COMPLETED'
        ).length;
        
        const completionRate = todos.length > 0 ? (completedTodos / todos.length) * 100 : 0;
        
        return {
          ...team,
          members,
          memberCount: members.length,
          tasks: todos.length,
          completionRate,
          status: 'active' as const,
          createdAt: new Date()
        } as TeamExtended;
      })
    );
  }

  getTeamsWithDetails(): Observable<TeamExtended[]> {
    return this.getUserTeams().pipe(
      map(response => response.teams),
      switchMap((teams: TeamResponse[]) => {
        if (teams.length === 0) return of([]);
        
        const teamDetailsRequests = teams.map((team: TeamResponse) => 
          this.getTeamWithDetails(team.id).pipe(
            catchError((error: any) => {
              console.error(`Error loading details for team ${team.id}:`, error);
              return of({
                ...team,
                members: [],
                memberCount: 0,
                tasks: 0,
                completionRate: 0,
                status: 'active' as const,
                createdAt: new Date()
              } as TeamExtended);
            })
          )
        );
        
        return forkJoin(teamDetailsRequests).pipe(
          map((teamDetails: (TeamExtended | null)[]) => 
            teamDetails.filter((team: TeamExtended | null): team is TeamExtended => team !== null)
          )
        );
      }),
      catchError((error: any) => {
        console.error('Error loading teams with details:', error);
        return of([]);
      })
    );
  }

  // Helper method to get team statistics
  getTeamStats(teamId: number): Observable<{
    memberCount: number;
    totalTodos: number;
    completedTodos: number;
    completionRate: number;
    activeTodos: number;
  }> {
    return forkJoin({
      members: this.getTeamMembers(teamId).pipe(catchError(() => of([]))),
      todos: this.getTeamTodos(teamId).pipe(catchError(() => of([])))
    }).pipe(
      map(({ members, todos }) => {
        const completedTodos = todos.filter(todo => 
          todo.status?.toUpperCase() === 'COMPLETED'
        ).length;
        
        const activeTodos = todos.filter(todo => 
          todo.status?.toUpperCase() !== 'COMPLETED'
        ).length;
        
        return {
          memberCount: members.length,
          totalTodos: todos.length,
          completedTodos,
          completionRate: todos.length > 0 ? (completedTodos / todos.length) * 100 : 0,
          activeTodos
        };
      })
    );
  }
}
