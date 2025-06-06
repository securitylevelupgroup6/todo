import { AfterContentInit, Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Form, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

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
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements AfterContentInit {
  name: string = '';
  email: string = '';
  password: string = '';
  registrationForm: FormGroup;

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
    this.authService.register(this.registrationForm.getRawValue()).subscribe({
      next: (data) => {
        console.log(data);
        // this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
      }
    });
  }

  getRegistrationForm(): FormGroup {
    return this.formBuilder.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required],
      VerifyPassword: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required]
    })
  }

  onBack(): void {
    this.router.navigate(["/auth/login"]);
  }

  onInput(event: any): void {
    console.log(event);
  }
}