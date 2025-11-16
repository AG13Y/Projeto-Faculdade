import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingForm } from './meeting-form';

describe('MeetingForm', () => {
  let component: MeetingForm;
  let fixture: ComponentFixture<MeetingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
