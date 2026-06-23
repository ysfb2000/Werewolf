import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { StoryComponent } from './story.component';
import { Edition } from '../../shared/models/edition';
import { Role } from '../../shared/models/role';
import { Story } from '../../shared/models/story';
import { RoleCodeType } from '../../shared/enums';

describe('StoryComponent', () => {
  let component: StoryComponent;
  let fixture: ComponentFixture<StoryComponent>;
  let routerNavigateSpy: jasmine.Spy;

  beforeEach(async () => {
    localStorage.clear();
    window.history.replaceState({}, '', '/story?gameName=Delete%20Story');

    const routerStub = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [StoryComponent],
      providers: [
        { provide: Router, useValue: routerStub }
      ]
    })
    .compileComponents();

    const roles = Role.loadDefaultRoles();
    const villager = roles.find((role) => role.roleType === RoleCodeType.Villager)!;
    const werewolf = roles.find((role) => role.roleType === RoleCodeType.Werewolf)!;
    const edition = new Edition('Story Spec Edition', [villager, werewolf], {});

    new Story('Delete Story', edition);

    fixture = TestBed.createComponent(StoryComponent);
    component = fixture.componentInstance;
    routerNavigateSpy = TestBed.inject(Router).navigate as jasmine.Spy;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deletes the current game and navigates home', () => {
    component.deleteGame();

    expect(Story.loadStoryListFromLocalStorage('Delete Story')).toBeNull();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/home']);
  });
});
