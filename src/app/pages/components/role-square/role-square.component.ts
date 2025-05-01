import { CommonModule } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from '../../../shared/models/role';
import { RoleCodeType } from '../../../shared/enums';

@Component({
  selector: 'app-role-square',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './role-square.component.html',
  styleUrl: './role-square.component.less'
})
export class RoleSquareComponent {

  roleName = input<string>('');
  roleNumber = model<number>(0);

  add() {
    if (this.roleName() === RoleCodeType.Villager) {
    this.roleNumber.update((value) => value + 1);
    } else if (this.roleName() === RoleCodeType.Werewolf) {
      this.roleNumber.update((value) => value + 1);
    } else {
      if (this.roleNumber() < 1) {
        this.roleNumber.update(() => 1);
      }
    }
  }

  reset() {
    this.roleNumber.update(() => 0);
  }

}
