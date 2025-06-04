import React, { useState } from 'react';
import { UserList } from '../components/users/UserList';
import { UserForm } from '../components/users/UserForm';
import { users } from '../data/mockData';
import { User } from '../types';
import toast from 'react-hot-toast';

export function Users() {
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  const handleCreateUser = () => {
    setCurrentUser(undefined);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setShowForm(true);
  };

  const handleSaveUser = (user: Partial<User>) => {
    // In a real app, you would save the user to your backend
    toast.success(currentUser ? 'User updated successfully!' : 'User created successfully!');
    setShowForm(false);
  };

  const handleDeleteUser = () => {
    // In a real app, you would delete the user from your backend
    toast.success('User deleted successfully!');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage your organization's users and their roles.</p>
      </div>
      
      {showForm ? (
        <UserForm
          user={currentUser}
          onClose={() => setShowForm(false)}
          onSave={handleSaveUser}
          onDelete={currentUser ? handleDeleteUser : undefined}
        />
      ) : (
        <UserList
          users={users}
          onCreateUser={handleCreateUser}
          onEditUser={handleEditUser}
        />
      )}
    </div>
  );
}