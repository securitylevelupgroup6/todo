import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Form, Validators } from '@angular/forms';
import { AuthRequest, AuthService, RegisterUser } from '../../core/services/auth.service';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { MultifactorAuthenticationComponent } from '../multifactor-authentication/multifactor-authentication.component';
import { passwordValidator } from '../../shared/functions/helpers.function';
import { FormStateService } from '../../shared/data-access/services/state.service';
import { LoaderComponent } from "../../shared/components/ui/loader/loader.component";

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
    MultifactorAuthenticationComponent,
    LoaderComponent
],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements AfterViewInit, OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  registrationForm: FormGroup;
  otp: string = '';
  showPasswordValidation: boolean = false;
  passwordValidation: PasswordValidation;
  currentPassword: string = '';
  isLoading: boolean = false;
  registrationRequest: AuthRequest = { requestType: ''};
  registrationError: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private formStateService: FormStateService,
  ) {
    this.registrationForm = this.getRegistrationForm();
    this.passwordValidation = {
      isLongEnough: false,
      hasUpperCase: false,
      hasDigit: false,
      hasSpecialChar: false,
      hasLowerCase: false,
    }
  }

  ngOnInit(): void {
    this.authService.currentAuthType.subscribe(data => {
      if(data) this.registrationRequest = data;
    })
  }
  
  ngAfterViewInit(): void {
    this.registrationForm.get('password')?.valueChanges.subscribe(value => {
      this.passwordValidation = this.getPasswordValidation(value);
    });
    this.confirmPassword();
  }

  onSubmit() {
    if(this.registrationForm.valid && !this.otp) {
      const user: RegisterUser = { ...this.registrationForm.value };
      this.isLoading = true;

      this.authService.register(user).subscribe(data => {
        if(data.results) {
          this.otp = data.results?.otpUri;
          this.formStateService.set(this.registrationForm);
          this.isLoading = false;
          this.authService.updateAuthRequest('register');
        } else {
          this.otp = '';
          this.isLoading = false;
          this.registrationError = data.errors ? data.errors?.error : { error: '' };
        }
      });
    }

    if(this.registrationForm.valid && this.otp && !this.registrationRequest.requestType) {
      this.authService.updateAuthRequest('register');      
    }
  }

  getRegistrationForm(): FormGroup {
    const savedForm: FormGroup = this.formStateService.get() || this.formBuilder.group({});
    return this.formBuilder.group({
      userName: [
        savedForm.value.userName, [
          Validators.required,
          Validators.maxLength(255)
        ]
      ],
      password: [
        savedForm.value.password, [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(255),
          passwordValidator
        ]
      ],
      confirmPassword: [
        savedForm.value.confirmPassword,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(255)
        ]
      ],
      firstName: [
        savedForm.value.firstName, [
          Validators.required,
          Validators.maxLength(255),
        ]
      ],
      lastName: [
        savedForm.value.lastName,[
          Validators.required,
          Validators.maxLength(255),
        ]
      ]
    },
    )
  }

  onBack(): void {
    this.router.navigate(["/auth/login"]);
  }

  onInput(event: any): void {
    if(event.data) {
      this.passwordValidation = this.getPasswordValidation(
      this.registrationForm.get('password')?.value
      );
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

  validPassword(): boolean {
    return this.passwordValidation.hasDigit
      && this.passwordValidation.hasLowerCase
      && this.passwordValidation.hasSpecialChar
      && this.passwordValidation.hasUpperCase
      && this.passwordValidation.isLongEnough
  }

  confirmPassword(): void {
    this.registrationForm.get('confirmPassword')?.valueChanges.subscribe(value => {
      const setPassword: string = this.registrationForm.get('password')?.value;
      if(value !== setPassword) {
        this.registrationForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
        this.registrationForm.updateValueAndValidity();
      } else {
        this.registrationForm.get('confirmPassword')?.setErrors(null);
        this.registrationForm.updateValueAndValidity();
      }
    })
  }
}