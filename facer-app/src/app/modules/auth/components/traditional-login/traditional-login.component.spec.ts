import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraditionalLoginComponent } from './traditional-login.component';

describe('TraditionalLoginComponent', () => {
  let component: TraditionalLoginComponent;
  let fixture: ComponentFixture<TraditionalLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraditionalLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraditionalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
