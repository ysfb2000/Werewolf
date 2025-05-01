import { CommonModule } from '@angular/common';
import { Component, ElementRef, output, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Modal } from 'bootstrap';
import { Role } from '../../../shared/models/role';
import { Story } from '../../../shared/models/story';
import { RoleCodeType } from '../../../shared/enums';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-setting',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './player-setting.component.html',
  styleUrl: './player-setting.component.less'
})
export class PlayerSettingComponent {















}
