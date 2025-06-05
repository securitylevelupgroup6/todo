import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { ButtonComponent } from '../../buttons/button/button.component';
import { LoadingStateComponent } from '../../loading-state/loading-state.component';
import { EmptyStateComponent } from '../../empty-state/empty-state.component';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DataTableComponent,
        ButtonComponent,
        LoadingStateComponent,
        EmptyStateComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
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

  it('should display table when there is data', () => {
    component.data = [{ id: 1, name: 'Test' }];
    component.columns = [{ key: 'name', label: 'Name' }];
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

  it('should handle row selection', () => {
    const selectionSpy = spyOn(component.onSelectionChange, 'emit');
    component.data = [{ id: 1, name: 'Test' }];
    component.selectable = true;
    fixture.detectChanges();
    
    const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]');
    checkbox.click();
    fixture.detectChanges();
    
    expect(selectionSpy).toHaveBeenCalledWith([{ id: 1, name: 'Test' }]);
  });

  it('should handle select all', () => {
    const selectionSpy = spyOn(component.onSelectionChange, 'emit');
    component.data = [
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' }
    ];
    component.selectable = true;
    fixture.detectChanges();
    
    const selectAllCheckbox = fixture.nativeElement.querySelector('input[type="checkbox"]');
    selectAllCheckbox.click();
    fixture.detectChanges();
    
    expect(selectionSpy).toHaveBeenCalledWith([
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' }
    ]);
  });

  it('should handle refresh', () => {
    const refreshSpy = spyOn(component.onRefresh, 'emit');
    component.showRefresh = true;
    fixture.detectChanges();
    
    const refreshButton = fixture.nativeElement.querySelector('app-button');
    refreshButton.click();
    fixture.detectChanges();
    
    expect(refreshSpy).toHaveBeenCalled();
  });
}); 