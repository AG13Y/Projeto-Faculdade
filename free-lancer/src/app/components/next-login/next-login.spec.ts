import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextLogin } from './next-login';

describe('NextLogin', () => {
  let component: NextLogin;
  let fixture: ComponentFixture<NextLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
