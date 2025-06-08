import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultifactorAuthenticationComponent } from './multifactor-authentication.component';

describe('MultifactorAuthenticationComponent', () => {
  let component: MultifactorAuthenticationComponent;
  let fixture: ComponentFixture<MultifactorAuthenticationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultifactorAuthenticationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultifactorAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
