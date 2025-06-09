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
}
