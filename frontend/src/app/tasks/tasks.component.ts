import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="container mx-auto px-4 py-8">
      <header class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Tasks</h1>
        <p class="mt-2 text-muted-foreground">Manage and track your team's tasks</p>
      </header>

      <section class="grid gap-6 lg:grid-cols-3">
        <!-- Task List -->
        <article class="lg:col-span-2 space-y-4">
          <!-- Task Item -->
          <div class="rounded-lg border bg-card p-4 shadow-sm">
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <h3 class="font-medium leading-none">Implement user authentication</h3>
                <p class="text-sm text-muted-foreground">Development Team</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  In Progress
                </span>
                <button class="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="mt-4 flex items-center gap-4">
              <div class="flex items-center gap-2">
                <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-muted-foreground">Due in 2 days</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span class="text-sm text-muted-foreground">3 assignees</span>
              </div>
            </div>
          </div>

          <!-- Add Task Button -->
          <button class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-muted-foreground hover:border-foreground hover:text-foreground">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="font-medium">Add New Task</span>
          </button>
        </article>

        <!-- Task Stats -->
        <aside class="space-y-6">
          <div class="rounded-lg border bg-card p-6">
            <h3 class="font-semibold">Task Overview</h3>
            <div class="mt-4 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Total Tasks</span>
                <span class="font-medium">24</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">In Progress</span>
                <span class="font-medium">8</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Completed</span>
                <span class="font-medium">12</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">Overdue</span>
                <span class="font-medium">4</span>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TasksComponent {} 