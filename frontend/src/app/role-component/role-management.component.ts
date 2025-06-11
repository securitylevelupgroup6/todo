import { Component, OnInit } from '@angular/core';
import { Role } from '../models/role.model';
import { RoleService } from '../services/role.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  roles: Role[] = []; // For displaying the list of all available roles
  allRoles: Role[] = []; // To store all available roles for the assignment form
  isLoading = true;
  isAssigning = false;
  error: string | null = null;
  assignError: string | null = null;
  assignSuccess: string | null = null;

  assignRoleForm: FormGroup;

  constructor(private roleService: RoleService, private fb: FormBuilder) {
    this.assignRoleForm = this.fb.group({
      username: ['', Validators.required],
      selectedRoles: this.fb.group({}) // Will be populated dynamically
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.error = null;
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.allRoles = data; // Store all roles for the form
        this.roles = data; // Used for displaying the list of roles
        this.populateRoleCheckboxes(data);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load roles. Please try again later.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  private populateRoleCheckboxes(rolesToPopulate: Role[]): void {
    const rolesGroup = this.assignRoleForm.get('selectedRoles') as FormGroup;
    rolesToPopulate.forEach(role => {
      // Check if control already exists to prevent errors on re-init or multiple calls
      if (!rolesGroup.get(role.id.toString())) {
        rolesGroup.addControl(role.id.toString(), this.fb.control(false));
      }
    });
  }

  getRoleControlName(roleId: number): string {
    return roleId.toString();
  }

  onAssignRoles(): void {
    if (this.assignRoleForm.invalid) {
      this.assignError = 'Please enter a username.';
      // Mark fields as touched to show validation errors
      this.assignRoleForm.markAllAsTouched();
      return;
    }

    this.isAssigning = true;
    this.assignError = null;
    this.assignSuccess = null;

    const username = this.assignRoleForm.value.username;
    const selectedRolesObject = this.assignRoleForm.value.selectedRoles;
    const selectedRoleIds: number[] = Object.keys(selectedRolesObject)
      .filter(key => selectedRolesObject[key])
      .map(key => parseInt(key, 10));

    if (selectedRoleIds.length === 0) {
      this.assignError = 'Please select at least one role to assign.';
      this.isAssigning = false;
      return;
    }

    this.roleService.assignRoles(username, selectedRoleIds).subscribe({
      next: () => {
        this.assignSuccess = `Roles successfully assigned to ${username}.`;
        this.isAssigning = false;
        this.assignRoleForm.reset({ username: ''}); // Reset form but keep username structure
         // Clear checkboxes
        const rolesGroup = this.assignRoleForm.get('selectedRoles') as FormGroup;
        this.allRoles.forEach(role => {
          const control = rolesGroup.get(role.id.toString());
          control?.setValue(false);
          control?.markAsUntouched(); // Reset touched state
          control?.markAsPristine(); // Reset pristine state
        });
        this.assignRoleForm.get('username')?.markAsUntouched();
        this.assignRoleForm.get('username')?.markAsPristine();

      },
      error: (err) => {
        this.assignError = `Failed to assign roles: ${err.error?.message || err.message || 'Unknown error'}`;
        if (err.status === 404) {
          this.assignError = `Failed to assign roles: User '${username}' not found.`;
        }
        console.error(err);
        this.isAssigning = false;
      }
    });
  }
}
