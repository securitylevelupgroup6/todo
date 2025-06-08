import React from 'react';
import { cn } from '../../lib/utils';

type BadgeProps = {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
  children: React.ReactNode;
};

export function Badge({ 
  variant = 'default', 
  className, 
  children 
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-muted/50 text-muted-foreground': variant === 'default',
          'bg-primary/20 text-primary': variant === 'primary',
          'bg-secondary/20 text-secondary': variant === 'secondary',
          'bg-success/20 text-success': variant === 'success',
          'bg-warning/20 text-warning': variant === 'warning',
          'bg-error/20 text-error': variant === 'error',
        },
        className
      )}
    >
      {children}
    </span>
  );
}