import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-task-distribution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-distribution.component.html',
  styleUrls: ['./task-distribution.component.scss']
})
export class TaskDistributionComponent implements AfterViewInit {
  @Input() tasksByStatus!: Record<string, number>;
  @ViewChild('statusChartCanvas') statusChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('priorityChartCanvas') priorityChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private statusChart: Chart | null = null;
  private priorityChart: Chart | null = null;

  ngAfterViewInit() {
    this.createCharts();
  }

  ngOnChanges() {
    if (this.statusChart && this.priorityChart) {
      this.updateCharts();
    }
  }

  private createCharts() {
    this.createStatusChart();
    this.createPriorityChart();
  }

  private createStatusChart() {
    const ctx = this.statusChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.statusChart = new Chart(ctx, {
      type: 'pie',
      data: this.getStatusChartData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  private createPriorityChart() {
    const ctx = this.priorityChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.priorityChart = new Chart(ctx, {
      type: 'pie',
      data: this.getPriorityChartData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  private updateCharts() {
    if (this.statusChart) {
      const statusData = this.getStatusChartData();
      this.statusChart.data.labels = statusData.labels;
      this.statusChart.data.datasets[0].data = statusData.datasets[0].data;
      this.statusChart.update();
    }

    if (this.priorityChart) {
      const priorityData = this.getPriorityChartData();
      this.priorityChart.data.labels = priorityData.labels;
      this.priorityChart.data.datasets[0].data = priorityData.datasets[0].data;
      this.priorityChart.update();
    }
  }

  private getStatusChartData() {
    const labels = Object.keys(this.tasksByStatus);
    const data = Object.values(this.tasksByStatus);
    const backgroundColors = [
      'rgba(59, 130, 246, 0.5)',  // Blue
      'rgba(16, 185, 129, 0.5)',  // Green
      'rgba(245, 158, 11, 0.5)',  // Yellow
      'rgba(239, 68, 68, 0.5)'    // Red
    ];

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.5', '1')),
        borderWidth: 1
      }]
    };
  }

  private getPriorityChartData() {
    const labels = Object.keys(this.tasksByStatus);
    const data = Object.values(this.tasksByStatus);
    const backgroundColors = [
      'rgba(239, 68, 68, 0.5)',   // Red
      'rgba(245, 158, 11, 0.5)',  // Yellow
      'rgba(59, 130, 246, 0.5)',  // Blue
      'rgba(16, 185, 129, 0.5)'   // Green
    ];

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.5', '1')),
        borderWidth: 1
      }]
    };
  }
} 