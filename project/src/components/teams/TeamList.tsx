import React, { useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatDate } from '../../lib/utils';
import { Team } from '../../types';
import { getStatusColor } from '../../lib/utils';

type TeamListProps = {
  teams: Team[];
  onCreateTeam: () => void;
  onEditTeam: (team: Team) => void;
};

export function TeamList({ teams, onCreateTeam, onEditTeam }: TeamListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Get unique departments
  const departments = ['all', ...new Set(teams.map((team) => team.department))];

  // Filter teams based on search and department
  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          team.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || team.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  return (
    <Card className="animate-in">
      <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <CardTitle>Teams</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search teams..."
              className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-4 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
            onClick={onCreateTeam}
          >
            New Team
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Department</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Members</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Tasks</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="py-3 text-left text-sm font-medium text-muted-foreground">Created</th>
                <th className="py-3 text-right text-sm font-medium text-muted-foreground">Completion</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => (
                  <tr
                    key={team.id}
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => onEditTeam(team)}
                  >
                    <td className="py-3 text-sm font-medium">{team.name}</td>
                    <td className="py-3 text-sm">{team.department}</td>
                    <td className="py-3 text-sm">
                      {team.memberCount} / {team.capacity}
                    </td>
                    <td className="py-3 text-sm">{team.tasks}</td>
                    <td className="py-3 text-sm">
                      <Badge 
                        className={getStatusColor(team.status)}
                      >
                        {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm">{formatDate(team.createdAt)}</td>
                    <td className="py-3 text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full bg-success"
                            style={{ width: `${team.completionRate}%` }}
                          ></div>
                        </div>
                        <span>{team.completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted-foreground">
                    No teams found matching your filters.
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