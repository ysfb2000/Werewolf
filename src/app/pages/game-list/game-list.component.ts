import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StoryStatusType } from '../../shared/enums';
import { Story } from '../../shared/models/story';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.less'
})
export class GameListComponent {
  storyList: Story[] = [];

  constructor(private router: Router, private datePipe: DatePipe) {}

  ngOnInit() {
    this.storyList = Story.loadAllStoriesFromLocalStorage();
  }

  onGameClick(storyName: string) {
    this.router.navigate(['/story'], { queryParams: { gameName: storyName } });
  }

  back() {
    this.router.navigate(['/home']);
  }

  getGameTime(story: Story): string {
    return this.datePipe.transform(story.startTime, 'yyyy-MM-dd HH:mm') ?? '';
  }

  getGameStatus(story: Story): string {
    if (story.status === StoryStatusType.Ended) {
      return '已结束';
    }

    if (story.status === StoryStatusType.InProgress) {
      return '进行中';
    }

    return '未开始';
  }

  getAliveStatus(story: Story): string {
    const aliveCount = story.player.filter((player) => !player.isDead).length;
    return `${aliveCount}/${story.player.length}`;
  }

  getRoleSummary(story: Story, camp: string): string {
    return story.edition.player
      .filter((role) => role.camp === camp)
      .map((role) => `${role.role}X${role.number}`)
      .join(' ');
  }
}
