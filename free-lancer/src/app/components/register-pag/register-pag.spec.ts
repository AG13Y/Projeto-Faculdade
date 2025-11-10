import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPag } from './register-pag';

describe('RegisterPag', () => {
  let component: RegisterPag;
  let fixture: ComponentFixture<RegisterPag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPag]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
