import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTabContentComponent } from './grid-tab-content.component';

describe('GridTabContentComponent', () => {
  let component: GridTabContentComponent;
  let fixture: ComponentFixture<GridTabContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridTabContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
