import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JumpTotheMainPageComponent } from './jump-tothe-main-page.component';

describe('JumpTotheMainPageComponent', () => {
  let component: JumpTotheMainPageComponent;
  let fixture: ComponentFixture<JumpTotheMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JumpTotheMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JumpTotheMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
