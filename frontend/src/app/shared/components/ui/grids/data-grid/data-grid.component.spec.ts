import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataGridComponent } from './data-grid.component';
import { ButtonComponent } from '../../buttons/button/button.component';
import { LoadingStateComponent } from '../../loading-state/loading-state.component';
import { EmptyStateComponent } from '../../empty-state/empty-state.component';

describe('DataGridComponent', () => {
  let component: DataGridComponent;
  let fixture: ComponentFixture<DataGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DataGridComponent,
        ButtonComponent,
        LoadingStateComponent,
        EmptyStateComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataGridComponent);
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
    component.data = [];
    component.isLoading = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-empty-state')).toBeTruthy();
  });

  it('should display grid content when there is data', () => {
    component.data = [{ id: 1, name: 'Test' }];
    component.isLoading = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('table')).toBeTruthy();
  });

  it('should handle pagination correctly', () => {
    component.data = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
    component.paginationConfig = {
      page: 1,
      pageSize: 10,
      totalItems: 25
    };
    fixture.detectChanges();
    expect(component.paginatedData.length).toBe(10);
    expect(component.totalPages).toBe(3);
  });

  it('should handle sorting correctly', () => {
    const sortSpy = spyOn(component.onSort, 'emit');
    component.columns = [{ key: 'name', label: 'Name', sortable: true }];
    component.sort('name');
    expect(sortSpy).toHaveBeenCalledWith({ key: 'name', direction: 'asc' });
  });

  it('should handle filtering correctly', () => {
    const filterSpy = spyOn(component.onFilter, 'emit');
    component.applyFilter('name', { target: { value: 'test' } });
    expect(filterSpy).toHaveBeenCalled();
  });
}); 