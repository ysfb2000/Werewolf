import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Edition } from '../../shared/models/edition';
import { DatePipe } from '@angular/common';
import { MessageBoxComponent } from "../components/message-box/message-box.component";
import { Story } from '../../shared/models/story';


@Component({
  selector: 'app-create-game',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MessageBoxComponent
],
  providers: [DatePipe],
  templateUrl: './create-game.component.html',
  styleUrl: './create-game.component.less'
})
export class CreateGameComponent {
  gameName: string = '';
  selectedVersion: string = 'Werewolf';

  editionList: Edition[] = [];

  currentEdition: Edition | undefined;

  villagerRoles: any[] = [];
  werewolfRoles: any[] = [];
  netralRoles: any[] = [];

  rules: any[] = [];

  @ViewChild('myModal', { static: false }) myModal!: MessageBoxComponent;

  constructor(private router: Router, private datePipe: DatePipe) { }

  ngOnInit() {
    // Initialize any data or state here if needed
    this.editionList = Edition.loadAllEditions();
    // generate a random game name depending on the current time
    const currentTime = new Date();
    // format the time to a string
    const formatTime = this.datePipe.transform(currentTime, 'yyMMdd-HH:mm');

    this.gameName = `Game-${formatTime}`;

  }

  back() {
    this.router.navigate(['/home']);
  }

  onEditionChange(editionName: string) {
    this.villagerRoles = [];
    this.werewolfRoles = [];
    this.netralRoles = [];
    this.rules = [];

    const edition = Edition.loadEdition(editionName);

    if (edition) {
      this.currentEdition = edition;
      this.villagerRoles = edition.player.filter((role) => role.camp === 'Villager').map((role) => { return { name: role.role, count: role.number }});
      this.werewolfRoles = edition.player.filter((role) => role.camp === 'Werewolf').map((role) => { return { name: role.role, count: role.number }});
      this.netralRoles = edition.player.filter((role) => role.camp === 'Neutral').map((role) => { return { name: role.role, count: role.number }});

      edition.editionSpecialRules.forEach((rule) => {
        this.rules.push({ name: rule, selected: true });
      });
      
    } else {
      this.currentEdition = undefined;
    }

  }

  createGame() {
  
    if (this.gameName === '') {
      this.myModal.show('游戏名称不能为空！');
      return;
    }

    if (this.currentEdition === undefined) {
      this.myModal.show('请选择一个版本！');
      return;
    }

    new Story(this.gameName, this.currentEdition);

    this.router.navigate(['/story'], { queryParams: { gameName: this.gameName } });

  }

}
