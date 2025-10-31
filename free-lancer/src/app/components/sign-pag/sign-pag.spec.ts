import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignPag } from './sign-pag';

describe('SignPag', () => {
  let component: SignPag;
  let fixture: ComponentFixture<SignPag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignPag]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignPag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
