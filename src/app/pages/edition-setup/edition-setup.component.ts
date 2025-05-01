import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { RoleSquareComponent } from "../components/role-square/role-square.component";
import { Role } from '../../shared/models/role';
import { CampType, RoleCodeType, SpecialRulesType } from '../../shared/enums';
import { MessageBoxComponent } from "../components/message-box/message-box.component";
import { Edition } from '../../shared/models/edition';
import { ConfirmBoxComponent } from "../components/confirm-box/confirm-box.component";
import { defaultEdition } from '../../shared/defaultEdition';

@Component({
  selector: 'app-edition-setup',
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    RoleSquareComponent,
    MessageBoxComponent,
    ConfirmBoxComponent
],
  templateUrl: './edition-setup.component.html',
  styleUrl: './edition-setup.component.less'
})
export class EditionSetupComponent {
  editionName: string = '';
  sr1: boolean = false;
  url: string = '';

  roleList: Role[] = [];
  specialRules: SpecialRulesType[] = [];

  selectedSpecialRules: { [rule: string]: boolean } = {
    [SpecialRulesType.Police]: false,
    [SpecialRulesType.Police15]: false,
    [SpecialRulesType.WinAsAllPowerPersonDie]: false,
    [SpecialRulesType.WinAsAllVillagerDie]: false,
    [SpecialRulesType.WolfCanNotAttackFirstNight]: false,
    [SpecialRulesType.HunterCanShoot]: false,
    [SpecialRulesType.WitchCanSaveSelfFirstNight]: false
  };

  villagerCount: number = 0;
  wolfCount: number = 0;
  neturalsCount: number = 0;

  isDefault: string = '0';

  @ViewChild('myModal', { static: false }) myModal!: MessageBoxComponent;
  @ViewChild('confirmBox', { static: false }) myConfirm!: ConfirmBoxComponent;

  constructor(private router: Router) {}

  ngOnInit() {

    this.roleList = Role.loadDefaultRoles();
    this.roleList = this.roleList.filter((r) => r.roleType !== RoleCodeType.UnKnown);

    // Check if editionName is passed in the URL
    const urlParams = new URLSearchParams(window.location.search);
    this.editionName = urlParams.get('editionName') ?? '';
    this.isDefault = urlParams.get('isDefault') ?? '0';

    if (this.editionName) {
      let editionJson: string = '';
      
      if (this.isDefault != 'true') 
      {
        editionJson = localStorage.getItem('edition') ?? '';
      } else {
        editionJson = defaultEdition;
      }

      if (editionJson) {
        const editions: Edition[] = JSON.parse(editionJson);
        const edition = editions.find((e) => e.editionName === this.editionName);
        if (edition) {
          
          edition.player.forEach((player) => {
            const role = this.roleList.find((r) => r.roleType === player.role);
            if (role) {
              role.selectedCount = player.number;
            }
          });

          edition.editionSpecialRules.forEach((rule) => {
              this.selectedSpecialRules[rule] = true;
          });
        }
      }

      this.roleNumberChange();
    }

    
  }

  reset() {
    alert('重置');
  }

  deleteEdition() {
    this.myConfirm.show("确定删除该版本吗？");
  }

  delete() {
    // Delete the edition from localStorage
    const editionJson = localStorage.getItem('edition');
    if (editionJson) {
      const editions: Edition[] = JSON.parse(editionJson);
      const updatedEditions = editions.filter((e) => e.editionName !== this.editionName);
      localStorage.setItem('edition', JSON.stringify(updatedEditions));
    }
    this.myConfirm.close();
    this.router.navigate(['/edition-list']);
  }

  create() {
    if (this.editionName === '') {
      this.myModal.show("请输入版本名称!");
      return;
    }

    if (this.villagerCount < 1) {
      this.myModal.show("请至少选择一个村民阵营角色!");
      return;
    }

    if (this.wolfCount < 1) {
      this.myModal.show("请至少选择一个狼阵营角色!");
      return;
    }

    var edition = new Edition(this.editionName, this.roleList, this.selectedSpecialRules);
    
    edition.saveToLocalStorage(edition);
    this.url = '/edition-list';
    this.myModal.show("版本创建成功!");
    
  }

  back() {
    this.router.navigate(['/edition-list']);
  }

  roleNumberChange() {

    this.villagerCount = 0;
    this.wolfCount = 0;
    this.neturalsCount = 0;


    this.roleList.forEach((r) => {
      if (r.camp === CampType.Villager) {
        this.villagerCount += r.selectedCount;
      } else if (r.camp === CampType.Werewolf) {

        this.wolfCount += r.selectedCount;
      } else if (r.camp === CampType.Neutral) {
        this.neturalsCount += r.selectedCount;
      }
    });
  }

  get isShowHunterRule() {
    return this.roleList.some((r) => r.roleType === RoleCodeType.Hunter && r.selectedCount > 0);
  }

  get isShowWitchRule() {
    return this.roleList.some((r) => r.roleType === RoleCodeType.Witch && r.selectedCount > 0);
  }


}
