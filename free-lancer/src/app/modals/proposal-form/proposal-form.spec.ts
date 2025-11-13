import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalForm } from './proposal-form';

describe('ProposalForm', () => {
  let component: ProposalForm;
  let fixture: ComponentFixture<ProposalForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
