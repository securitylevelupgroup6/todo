import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthRequest, AuthService } from '../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MultifactorAuthenticationComponent } from "../multifactor-authentication/multifactor-authentication.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MultifactorAuthenticationComponent
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../register/register.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loginForm: FormGroup;
  isLoading: boolean = false;
  loginRequest: AuthRequest = { requestType: '' };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.getLoginForm();
  }

  ngOnInit(): void { 
    this.authService.currentAuthType.subscribe(data => {
      if(data) this.loginRequest = data; 
    })
   }

  onSubmit() {
    if(this.loginForm.valid) {
      this.authService.updateAuthRequest('login');
    }
  }

  getLoginForm(): FormGroup {
    return this.formBuilder.group({
      userName: ['', [
        Validators.required,
        Validators.maxLength(255)
      ]],
      password: ['', [
        Validators.required,
        Validators.maxLength(255)
      ]],
    })
  }

  onSignUp(): void {
    this.router.navigate(['/auth/register']);
  }
} 