import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../common/Card';
import { Button } from '../common/Button';
import { Team } from '../../types';
import { X } from 'lucide-react';

type TeamFormProps = {
  team?: Team;
  onClose: () => void;
  onSave: (team: Partial<Team>) => void;
  onDelete?: () => void;
};

export function TeamForm({ team, onClose, onSave, onDelete }: TeamFormProps) {
  const isEditing = !!team;
  const [formData, setFormData] = useState<Partial<Team>>(
    team || {
      name: '',
      description: '',
      department: '',
      capacity: 5,
      status: 'active',
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="animate-in w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isEditing ? 'Edit Team' : 'Create New Team'}</CardTitle>
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
              Team Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter team name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter team description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <div className="space-y-2">
              <label htmlFor="capacity" className="text-sm font-medium">
                Member Capacity
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                min={1}
                max={20}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
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
                required
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
              Delete Team
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
              {isEditing ? 'Save Changes' : 'Create Team'}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}