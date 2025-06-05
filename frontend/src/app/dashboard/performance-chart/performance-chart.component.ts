import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-performance-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-[400px]">
      <canvas #performanceChart></canvas>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PerformanceChartComponent implements AfterViewInit {
  @ViewChild('performanceChart') chartRef!: ElementRef<HTMLCanvasElement>;
  @Input() teamPerformance: { team: string; performance: number }[] = [];

  private chart: Chart | null = null;

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: this.teamPerformance.map(item => item.team),
      datasets: [{
        label: 'Team Performance',
        data: this.teamPerformance.map(item => item.performance),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    };

    this.chart = new Chart(ctx, {
      type: 'line',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleColor: '#fff',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyColor: '#fff',
            bodyFont: {
              size: 13
            },
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              callback: (value) => `${value}%`
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
} 