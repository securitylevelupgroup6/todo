import React from 'react';
import { Bell, Menu, Search, Settings, X } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';

type HeaderProps = {
  setSidebarOpen: (open: boolean) => void;
};

export function Header({ setSidebarOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b bg-background px-4 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open sidebar</span>
      </Button>

      <div className="flex flex-1 items-center justify-between">
        <div
          className={cn(
            'hidden transition-all duration-300 ease-in-out lg:block',
            showSearch ? 'lg:hidden' : 'lg:block'
          )}
        >
          <h1 className="text-xl font-semibold">Task Manager</h1>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div
            className={cn(
              'relative transition-all duration-300 ease-in-out',
              showSearch ? 'w-full' : 'w-40 lg:w-64'
            )}
          >
            <div
              className={cn(
                'absolute inset-y-0 left-0 flex items-center pl-3',
                showSearch ? 'block' : 'hidden lg:block'
              )}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="search"
              placeholder="Search..."
              className={cn(
                'w-full rounded-md border border-input bg-background py-2 text-sm transition-all duration-300 ease-in-out',
                showSearch
                  ? 'pl-10 pr-10'
                  : 'pl-10 hidden lg:block'
              )}
            />
            <div
              className={cn(
                'absolute inset-y-0 right-0 flex items-center pr-3',
                showSearch ? 'block' : 'hidden'
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => setShowSearch(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-transparent"
          >
            {theme === 'light' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            )}
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-error"></span>
            </span>
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          <div className="relative">
            <Avatar
              src="https://i.pravatar.cc/150?img=1"
              alt="User"
              name="Alex Johnson"
              size="sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}