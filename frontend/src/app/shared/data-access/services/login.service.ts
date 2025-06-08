import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs'
import { User } from '../../../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  isLoggedIn: boolean = false;

  private userSubject = new BehaviorSubject<User>({
    userName: '',
    password: '',
    otp: ''
  });
  user$ = this.userSubject.asObservable();

 
  constructor() { }

   updateUser(user: User): void {
    if(user) {
      this.isLoggedIn = true;
      this.userSubject.next(user);
    } else {
      this.isLoggedIn = false;
      this.userSubject.next({
        userName: '',
        password: '',
        otp: ''
      })
    }
  }

  isAuthenticated(): boolean {
      return this.isLoggedIn;
  }
}
