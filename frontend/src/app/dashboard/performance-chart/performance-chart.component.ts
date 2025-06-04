import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { TeamPerformance } from '../../shared/models/dashboard.models';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-performance-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="bg-white rounded-lg shadow p-4">
      <header>
        <h2 class="text-xl font-semibold mb-4">Team Performance</h2>
      </header>
      <main class="h-64">
        <canvas #chartCanvas></canvas>
      </main>
    </section>
  `,
  styles: []
})
export class PerformanceChartComponent implements AfterViewInit {
  @Input() teamPerformance!: TeamPerformance[];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  private createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: this.getChartData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Completion Rate (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Teams'
            }
          }
        }
      }
    });
  }

  private updateChart() {
    if (!this.chart) return;

    const chartData = this.getChartData();
    this.chart.data.labels = chartData.labels;
    this.chart.data.datasets[0].data = chartData.datasets[0].data;
    this.chart.update();
  }

  private getChartData() {
    const labels = this.teamPerformance.map(team => team.teamName);
    const data = this.teamPerformance.map(team => team.completionRate);

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }]
    };
  }
} 