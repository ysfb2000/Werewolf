import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameListComponent } from './game-list.component';
import { Edition } from '../../shared/models/edition';
import { Role } from '../../shared/models/role';
import { RoleCodeType } from '../../shared/enums';
import { Story } from '../../shared/models/story';

describe('GameListComponent', () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  beforeEach(() => {
    localStorage.clear();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads stories from localStorage on init', () => {
    const roles = Role.loadDefaultRoles();
    const villager = roles.find((role) => role.roleType === RoleCodeType.Villager)!;
    const werewolf = roles.find((role) => role.roleType === RoleCodeType.Werewolf)!;
    const edition = new Edition('Spec Edition', [villager, werewolf], {});

    new Story('Stored Game', edition);

    component.ngOnInit();

    expect(component.storyList.length).toBe(1);
    expect(component.storyList[0].storyName).toBe('Stored Game');
  });
});
