import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFaceScannerComponent } from './register-face-scanner.component';

describe('RegisterFaceScannerComponent', () => {
  let component: RegisterFaceScannerComponent;
  let fixture: ComponentFixture<RegisterFaceScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterFaceScannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFaceScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
