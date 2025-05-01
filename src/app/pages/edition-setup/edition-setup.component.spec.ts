import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionSetupComponent } from './edition-setup.component';

describe('EditionSetupComponent', () => {
  let component: EditionSetupComponent;
  let fixture: ComponentFixture<EditionSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditionSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
