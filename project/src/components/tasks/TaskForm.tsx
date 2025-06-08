import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../common/Card';
import { Button } from '../common/Button';
import { Task, User, Team } from '../../types';
import { X } from 'lucide-react';
import { formatDate } from '../../lib/utils';

type TaskFormProps = {
  task?: Task;
  users: User[];
  teams: Team[];
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  onDelete?: () => void;
};

export function TaskForm({ task, users, teams, onClose, onSave, onDelete }: TaskFormProps) {
  const isEditing = !!task;
  const [formData, setFormData] = useState<Partial<Task>>(
    task || {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      assignedTo: null,
      teamId: null,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Filter users by selected team
  const filteredUsers = formData.teamId
    ? users.filter((user) => {
        const team = teams.find((t) => t.id === formData.teamId);
        return team && user.department === team.department;
      })
    : users;

  return (
    <Card className="animate-in w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</CardTitle>
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
            <label htmlFor="title" className="text-sm font-medium">
              Task Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter task title"
              value={formData.title}
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
              placeholder="Enter task description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="teamId" className="text-sm font-medium">
                Team
              </label>
              <select
                id="teamId"
                name="teamId"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.teamId || ''}
                onChange={handleChange}
              >
                <option value="">No Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="assignedTo" className="text-sm font-medium">
                Assigned To
              </label>
              <select
                id="assignedTo"
                name="assignedTo"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.assignedTo || ''}
                onChange={handleChange}
              >
                <option value="">Unassigned</option>
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing && onDelete && (
            <Button 
              type="button" 
              variant="danger"
              onClick={onDelete}
            >
              Delete Task
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
              {isEditing ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}