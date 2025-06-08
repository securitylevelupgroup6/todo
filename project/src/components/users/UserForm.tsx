import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../common/Card';
import { Button } from '../common/Button';
import { User } from '../../types';
import { X } from 'lucide-react';

type UserFormProps = {
  user?: User;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  onDelete?: () => void;
};

export function UserForm({ user, onClose, onSave, onDelete }: UserFormProps) {
  const isEditing = !!user;
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      name: '',
      email: '',
      role: 'member',
      department: '',
      status: 'active',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="animate-in w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isEditing ? 'Edit User' : 'Create New User'}</CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="admin">Admin</option>
                <option value="team_lead">Team Lead</option>
                <option value="member">Member</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium">
                Department
              </label>
              <select
                id="department"
                name="department"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select department
                </option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Product">Product</option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
              </select>
            </div>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing && onDelete && (
            <Button 
              type="button" 
              variant="danger"
              onClick={onDelete}
            >
              Delete User
            </Button>
          )}
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
            >
              {isEditing ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}