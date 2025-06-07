import { AfterContentInit, AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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

interface PasswordValidation {
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
  isLongEnough: boolean;
}

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
export class RegisterComponent implements AfterViewInit {
  name: string = '';
  email: string = '';
  password: string = '';
  registrationForm: FormGroup;
  otp: string = '';
  showPasswordValidation: boolean = false;
  passwordValidation!: PasswordValidation;
  currentPassword: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.registrationForm = this.getRegistrationForm();
  }
  
  ngAfterViewInit(): void {
    // this.registrationForm.get('password')?.valueChanges.subscribe(value => {
    //   console.log(value);
    // })
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
      userName: [
        '', [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],
      password: [
        '', [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(256)
        ]
      ],
      verifyPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(256)
        ]
      ],
      firstName: [
        '', [
          Validators.required,
          Validators.maxLength(256),
        ]
      ],
      lastName: [
        '',[
          Validators.required,
          Validators.maxLength(256),
        ]
      ]
    })
  }

  onBack(): void {
    this.router.navigate(["/auth/login"]);
  }

  onInput(event: any): void {
    if(event.data) {
      this.passwordValidation = this.getPasswordValidation(
      this.registrationForm.get('password')?.value
      );
      console.log(this.passwordValidation);
    }
  }

  verifyPassword(): boolean | undefined {
    return (this.registrationForm.get('password')?.valid 
      && this.registrationForm.get('verifyPassword')?.valid
    ) && (this.registrationForm.get('password')?.value === this.registrationForm.get('verifyPassword')?.value)
  }

  onFocus(): void {
    this.showPasswordValidation = true;
  }

  getPasswordValidation(password: string): PasswordValidation {
    return {
      hasUpperCase: RegExp(/[A-Z]/).test(password),
      hasLowerCase: RegExp(/[a-z]/).test(password),
      hasDigit: RegExp(/[0-9]/).test(password),
      hasSpecialChar: RegExp(/[!@#$%^&*(),.?":{}|<>]/).test(password),
      isLongEnough: password.length >= 12
    }
  }
}