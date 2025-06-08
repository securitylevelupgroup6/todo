import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatTime(date: string | Date) {
  return format(new Date(date), 'h:mm a');
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), 'MMM dd, yyyy h:mm a');
}

export function formatRelativeTime(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'active':
    case 'completed':
      return 'bg-success/20 text-success';
    case 'inactive':
      return 'bg-muted/50 text-muted-foreground';
    case 'pending':
      return 'bg-warning/20 text-warning';
    case 'in_progress':
      return 'bg-secondary/20 text-secondary';
    case 'blocked':
      return 'bg-error/20 text-error';
    default:
      return 'bg-muted/50 text-muted-foreground';
  }
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'low':
      return 'bg-muted/50 text-muted-foreground';
    case 'medium':
      return 'bg-secondary/20 text-secondary';
    case 'high':
      return 'bg-warning/20 text-warning';
    case 'urgent':
      return 'bg-error/20 text-error';
    default:
      return 'bg-muted/50 text-muted-foreground';
  }
}