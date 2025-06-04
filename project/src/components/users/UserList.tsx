import React, { useState } from 'react';
import { PlusCircle, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { formatDate, formatRelativeTime } from '../../lib/utils';
import { User } from '../../types';
import { getStatusColor } from '../../lib/utils';

type UserListProps = {
  users: User[];
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
};

export function UserList({ users, onCreateUser, onEditUser }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Get unique roles and departments
  const roles = ['all', ...new Set(users.map((user) => user.role))];
  const departments = ['all', ...new Set(users.map((user) => user.department))];

  // Filter users based on search, role, and department
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  return (
    <Card className="animate-in">
      <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <CardTitle>Users</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search users..."
              className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-4 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="rounded-md border border-input bg-background py-2 pl-3 pr-8 text-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === 'all' 
                  ? 'All Roles' 
                  : role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-input bg-background py-2 pl-3 pr-8 text-sm"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
          <Button 
            variant="primary" 
            size="sm"
            startIcon={<PlusCircle className="h-4 w-4" />}
            onClick={onCreateUser}
          >
            New User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Department</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Last Active</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => onEditUser(user)}
                  >
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={user.avatar}
                          name={user.name}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-sm">
                      <Badge
                        variant={
                          user.role === 'admin'
                            ? 'primary'
                            : user.role === 'team_lead'
                            ? 'secondary'
                            : 'default'
                        }
                      >
                        {user.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm">{user.department}</td>
                    <td className="py-3 text-sm">
                      <Badge 
                        className={getStatusColor(user.status)}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm">{formatRelativeTime(user.lastActive)}</td>
                    <td className="py-3 text-sm">{formatDate(user.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground">
                    No users found matching your filters.
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