import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmStatus } from './confirm-status';

describe('ConfirmStatus', () => {
  let component: ConfirmStatus;
  let fixture: ComponentFixture<ConfirmStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
