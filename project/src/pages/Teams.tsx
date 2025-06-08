import React, { useState } from 'react';
import { TeamList } from '../components/teams/TeamList';
import { TeamForm } from '../components/teams/TeamForm';
import { teams } from '../data/mockData';
import { Team } from '../types';
import toast from 'react-hot-toast';

export function Teams() {
  const [showForm, setShowForm] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | undefined>(undefined);

  const handleCreateTeam = () => {
    setCurrentTeam(undefined);
    setShowForm(true);
  };

  const handleEditTeam = (team: Team) => {
    setCurrentTeam(team);
    setShowForm(true);
  };

  const handleSaveTeam = (team: Partial<Team>) => {
    // In a real app, you would save the team to your backend
    toast.success(currentTeam ? 'Team updated successfully!' : 'Team created successfully!');
    setShowForm(false);
  };

  const handleDeleteTeam = () => {
    // In a real app, you would delete the team from your backend
    toast.success('Team deleted successfully!');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teams</h1>
        <p className="text-muted-foreground">Manage your organization's teams.</p>
      </div>
      
      {showForm ? (
        <TeamForm
          team={currentTeam}
          onClose={() => setShowForm(false)}
          onSave={handleSaveTeam}
          onDelete={currentTeam ? handleDeleteTeam : undefined}
        />
      ) : (
        <TeamList
          teams={teams}
          onCreateTeam={handleCreateTeam}
          onEditTeam={handleEditTeam}
        />
      )}
    </div>
  );
}