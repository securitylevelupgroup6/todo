import { Component, Input } from '@angular/core';
import { DashboardMetrics } from '../../shared/models/dashboard.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview-cards.component.html',
  styleUrls: ['./overview-cards.component.scss']
})
export class OverviewCardsComponent {
  @Input() metrics!: DashboardMetrics;
} 