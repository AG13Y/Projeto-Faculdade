import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatConfirm } from './chat-confirm';

describe('ChatConfirm', () => {
  let component: ChatConfirm;
  let fixture: ComponentFixture<ChatConfirm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatConfirm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatConfirm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
