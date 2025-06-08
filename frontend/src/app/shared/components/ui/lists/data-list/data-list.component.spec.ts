import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataListComponent } from './data-list.component';
import { ButtonComponent } from '../../buttons/button/button.component';
import { LoadingStateComponent } from '../../loading-state/loading-state.component';
import { EmptyStateComponent } from '../../empty-state/empty-state.component';

describe('DataListComponent', () => {
  let component: DataListComponent;
  let fixture: ComponentFixture<DataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DataListComponent,
        ButtonComponent,
        LoadingStateComponent,
        EmptyStateComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataListComponent);
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

  it('should display empty state when there are no items', () => {
    component.items = [];
    component.isLoading = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-empty-state')).toBeTruthy();
  });

  it('should display list items when there are items', () => {
    component.items = [{ id: 1, name: 'Test Item' }];
    component.isLoading = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.space-y-2')).toBeTruthy();
  });

  it('should handle item selection', () => {
    const selectionSpy = spyOn(component.onSelectionChange, 'emit');
    component.items = [{ id: 1, name: 'Test Item' }];
    component.selectable = true;
    fixture.detectChanges();
    
    const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]');
    checkbox.click();
    fixture.detectChanges();
    
    expect(selectionSpy).toHaveBeenCalledWith([{ id: 1, name: 'Test Item' }]);
  });

  it('should handle select all', () => {
    const selectionSpy = spyOn(component.onSelectionChange, 'emit');
    component.items = [
      { id: 1, name: 'Test Item 1' },
      { id: 2, name: 'Test Item 2' }
    ];
    component.selectable = true;
    fixture.detectChanges();
    
    const selectAllCheckbox = fixture.nativeElement.querySelector('input[type="checkbox"]');
    selectAllCheckbox.click();
    fixture.detectChanges();
    
    expect(selectionSpy).toHaveBeenCalledWith([
      { id: 1, name: 'Test Item 1' },
      { id: 2, name: 'Test Item 2' }
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