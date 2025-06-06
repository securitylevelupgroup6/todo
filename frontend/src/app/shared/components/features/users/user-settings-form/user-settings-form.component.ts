// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormInputComponent } from '../../../ui/inputs/form-input/form-input.component';
// import { ButtonComponent } from '../../../ui/buttons/button/button.component';

// @Component({
//   selector: 'app-user-settings-form',
//   standalone: true,
//   imports: [CommonModule, FormInputComponent, ButtonComponent],
//   template: `
//     <form (ngSubmit)="onSubmit.emit(settings)" class="space-y-6">
//       <div class="space-y-4">
//         <h3 class="text-lg font-medium">Profile Information</h3>
        
//         <app-form-input
//           label="Name"
//           [(ngModel)]="settings.name"
//           name="name"
//           required
//           [error]="errors.name"
//         ></app-form-input>

//         <app-form-input
//           label="Email"
//           type="email"
//           [(ngModel)]="settings.email"
//           name="email"
//           required
//           [error]="errors.email"
//         ></app-form-input>

//         <app-form-input
//           label="Bio"
//           [(ngModel)]="settings.bio"
//           name="bio"
//           [error]="errors.bio"
//         ></app-form-input>
//       </div>

//       <div class="space-y-4">
//         <h3 class="text-lg font-medium">Preferences</h3>
        
//         <div class="space-y-2">
//           <label class="text-sm font-medium">Email Notifications</label>
//           <div class="space-y-2">
//             <div class="flex items-center justify-between">
//               <span class="text-sm">Task Assignments</span>
//               <label class="relative inline-flex cursor-pointer items-center">
//                 <input
//                   type="checkbox"
//                   [(ngModel)]="settings.notifications.taskAssignments"
//                   name="taskAssignments"
//                   class="peer sr-only"
//                 />
//                 <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
//               </label>
//             </div>
//             <div class="flex items-center justify-between">
//               <span class="text-sm">Team Updates</span>
//               <label class="relative inline-flex cursor-pointer items-center">
//                 <input
//                   type="checkbox"
//                   [(ngModel)]="settings.notifications.teamUpdates"
//                   name="teamUpdates"
//                   class="peer sr-only"
//                 />
//                 <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
//               </label>
//             </div>
//             <div class="flex items-center justify-between">
//               <span class="text-sm">Weekly Reports</span>
//               <label class="relative inline-flex cursor-pointer items-center">
//                 <input
//                   type="checkbox"
//                   [(ngModel)]="settings.notifications.weeklyReports"
//                   name="weeklyReports"
//                   class="peer sr-only"
//                 />
//                 <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
//               </label>
//             </div>
//           </div>
//         </div>

//         <div class="space-y-2">
//           <label class="text-sm font-medium">Theme</label>
//           <div class="grid grid-cols-3 gap-4">
//             <button
//               type="button"
//               class="flex flex-col items-center space-y-2 rounded-lg border p-4 hover:border-primary"
//               [class.border-primary]="settings.theme === 'light'"
//               (click)="settings.theme = 'light'"
//             >
//               <div class="h-8 w-8 rounded-full bg-white border"></div>
//               <span class="text-sm">Light</span>
//             </button>
//             <button
//               type="button"
//               class="flex flex-col items-center space-y-2 rounded-lg border p-4 hover:border-primary"
//               [class.border-primary]="settings.theme === 'dark'"
//               (click)="settings.theme = 'dark'"
//             >
//               <div class="h-8 w-8 rounded-full bg-gray-900"></div>
//               <span class="text-sm">Dark</span>
//             </button>
//             <button
//               type="button"
//               class="flex flex-col items-center space-y-2 rounded-lg border p-4 hover:border-primary"
//               [class.border-primary]="settings.theme === 'system'"
//               (click)="settings.theme = 'system'"
//             >
//               <div class="h-8 w-8 rounded-full bg-gradient-to-r from-white to-gray-900"></div>
//               <span class="text-sm">System</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       <div class="flex justify-end space-x-2">
//         <app-button
//           type="button"
//           variant="muted"
//           (onClick)="onCancel.emit()"
//         >
//           Cancel
//         </app-button>
//         <app-button
//           type="submit"
//           variant="primary"
//         >
//           Save Changes
//         </app-button>
//       </div>
//     </form>
//   `,
//   styles: []
// })
// export class UserSettingsFormComponent {
//   @Input() settings: {
//     name: string;
//     email: string;
//     bio?: string;
//     notifications: {
//       taskAssignments: boolean;
//       teamUpdates: boolean;
//       weeklyReports: boolean;
//     };
//     theme: 'light' | 'dark' | 'system';
//   } = {
//     name: '',
//     email: '',
//     notifications: {
//       taskAssignments: true,
//       teamUpdates: true,
//       weeklyReports: false
//     },
//     theme: 'system'
//   };

//   @Input() errors: {
//     name?: string;
//     email?: string;
//     bio?: string;
//   } = {};

//   @Output() onSubmit = new EventEmitter<any>();
//   @Output() onCancel = new EventEmitter<void>();
// } 