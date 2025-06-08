import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { formatRelativeTime } from '../../lib/utils';
import { Activity } from '../../types';

type ActivityFeedProps = {
  activities: Activity[];
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="animate-in">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar
                src={activity.user.avatar}
                name={activity.user.name}
                size="sm"
              />
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{' '}
                  {activity.action}{' '}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}