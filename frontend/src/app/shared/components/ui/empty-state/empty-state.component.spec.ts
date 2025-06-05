import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';
import { ButtonComponent } from '../../buttons/button/button.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent, ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title and description', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('No data available');
    expect(compiled.textContent).toContain('There is no data to display at this time.');
  });

  it('should display custom title and description', () => {
    component.title = 'Custom Title';
    component.description = 'Custom Description';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Custom Title');
    expect(compiled.textContent).toContain('Custom Description');
  });

  it('should display action button when action is provided', () => {
    component.action = {
      label: 'Test Action',
      onClick: () => {}
    };
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Action');
  });
}); 