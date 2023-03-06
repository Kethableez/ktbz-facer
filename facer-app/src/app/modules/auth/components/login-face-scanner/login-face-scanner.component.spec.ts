import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFaceScannerComponent } from './login-face-scanner.component';

describe('LoginFaceScannerComponent', () => {
  let component: LoginFaceScannerComponent;
  let fixture: ComponentFixture<LoginFaceScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginFaceScannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginFaceScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
