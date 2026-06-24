import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
  isEditionPickerOpen: boolean = false;

  editionList: Edition[] = [];

  currentEdition: Edition | undefined;

  villagerRoles: any[] = [];
  werewolfRoles: any[] = [];
  netralRoles: any[] = [];

  rules: any[] = [];

  @ViewChild('myModal', { static: false }) myModal!: MessageBoxComponent;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private elementRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit() {
    // Initialize any data or state here if needed
    this.editionList = Edition.loadAllEditions();
    // generate a random game name depending on the current time
    const currentTime = new Date();
    // format the time to a string
    const formatTime = this.datePipe.transform(currentTime, 'yyMMdd-HH:mm');

    this.gameName = `Game-${formatTime}`;

    if (this.editionList.length > 0) {
      const defaultEdition = this.editionList.find((item) => item.editionName === this.selectedVersion);
      const initialEdition = defaultEdition ?? this.editionList[0];
      this.selectedVersion = initialEdition.editionName;
      this.onEditionChange(this.selectedVersion);
    }

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

  openEditionPicker() {
    this.isEditionPickerOpen = true;
  }

  toggleEditionPicker() {
    this.isEditionPickerOpen = !this.isEditionPickerOpen;
  }

  closeEditionPicker() {
    this.isEditionPickerOpen = false;
  }

  get selectedEdition() {
    return this.editionList.find((item) => item.editionName === this.selectedVersion);
  }

  selectEdition(editionName: string) {
    this.selectedVersion = editionName;
    this.onEditionChange(editionName);
    this.closeEditionPicker();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isEditionPickerOpen) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeEditionPicker();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.closeEditionPicker();
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
