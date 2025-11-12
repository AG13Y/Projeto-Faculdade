import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProject } from './delete-project';

describe('DeleteProject', () => {
  let component: DeleteProject;
  let fixture: ComponentFixture<DeleteProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteProject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
