import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit false when sidebarOpenChange is triggered', () => {
    spyOn(component.sidebarOpenChange, 'emit');
    component.sidebarOpenChange.emit(false);
    expect(component.sidebarOpenChange.emit).toHaveBeenCalledWith(false);
  });

  it('should check if path is active', () => {
    const mockPath = '/test';
    Object.defineProperty(window, 'location', {
      value: { pathname: mockPath },
      writable: true
    });
    expect(component.isActive(mockPath)).toBeTrue();
  });
}); 