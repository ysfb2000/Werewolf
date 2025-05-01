import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSettingComponent } from './player-setting.component';

describe('PlayerSettingComponent', () => {
  let component: PlayerSettingComponent;
  let fixture: ComponentFixture<PlayerSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
