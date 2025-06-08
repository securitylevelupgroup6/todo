import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../buttons/button/button.component';
import { LoadingStateComponent } from '../../loading-state/loading-state.component';
import { EmptyStateComponent } from '../../empty-state/empty-state.component';
import Chart from 'chart.js/auto';

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter';

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
  pointBackgroundColor?: string | string[];
  pointBorderColor?: string | string[];
  pointHoverBackgroundColor?: string | string[];
  pointHoverBorderColor?: string | string[];
  type?: ChartType;
  yAxisID?: string;
  xAxisID?: string;
  hidden?: boolean;
}

interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      enabled?: boolean;
      mode?: 'index' | 'dataset' | 'point' | 'nearest' | 'x' | 'y';
    };
    title?: {
      display?: boolean;
      text?: string;
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
      stacked?: boolean;
    };
    y?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
      stacked?: boolean;
    };
  };
  animation?: {
    duration?: number;
    easing?: 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart' | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint' | 'easeInSine' | 'easeOutSine' | 'easeInOutSine' | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo' | 'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc' | 'easeInElastic' | 'easeOutElastic' | 'easeInOutElastic' | 'easeInBack' | 'easeOutBack' | 'easeInOutBack' | 'easeInBounce' | 'easeOutBounce' | 'easeInOutBounce';
  };
}

@Component({
  selector: 'app-data-chart',
  standalone: true,
  imports: [CommonModule, ButtonComponent, LoadingStateComponent, EmptyStateComponent],
  templateUrl: './data-chart.component.html',
  styleUrls: ['./data-chart.component.scss']
})
export class DataChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() title = '';
  @Input() description = '';
  @Input() type: ChartType = 'line';
  @Input() labels: string[] = [];
  @Input() datasets: ChartDataset[] = [];
  @Input() options: ChartOptions = {};
  @Input() height = 400;
  @Input() showTypeSelector = true;
  @Input() showDownload = true;
  @Input() showLegend = true;
  @Input() emptyStateMessage = 'No data available to display.';
  @Input() emptyStateTitle = 'No data available';
  @Input() emptyStateAction?: { label: string; onClick: () => void };
  @Input() isLoading = false;
  @Input() loadingMessage = 'Loading chart data...';

  @Output() onTypeChange = new EventEmitter<ChartType>();
  @Output() onDataClick = new EventEmitter<{ datasetIndex: number; index: number; value: number }>();

  availableTypes: ChartType[] = ['line', 'bar', 'pie', 'doughnut', 'radar', 'polarArea', 'bubble', 'scatter'];
  private chart: Chart | null = null;

  ngOnInit(): void {
    // Initialize any required setup
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(): void {
    if (!this.chartCanvas || !this.datasets.length) {
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    // Destroy existing chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Create new chart
    this.chart = new Chart(ctx, {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: this.datasets
      },
      options: {
        ...this.options,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const { datasetIndex, index } = elements[0];
            const value = this.datasets[datasetIndex].data[index];
            this.onDataClick.emit({ datasetIndex, index, value });
          }
        }
      }
    });
  }

  changeType(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newType = select.value as ChartType;
    this.type = newType;
    this.onTypeChange.emit(newType);
    this.createChart();
  }

  downloadChart(): void {
    if (!this.chart) {
      return;
    }

    const link = document.createElement('a');
    link.download = `${this.title.toLowerCase().replace(/\s+/g, '-')}-chart.png`;
    link.href = this.chartCanvas.nativeElement.toDataURL('image/png');
    link.click();
  }

  updateData(newData: { labels?: string[]; datasets?: ChartDataset[] }): void {
    if (newData.labels) {
      this.labels = newData.labels;
    }
    if (newData.datasets) {
      this.datasets = newData.datasets;
    }
    this.createChart();
  }

  updateOptions(newOptions: ChartOptions): void {
    this.options = { ...this.options, ...newOptions };
    this.createChart();
  }

  toggleDataset(index: number): void {
    if (this.chart && this.datasets[index]) {
      const meta = this.chart.getDatasetMeta(index);
      meta.hidden = !meta.hidden;
      this.chart.update();
    }
  }
} 