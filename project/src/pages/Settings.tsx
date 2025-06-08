import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  
  const handleExportData = () => {
    toast.success('Data export started. You will be notified when it is ready.');
  };
  
  const handleClearCache = () => {
    toast.success('Cache cleared successfully!');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the application looks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme Mode</p>
                <p className="text-sm text-muted-foreground">Switch between light and dark mode.</p>
              </div>
              <Button 
                onClick={toggleTheme}
                variant="outline"
              >
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export and manage your data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">Download all your data as JSON or CSV.</p>
              </div>
              <Button 
                onClick={handleExportData}
                variant="outline"
              >
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Clear Cache</p>
                <p className="text-sm text-muted-foreground">Clear locally stored cache data.</p>
              </div>
              <Button 
                onClick={handleClearCache}
                variant="outline"
              >
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="email-notifications" 
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  defaultChecked 
                />
                <label htmlFor="email-notifications" className="text-sm font-medium">
                  Email Notifications
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="browser-notifications" 
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  defaultChecked 
                />
                <label htmlFor="browser-notifications" className="text-sm font-medium">
                  Browser Notifications
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="weekly-summary" 
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  defaultChecked 
                />
                <label htmlFor="weekly-summary" className="text-sm font-medium">
                  Weekly Summary Report
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}