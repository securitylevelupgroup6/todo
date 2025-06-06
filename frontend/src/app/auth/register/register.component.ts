import { AfterContentInit, Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Form, Validators } from '@angular/forms';
import { AuthService, RegisterUser } from '../../core/services/auth.service';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { MultifactorAuthenticationComponent } from '../multifactor-authentication/multifactor-authentication.component';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements AfterContentInit {
  name: string = '';
  email: string = '';
  password: string = '';
  registrationForm: FormGroup;
  otp: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.registrationForm = this.getRegistrationForm();
  }
  ngAfterContentInit(): void {
    
  }

  onSubmit() {
    const user: RegisterUser = { ...this.registrationForm.value };
    this.authService.register(user).subscribe(data => {
     if(data.results) {
      this.otp = data.results.otpUri;
     } else {
      this.otp = '';
     }
    });
  }

  getRegistrationForm(): FormGroup {
    return this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      verifyPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    })
  }

  onBack(): void {
    this.router.navigate(["/auth/login"]);
  }

  onInput(event: any): void {
    console.log(event);
  }
}