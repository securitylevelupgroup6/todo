import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default variant and size', () => {
    expect(component.variant).toBe('primary');
    expect(component.size).toBe('md');
  });

  it('should apply correct classes for different variants', () => {
    const variants: ButtonComponent['variant'][] = ['primary', 'secondary', 'muted', 'destructive', 'outline', 'ghost', 'link'];
    variants.forEach(variant => {
      component.variant = variant;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button.className).toContain(variant);
    });
  });

  it('should apply correct classes for different sizes', () => {
    const sizes: ButtonComponent['size'][] = ['sm', 'md', 'lg'];
    sizes.forEach(size => {
      component.size = size;
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button.className).toContain(size);
    });
  });

  it('should show loading spinner when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const spinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });

  it('should emit click event when clicked', () => {
    const clickSpy = spyOn(component.onClick, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should be disabled when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTruthy();
  });

  it('should be disabled when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTruthy();
  });
}); 