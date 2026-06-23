import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PlayerComponent } from '../components/player/player.component';
import { PowerType, RoleCodeType, StoryStatusType } from '../../shared/enums';
import { GameEvent } from '../../shared/models/event';
import { Info } from '../../shared/models/info';
import { Player } from '../../shared/models/player';
import { Story } from '../../shared/models/story';
import { StoryFlow } from './story-flow';
import { ConfirmBoxComponent } from '../components/confirm-box/confirm-box.component';

@Component({
  selector: 'app-story',
  imports: [
    RouterModule,
    PlayerComponent,
    CommonModule,
    ConfirmBoxComponent
  ],
  templateUrl: './story.component.html',
  styleUrl: './story.component.less'
})
export class StoryComponent implements AfterViewChecked {
  @ViewChild('messagebox') private logContainer!: ElementRef;
  @ViewChild('confirmBox', { static: false }) confirmBox!: ConfirmBoxComponent;

  gameName = '';
  currentStory: Story | null = null;
  playerList: Player[] = [];
  infos: Info[] = [];

  skill: PowerType = PowerType.BloodMoonSelfDestruction;
  selectCount = 0;

  private storyFlow: StoryFlow | null = null;

  constructor(private router: Router) {}

  get infoList(): Info[] {
    this.infos = [];

    this.currentStory?.edition.getRoleList().forEach((role) => {
      if (!this.currentStory || role.roleType === RoleCodeType.UnKnown) {
        return;
      }

      const info = new Info();
      info.RoleType = role.roleType;
      info.livingNumber = this.currentStory.player.filter((p) => p.role?.roleType === role.roleType).length;
      info.TotalNumber = this.currentStory.edition.player.filter((p) => p.role === role.roleType)[0]?.number || 0;

      if (info.TotalNumber > 0) {
        this.infos.push(info);
      }
    });

    return this.infos;
  }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.gameName = urlParams.get('gameName') ?? '';

    if (!this.gameName) {
      return;
    }

    this.currentStory = Story.loadStoryListFromLocalStorage(this.gameName);
    if (!this.currentStory) {
      this.router.navigate(['/home']);
      return;
    }

    this.playerList = this.currentStory.player;
    this.storyFlow = new StoryFlow(this.currentStory);
    localStorage.setItem('currentStoryName', this.gameName);
  }

  previous(): void {
    this.storyFlow?.previous();
  }

  next(): void {
    this.storyFlow?.next();
  }

  eventHandle(event: GameEvent): void {
    this.storyFlow?.handleEvent(event);
  }

  scrollToBottom(): void {
    try {
      this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
    } catch {
      // Ignore missing view child during initial render.
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  showSpecialRules(): void {
    alert(this.currentStory?.edition.editionSpecialRules.map((rule) => rule).join('\r\n'));
  }

  finishGame(): void {
    if (!this.currentStory) {
      return;
    }

    this.currentStory.status = StoryStatusType.Ended;
    this.currentStory.endTime = new Date();
    this.currentStory.saveToLocalStorage();
    this.router.navigate(['/home']);
  }

  confirmDeleteGame(): void {
    this.confirmBox.show('确定删除这局游戏吗？');
  }

  deleteGame(): void {
    if (!this.currentStory) {
      return;
    }

    Story.deleteFromLocalStorage(this.currentStory.storyName);
    this.confirmBox.close();
    this.router.navigate(['/home']);
  }
}
