import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { AuthService } from '../../core/services/auth.service';
import { ErrorMessages } from '../../shared/enums/enums';
import { UserService } from '../../shared/data-access/services/login.service';
import { LoginCredentials } from '../../models/user.model';

@Component({
  selector: 'app-multifactor-authentication',
  standalone: true,
  imports: [ 
    NgIf,
    CommonModule,
    RouterModule, 
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    QRCodeComponent,
  ],
  templateUrl: './multifactor-authentication.component.html',
  styleUrl: './multifactor-authentication.component.scss'
})
export class MultifactorAuthenticationComponent {

  @Input()
  otp!: string; // For QR code display during registration

  @Input()
  registrationForm!: FormGroup; // Login form from parent component

  @Input()
  loginRequest: boolean = false;

  otpForm: FormGroup;
  required: string = ErrorMessages.REQUIRED_FIELD;
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
  ) {
    this.otpForm = this.formBuilder.group({
      otp: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    // Construct credentials from the registration form (login form) and OTP form
    const credentials: LoginCredentials = {
      userName: this.registrationForm?.get('userName')?.value || '',
      password: this.registrationForm?.get('password')?.value || '',
      otp: this.otpForm.get('otp')?.value || ''
    };

    // Validate that all required fields are present
    if (!credentials.userName || !credentials.password || !credentials.otp) {
      this.handleValidationError();
      this.isSubmitting = false;
      return;
    }

    // Call the auth service login method
    this.authService.login(credentials).subscribe({
      next: (userRecord) => {
        // Success: AuthService handles persistence automatically
        // Update the UserService with the received user data
        this.userService.updateUser(userRecord);
        
        // Reset the MFA state and navigate
        this.loginRequest = false;
        this.isSubmitting = false;
        this.router.navigate(['']);
      },
      error: (error) => {
        // Handle login errors
        this.isSubmitting = false;
        this.handleLoginError(error);
      }
    });
  }

  private handleValidationError(): void {
    // Mark forms as touched to display validation errors
    this.otpForm.markAllAsTouched();
    
    if (this.registrationForm) {
      this.registrationForm.markAllAsTouched();
    }

    // Set error message
    this.errorMessage = 'Please fill in all required fields.';
    
    // Set specific form errors for better UX
    if (!this.otpForm.get('otp')?.value) {
      this.otpForm.get('otp')?.setErrors({ 'required': true });
    }
  }

  private handleLoginError(error: any): void {
    console.error('MFA Login error:', error);
    
    // Handle different types of errors
    if (error.status === 401) {
      this.errorMessage = 'Invalid OTP or login credentials. Please try again.';
      this.otpForm.get('otp')?.setErrors({ 'invalidOtp': true });
    } else if (error.status === 400) {
      this.errorMessage = 'Invalid request. Please check your input and try again.';
    } else if (error.status === 500) {
      this.errorMessage = 'Server error. Please try again later.';
    } else if (error.error?.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'An unexpected error occurred. Please try again.';
    }

    // Clear the OTP field for retry
    this.otpForm.get('otp')?.setValue('');
  }

  // Helper method to reset the component state
  resetComponent(): void {
    this.otpForm.reset();
    this.errorMessage = '';
    this.isSubmitting = false;
  }
}
