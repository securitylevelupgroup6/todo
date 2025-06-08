import React, { useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { formatDate } from '../../lib/utils';
import { Task, User } from '../../types';
import { getStatusColor, getPriorityColor } from '../../lib/utils';

type TaskListProps = {
  tasks: Task[];
  users: User[];
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
};

export function TaskList({ tasks, users, onCreateTask, onEditTask }: TaskListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Get unique statuses and priorities
  const statuses = ['all', ...new Set(tasks.map((task) => task.status))];
  const priorities = ['all', ...new Set(tasks.map((task) => task.priority))];

  // Filter tasks based on search, status, and priority
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Get user name from ID
  const getUserName = (userId: string | null) => {
    if (!userId) return 'Unassigned';
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Unknown';
  };

  // Get user avatar from ID
  const getUserAvatar = (userId: string | null) => {
    if (!userId) return '';
    const user = users.find((u) => u.id === userId);
    return user ? user.avatar : '';
  };

  return (
    <Card className="animate-in">
      <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <CardTitle>Tasks</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search tasks..."
              className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-4 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="rounded-md border border-input bg-background py-2 pl-3 pr-8 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'all' 
                  ? 'All Statuses' 
                  : status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-input bg-background py-2 pl-3 pr-8 text-sm"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority === 'all' 
                  ? 'All Priorities' 
                  : priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
          <Button 
            variant="primary" 
            size="sm"
            startIcon={<PlusCircle className="h-4 w-4" />}
            onClick={onCreateTask}
          >
            New Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Task</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Assignee</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Priority</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => onEditTask(task)}
                  >
                    <td className="py-3">
                      <div className="max-w-md">
                        <p className="font-medium truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {task.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        {task.assignedTo ? (
                          <>
                            <Avatar
                              src={getUserAvatar(task.assignedTo)}
                              name={getUserName(task.assignedTo)}
                              size="sm"
                            />
                            <span className="text-sm">{getUserName(task.assignedTo)}</span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-sm">
                      <Badge 
                        className={getStatusColor(task.status)}
                      >
                        {task.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm">
                      <Badge 
                        className={getPriorityColor(task.priority)}
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm">
                      {formatDate(task.dueDate)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No tasks found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}