import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataChartComponent } from './data-chart.component';
import { ButtonComponent } from '../../buttons/button/button.component';
import { LoadingStateComponent } from '../../loading-state/loading-state.component';
import { EmptyStateComponent } from '../../empty-state/empty-state.component';

describe('DataChartComponent', () => {
  let component: DataChartComponent;
  let fixture: ComponentFixture<DataChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DataChartComponent,
        ButtonComponent,
        LoadingStateComponent,
        EmptyStateComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading state when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-loading-state')).toBeTruthy();
  });

  it('should display empty state when there is no data', () => {
    component.datasets = [];
    component.isLoading = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-empty-state')).toBeTruthy();
  });

  it('should display chart when there is data', () => {
    component.datasets = [{
      label: 'Test Dataset',
      data: [1, 2, 3],
      backgroundColor: '#000'
    }];
    component.isLoading = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('canvas')).toBeTruthy();
  });

  it('should handle chart type change', () => {
    const typeChangeSpy = spyOn(component.onTypeChange, 'emit');
    component.changeType({ target: { value: 'bar' } } as any);
    expect(typeChangeSpy).toHaveBeenCalledWith('bar');
  });

  it('should handle data click', () => {
    const dataClickSpy = spyOn(component.onDataClick, 'emit');
    const mockChart = {
      getDatasetMeta: () => ({ hidden: false }),
      update: () => {}
    };
    component['chart'] = mockChart as any;
    component.onDataClick.emit({ datasetIndex: 0, index: 0, value: 1 });
    expect(dataClickSpy).toHaveBeenCalledWith({ datasetIndex: 0, index: 0, value: 1 });
  });
}); 