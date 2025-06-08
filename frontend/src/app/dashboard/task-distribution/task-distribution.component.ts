import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-task-distribution',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid gap-6 md:grid-cols-2">
      <!-- Tasks by Status -->
      <div>
        <h3 class="mb-4 text-sm font-medium text-muted-foreground">Tasks by Status</h3>
        <div class="aspect-square">
          <canvas #statusChart></canvas>
        </div>
      </div>

      <!-- Tasks by Priority -->
      <div>
        <h3 class="mb-4 text-sm font-medium text-muted-foreground">Tasks by Priority</h3>
        <div class="aspect-square">
          <canvas #priorityChart></canvas>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TaskDistributionComponent implements AfterViewInit {
  @ViewChild('statusChart') statusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityChart') priorityChartRef!: ElementRef<HTMLCanvasElement>;
  @Input() tasksByStatus: Record<string, number> = {};

  private statusChart: Chart | null = null;
  private priorityChart: Chart | null = null;

  ngAfterViewInit() {
    this.createStatusChart();
    this.createPriorityChart();
  }

  private createStatusChart() {
    const ctx = this.statusChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: Object.keys(this.tasksByStatus),
      datasets: [{
        data: Object.values(this.tasksByStatus),
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',  // Blue
          'rgba(16, 185, 129, 0.5)',  // Green
          'rgba(245, 158, 11, 0.5)',  // Yellow
          'rgba(239, 68, 68, 0.5)',   // Red
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1
      }]
    };

    this.statusChart = new Chart(ctx, {
      type: 'pie',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    });
  }

  private createPriorityChart() {
    const ctx = this.priorityChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: ['Low', 'Medium', 'High', 'Urgent'],
      datasets: [{
        data: [30, 40, 20, 10], // Example data, replace with actual data
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',  // Blue
          'rgba(16, 185, 129, 0.5)',  // Green
          'rgba(245, 158, 11, 0.5)',  // Yellow
          'rgba(239, 68, 68, 0.5)',   // Red
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1
      }]
    };

    this.priorityChart = new Chart(ctx, {
      type: 'doughnut',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    });
  }
} 