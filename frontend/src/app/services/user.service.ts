import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UserResponse, TeamResponse } from '../shared/models/team.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUserRoles(): Observable<{ roles: string[] }> {
    return this.apiService.get<{ roles: string[] }>('/users/roles');
  }

  getUserTeams(): Observable<{ teams: TeamResponse[] }> {
    return this.apiService.get<{ teams: TeamResponse[] }>('/users/teams');
  }

  // Note: The backend doesn't seem to have a "get all users" endpoint 
  getAllUsers(): Observable<UserResponse[]> {
    return this.apiService.get<UserResponse[]>('/users');
  }
}
