import React, { useState } from 'react';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { tasks, users, teams } from '../data/mockData';
import { Task } from '../types';
import toast from 'react-hot-toast';

export function Tasks() {
  const [showForm, setShowForm] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);

  const handleCreateTask = () => {
    setCurrentTask(undefined);
    setShowForm(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setShowForm(true);
  };

  const handleSaveTask = (task: Partial<Task>) => {
    // In a real app, you would save the task to your backend
    toast.success(currentTask ? 'Task updated successfully!' : 'Task created successfully!');
    setShowForm(false);
  };

  const handleDeleteTask = () => {
    // In a real app, you would delete the task from your backend
    toast.success('Task deleted successfully!');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">Manage and assign tasks across your organization.</p>
      </div>
      
      {showForm ? (
        <TaskForm
          task={currentTask}
          users={users}
          teams={teams}
          onClose={() => setShowForm(false)}
          onSave={handleSaveTask}
          onDelete={currentTask ? handleDeleteTask : undefined}
        />
      ) : (
        <TaskList
          tasks={tasks}
          users={users}
          onCreateTask={handleCreateTask}
          onEditTask={handleEditTask}
        />
      )}
    </div>
  );
}