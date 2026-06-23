import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CampType } from '../../shared/enums';
import { Role } from '../../shared/models/role';

@Component({
  selector: 'app-game-manual',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game-manual.component.html',
  styleUrl: './game-manual.component.less'
})
export class GameManualComponent {
  protected readonly villagerRoles = this.getRolesByCamp(CampType.Villager);
  protected readonly werewolfRoles = this.getRolesByCamp(CampType.Werewolf);
  protected readonly neutralRoles = this.getRolesByCamp(CampType.Neutral);

  protected readonly dayFlow: string[] = [
    '天亮后公布夜间结果，若板子包含警长、熊等特殊流程，则按对应顺序执行。',
    '白天玩家依次发言、盘逻辑、找狼，部分角色可以在白天发动技能。',
    '发言结束后进入放逐投票，票型最高者出局；若有平票，则按板子规则进入PK或平安日。',
    '白天阶段结束后进入黑夜，狼人和神职按顺序行动，循环往复直至分出胜负。'
  ];

  protected readonly nightFlow: string[] = [
    '法官按角色行动顺序依次唤醒拥有夜间技能的玩家。',
    '狼人阵营通常在夜间选择击杀目标，部分特殊狼牌还有额外技能。',
    '预言家、女巫、守卫、摄梦人等角色在夜间完成查验、救毒、守护或控制。',
    '所有夜间技能结算后天亮，进入下一轮公开信息与讨论。'
  ];

  protected readonly winRules: string[] = [
    '好人阵营目标：放逐或击杀所有狼人阵营玩家。',
    '狼人阵营目标：让场上狼人数量达到与好人数量相同，或在规则结算后已无法被翻盘。',
    '第三方角色若存在，以其自身角色说明为准，例如情侣第三方或炸弹人单独胜利。',
    '涉及同时满足双方胜利条件时，通常遵循板子常见的“狼刀在先”或角色原文说明。'
  ];

  private getRolesByCamp(camp: CampType): Role[] {
    return Role.loadDefaultRoles().filter((role) => role.name !== '(未知)' && role.camp === camp);
  }
}
