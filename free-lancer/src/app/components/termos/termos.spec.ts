import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Termos } from './termos';

describe('Termos', () => {
  let component: Termos;
  let fixture: ComponentFixture<Termos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Termos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Termos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
