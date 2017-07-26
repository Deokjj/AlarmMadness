import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgSnackComponent } from './msg-snack.component';

describe('MsgSnackComponent', () => {
  let component: MsgSnackComponent;
  let fixture: ComponentFixture<MsgSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsgSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
