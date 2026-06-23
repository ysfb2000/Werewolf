import { Edition } from './edition';
import { Role } from './role';
import { RoleCodeType } from '../enums';
import { Story } from './story';

describe('Story', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('rehydrates a saved story without resetting its state', () => {
    const roles = Role.loadDefaultRoles();
    const villager = roles.find((role) => role.roleType === RoleCodeType.Villager)!;
    const werewolf = roles.find((role) => role.roleType === RoleCodeType.Werewolf)!;

    villager.selectedCount = 2;
    werewolf.selectedCount = 1;

    const edition = new Edition('Spec Edition', [villager, werewolf], {});
    const originalStory = new Story('Saved Story', edition);

    originalStory.step = 4;
    originalStory.stages = 3;
    originalStory.isNight = false;
    originalStory.history.push('existing history');
    originalStory.player[0].isDead = true;
    originalStory.player[0].role = villager;
    originalStory.player[1].role = werewolf;
    originalStory.saveToLocalStorage();

    const persistedBeforeLoad = localStorage.getItem('storylist');
    const loadedStory = Story.loadStoryListFromLocalStorage('Saved Story');
    const persistedAfterLoad = localStorage.getItem('storylist');

    expect(loadedStory).not.toBeNull();
    expect(loadedStory!.step).toBe(4);
    expect(loadedStory!.stages).toBe(3);
    expect(loadedStory!.isNight).toBeFalse();
    expect(loadedStory!.history).toEqual(['existing history']);
    expect(loadedStory!.player[0].isDead).toBeTrue();
    expect(loadedStory!.player[0].role?.roleType).toBe(RoleCodeType.Villager);
    expect(loadedStory!.player[1].role?.roleType).toBe(RoleCodeType.Werewolf);
    expect(loadedStory!.edition.getRoleList().some((role) => role.roleType === RoleCodeType.Werewolf)).toBeTrue();
    expect(persistedAfterLoad).toBe(persistedBeforeLoad);
  });

  it('loads stories from the lowercase storylist key', () => {
    const roles = Role.loadDefaultRoles();
    const villager = roles.find((role) => role.roleType === RoleCodeType.Villager)!;
    const werewolf = roles.find((role) => role.roleType === RoleCodeType.Werewolf)!;
    const edition = new Edition('Lowercase Key Edition', [villager, werewolf], {});

    new Story('Lowercase Story', edition);
    localStorage.removeItem('StoryList');

    const loadedStories = Story.loadAllStoriesFromLocalStorage();

    expect(localStorage.getItem('storylist')).not.toBeNull();
    expect(loadedStories.some((story) => story.storyName === 'Lowercase Story')).toBeTrue();
  });

  it('deletes a saved story and clears currentStoryName when needed', () => {
    const roles = Role.loadDefaultRoles();
    const villager = roles.find((role) => role.roleType === RoleCodeType.Villager)!;
    const werewolf = roles.find((role) => role.roleType === RoleCodeType.Werewolf)!;
    const edition = new Edition('Delete Edition', [villager, werewolf], {});

    new Story('Keep Story', edition);
    new Story('Delete Story', edition);
    localStorage.setItem('currentStoryName', 'Delete Story');

    Story.deleteFromLocalStorage('Delete Story');

    const loadedStories = Story.loadAllStoriesFromLocalStorage();

    expect(loadedStories.some((story) => story.storyName === 'Delete Story')).toBeFalse();
    expect(loadedStories.some((story) => story.storyName === 'Keep Story')).toBeTrue();
    expect(localStorage.getItem('currentStoryName')).toBeNull();
  });
});
