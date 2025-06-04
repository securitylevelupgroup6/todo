import { Component, Input } from '@angular/core';
import { Activity } from '../../shared/models/dashboard.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.scss']
})
export class ActivityFeedComponent {
  @Input() activities!: Activity[];
} 