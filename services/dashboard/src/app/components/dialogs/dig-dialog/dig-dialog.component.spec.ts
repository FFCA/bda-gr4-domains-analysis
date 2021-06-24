import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigDialogComponent } from './dig-dialog.component';

describe('DigDialogComponent', () => {
  let component: DigDialogComponent;
  let fixture: ComponentFixture<DigDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
