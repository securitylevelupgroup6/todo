import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <main class="min-h-screen flex items-center justify-center bg-background">
      <section class="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <header class="text-center">
          <h1 class="text-2xl font-bold">Create an account</h1>
          <p class="text-muted-foreground mt-2">Sign up to get started</p>
        </header>
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()">
          <fieldset class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                [(ngModel)]="name"
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                [(ngModel)]="email"
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                [(ngModel)]="password"
                class="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Create a password"
              />
            </div>
          </fieldset>
          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign up
            </button>
          </div>
        </form>
        <footer class="text-center text-sm">
          <p class="text-muted-foreground">
            Already have an account?
            <a routerLink="/auth/login" class="font-medium text-primary hover:text-primary/90">
              Sign in
            </a>
          </p>
        </footer>
      </section>
    </main>
  `,
  styles: []
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    const [firstName, ...lastNameParts] = this.name.split(' ');
    const lastName = lastNameParts.join(' ');

    const userData: Partial<User> = {
      email: this.email,
      firstName,
      lastName
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
      }
    });
  }
}