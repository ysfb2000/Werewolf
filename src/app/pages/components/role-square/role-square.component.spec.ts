import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSquareComponent } from './role-square.component';

describe('RoleSquareComponent', () => {
  let component: RoleSquareComponent;
  let fixture: ComponentFixture<RoleSquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleSquareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
