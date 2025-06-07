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

interface User {
  userName: string;
  password: string;
  otp: string;
}

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
    QRCodeComponent
  ],
  templateUrl: './multifactor-authentication.component.html',
  styleUrl: './multifactor-authentication.component.scss'
})
export class MultifactorAuthenticationComponent {

  @Input()
  otp!: string;
  @Input()
  registrationForm!: FormGroup;
  otpForm: FormGroup;
  required: string = ErrorMessages.REQUIRED_FIELD;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
  ) {
    this.otpForm = this.formBuilder.group({
      otp: ['', Validators.required]
    })
  }

  ngOnInit(): void {

  }

  onSubmit(): void {
    const user: User = {
      userName: this.registrationForm.get('userName')?.value,
      password: this.registrationForm.get('password')?.value,
      otp: this.otpForm.get('otp')?.value,
    }
    if(user.userName && user.password && user.otp) {
      this.authService.login(user).subscribe(data => {
        if(data.results) {
          console.log(data.results);
          this.userService.updateUser(user);
        } else {

        }
      })
    }
  }
}
