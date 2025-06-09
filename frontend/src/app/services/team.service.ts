import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  TeamResponse,
  UserResponse,
  CreateTeamRequest,
  AddTeamMemberRequest,
  TeamMemberResponse
} from '../shared/models/team.models';

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

  // Note: The backend doesn't seem to have a "get all teams" endpoint in the provided code
  // You may need to add this endpoint to the backend or modify this based on available endpoints
  getAllTeams(): Observable<TeamResponse[]> {
    return this.apiService.get<TeamResponse[]>('/teams');
  }

  // Note: The backend doesn't seem to have an "update team" endpoint in the provided code
  // You may need to add this endpoint to the backend or modify this based on available endpoints
  updateTeam(teamId: number, request: Partial<CreateTeamRequest>): Observable<TeamResponse> {
    return this.apiService.put<TeamResponse>(`/teams/${teamId}`, request);
  }

  // Note: The backend doesn't seem to have a "delete team" endpoint in the provided code
  // You may need to add this endpoint to the backend or modify this based on available endpoints
  deleteTeam(teamId: number): Observable<void> {
    return this.apiService.delete<void>(`/teams/${teamId}`);
  }
}
