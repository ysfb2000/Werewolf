import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayerComponent } from "../components/player/player.component";
import { Story } from '../../shared/models/story';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CampType, EventCodeType, PowerType, RoleCodeType, SpecialRulesType, StepType, StoryStatusType } from '../../shared/enums';
import { Player } from '../../shared/models/player';
import { Result } from '../../shared/models/result';
import { Info } from '../../shared/models/info';
import { GameEvent } from '../../shared/models/event';
import { not } from 'rxjs/internal/util/not';

@Component({
  selector: 'app-story',
  imports: [
    RouterModule,
    PlayerComponent,
    CommonModule
  ],
  templateUrl: './story.component.html',
  styleUrl: './story.component.less'
})
export class StoryComponent implements AfterViewChecked {

  @ViewChild('messagebox') private logContainer!: ElementRef;

  gameName: string = '';
  currentStory: Story | null = null;

  playerList: Player[] = []; // 玩家列表

  infos: Info[] = []; // 角色信息

  // 技能实施
  skill: PowerType = PowerType.BloodMoonSelfDestruction; // 技能类型
  selectCount: number = 0; // 选择的角色数量
  banPlayer: Player | undefined; // 被禁言的玩家

  constructor(private router: Router) { }

  get infoList(): Info[] {
    this.infos = [];

    this.currentStory?.edition.getRoleList().forEach(role => {
      var info: Info = new Info();
      if (role.roleType == RoleCodeType.UnKnown) {
        return;
      }
      info.RoleType = role.roleType;
      info.livingNumber = this.currentStory?.player.filter(p => p.role?.roleType == role.roleType).length || 0;
      info.TotalNumber = this.currentStory?.edition.player.filter(p => p.role == role.roleType)[0]?.number || 0;

      if (info.TotalNumber > 0) {
        this.infos.push(info);
      }
    });

    return this.infos;
  }

  ngOnInit() {
    // Check if editionName is passed in the URL
    const urlParams = new URLSearchParams(window.location.search);
    this.gameName = urlParams.get('gameName') ?? '';

    if (this.gameName) {
      this.currentStory = Story.loadStoryListFromLocalStorage(this.gameName);
      if (this.currentStory) {
        this.playerList = this.currentStory.player;
        localStorage.setItem('currentStoryName', this.gameName);
      } else {
        this.router.navigate(['/home']);
        return;
      }
    }



  }

  previous() {
    this.currentStory!.step -= 2;
    if (this.currentStory!.step < 1) {
      this.currentStory!.step = 1;
    }

    this.next();
  }

  isProccessed: boolean = false; // 是否处理过

  // 场景控制
  next() {
    if (this.currentStory?.isNight) {
      this.isProccessed = false;

      while (!this.isProccessed && this.currentStory?.step <= 100) {
        this.nightScene();
      }

    } else {

      var result: Result = new Result();

      // 白天场景
      switch (this.currentStory?.step) {
        case 1:
          this.showJudgeMessage('天亮了, 请睁眼!');

          if (this.currentStory?.isIncludeRole(RoleCodeType.Bear)) {
            this.showNotice('查看熊身边有没有狼，有则公布"熊咆哮了"，没有则公布"熊没咆哮"，熊已出局的话公布没咆哮', 0, RoleCodeType.Bear);
            this.showNotice('', 0, RoleCodeType.Bear);
          }

          if (this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.Elder && p.isDead == false)) {
            this.banPlayer = this.currentStory?.player.find(p => p.isCanNotSpeak && p.isDead == false);
            if (this.banPlayer) {
              this.showJudgeMessage(`${this.banPlayer.id}号玩家被禁言了`, 0, RoleCodeType.Elder);
              this.showNotice('', 0, RoleCodeType.Elder);
            }
          }


          this.settlement();
          this.showNotice('');
          // 结算是否结束游戏
          result = this.currentStory?.isEnd();

          if (result.isOK) {
            this.showJudgeMessage('游戏结束, 胜利阵营是:' + this.currentStory.winner, 0);
            this.showNotice(result.message, 0);
            this.showNotice('');
            this.currentStory!.saveToLocalStorage();
            return;
          }


          break;

        case 2:
          this.showJudgeMessage('请决定发言顺序', 0);
          this.showNotice('等待发言结束...', 0);
          this.showNotice('');
          break;

        case 3:
          this.showJudgeMessage('请大家投票选出驱逐谁', 0);
          this.showNotice('记录谁被驱逐了');
          this.showNotice('');
          break;

        case 4:
          this.showJudgeMessage('有没有需要发动的技能?', 0);
          this.showNotice('记录发动的技能', 0);
          this.showNotice('');
          break;

        case 5:
          // 结算是否结束游戏
          result = this.currentStory?.isEnd();

          if (result.isOK) {
            this.showJudgeMessage('游戏结束, 胜利阵营是:' + this.currentStory.winner, 0);
            this.showNotice(result.message, 0);
            this.showNotice('');
            this.currentStory!.saveToLocalStorage();
            return;
          } else {
            this.showJudgeMessage('游戏继续进行', 0);
            this.showNotice('');
          }

          // 清除所有可清除的状态
          this.currentStory?.player.filter(p => p.isDead != true).forEach(player => {
            if (player.isGuarded) {
              player.isGuarded = false;
              player.isGuardedPreviously = true;
            } else {
              player.isGuardedPreviously = false;
            }

            if (player.isSimulationGuarded) {
              player.isSimulationGuarded = false;
              player.isGuardedPreviously = true;
            } else {
              player.isGuardedPreviously = false;
            }

            if (player.isDreamed) {
              player.isDreamed = false;
              player.isDreamedPreviously = true;
            } else {
              player.isDreamedPreviously = false;
            }

            if (player.isFear) {
              player.isFear = false;
              player.isFearPreviously = true;
            } else {
              player.isFearPreviously = false;
            }

            player.isHealed = false;
            player.isPoisoned = false;
            player.isKilledByWolf = false;
            player.isKilledByDeamonHunter = false;
            player.isSilent = false;
            player.isGiveLuckyToWolf = false;
            player.isConfused = false;

            player.isCharmed = false;
            player.isCanNotSpeak = false;
            player.isCursed = false;
            player.isKillWrongPerson = false;

            if (player.role?.roleType == RoleCodeType.Hunter) {
              player.canShoot = true;
            }

          });
          break;

        case 6:
          this.showNotice('白天结束...', 0);
          this.currentStory!.isNight = true;
          this.currentStory!.stages += 1;
          this.currentStory!.step = 0;
          break;

        default:
          break;
      }

      this.currentStory!.step += 1;

    }

  }

  eventHandle(event: GameEvent) {
    switch (event.eventType) {
      case EventCodeType.KnightDuelFail:

        // 把骑士设置出局
        this.currentStory?.player.forEach(player => {
          if (player.role?.roleType == RoleCodeType.Knight) {
            player.isDead = true;
            this.showJudgeMessage(event.message, 0);
            this.showNotice('');
          }
        });
        break;

      case EventCodeType.DeamonHunterKillWrongPerson:
        // 把猎魔人设置错杀
        this.currentStory?.player.forEach(player => {
          if (player.role?.roleType == RoleCodeType.DeamonHunter) {
            player.isKillWrongPerson = true;
            this.showNotice(event.message, 0);
            this.showNotice('', 0);
          }
        });
        break;

      case EventCodeType.GiveLuckyToWolf:
        this.currentStory?.player.forEach(player => {
          if (player.role?.roleType == RoleCodeType.MiracleMerchant) {
            player.isGiveLuckyToWolf = true;
            this.showNotice(event.message, 0);
            this.showNotice('', 0);
          }
        });
        break;

      case EventCodeType.showJudgeMessage:
        this.showJudgeMessage(event.message, 0);
        this.showNotice('', 0);
        break;

      case EventCodeType.showNoticeMessage:
        this.showNotice(event.message, 0);
        this.showNotice('', 0);
        break;

      default:
        break;
    }
  }

  showJudgeMessage(message: string, showInStage: number = 0, role: RoleCodeType = RoleCodeType.UnKnown) {

    if (role != RoleCodeType.UnKnown) {
      if (!this.currentStory?.isIncludeRole(role)) {
        return;
      }
    }

    message = '<span class="judgeColor">法官:' + message + '</span>';

    if (this.currentStory?.stages == showInStage) {
      this.currentStory?.history.push(message);
      this.isProccessed = true;
    }

    if (showInStage == 2 && this.currentStory!.stages > 2) {
      this.currentStory?.history.push(message);
      this.isProccessed = true;
    }

    if (showInStage == 0) {
      this.currentStory?.history.push(message);
      this.isProccessed = true;
    }

    return;
  }

  showNotice(notice: string, showInStage: number = 0, role: RoleCodeType = RoleCodeType.UnKnown) {

    if (role != RoleCodeType.UnKnown) {
      if (!this.currentStory?.isIncludeRole(role)) {
        return;
      }
    }

    if (this.currentStory?.stages == showInStage) {
      this.currentStory?.history.push(notice);
      return;
    }

    if (showInStage == 2 && this.currentStory!.stages > 2) {
      this.currentStory?.history.push(notice);
      this.isProccessed = true;
    }

    if (showInStage == 0) {
      this.currentStory?.history.push(notice);
      return;
    }

    return;
  }


  nightScene() {
    // 夜晚场景
    switch (this.currentStory?.step) {
      case 1:
        this.showJudgeMessage('天黑请闭眼!');
        this.showNotice('');
        break;

      case 2:
        if (this.currentStory?.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectMiracleMerchant;
        }
        this.showJudgeMessage('奇迹商人请睁眼', 0, RoleCodeType.MiracleMerchant);
        this.showNotice('记录奇迹商人的号码', 1, RoleCodeType.MiracleMerchant);

        if (this.checkRoleIfDead(RoleCodeType.MiracleMerchant)) {
          this.showNotice('奇迹商人已出局', 0, RoleCodeType.MiracleMerchant);
        }

        this.showNotice('', 0, RoleCodeType.MiracleMerchant);
        break;

      case 3:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('是否选择幸运儿?', 0, RoleCodeType.MiracleMerchant);
        this.showNotice('记录幸运儿的号码，并记录给出的礼物', 0, RoleCodeType.MiracleMerchant);
        this.showNotice('', 0, RoleCodeType.MiracleMerchant);
        break;

      case 4:
        this.showJudgeMessage('奇迹商人请闭眼', 0, RoleCodeType.MiracleMerchant);
        this.showNotice('', 0, RoleCodeType.MiracleMerchant);
        break;

      case 5:
        this.showJudgeMessage('我现在绕场一周, 被我拍背的人就是幸运儿', 0, RoleCodeType.MiracleMerchant);
        this.showNotice('绕场一周, 拍背示意幸运儿', 0, RoleCodeType.MiracleMerchant);
        this.showNotice('', 0, RoleCodeType.MiracleMerchant);
        break;



      case 6:
        if (this.currentStory?.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectCupid;
        }
        this.showJudgeMessage('丘比特请睁眼', 1, RoleCodeType.Cupid);
        this.showNotice('记录丘比特的号码', 1, RoleCodeType.Cupid);
        this.showNotice('', 1, RoleCodeType.Cupid);
        break;

      case 7:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('请丘比特选择你要眷顾的两个人', 1, RoleCodeType.Cupid);
        this.showNotice('记录被眷顾的人的号码', 1, RoleCodeType.Cupid);
        this.showNotice('', 1, RoleCodeType.Cupid);
        break;

      case 8:
        this.showJudgeMessage('我现在绕场一周, 被我拍背的人就是情侣', 1, RoleCodeType.Cupid);
        this.showNotice('绕场一周, 拍背示意情侣', 1, RoleCodeType.Cupid);
        this.showNotice('', 1, RoleCodeType.Cupid);
        break;

      case 9:
        this.showJudgeMessage('请丘比特闭眼', 1, RoleCodeType.Cupid);
        this.showNotice('', 1, RoleCodeType.Cupid);
        break;

      case 10:
        this.showJudgeMessage('请情侣睁眼，相互确认', 1, RoleCodeType.Cupid);
        this.showNotice('记录情侣的号码', 1, RoleCodeType.Cupid);
        this.showNotice('', 1, RoleCodeType.Cupid);
        break;

      case 11:
        this.showJudgeMessage('请情侣闭眼', 1, RoleCodeType.Cupid);
        this.showNotice('', 1, RoleCodeType.Cupid);
        break;

      case 12:
        if (this.currentStory?.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectMechanicalWolf;
        }
        this.showJudgeMessage('机械狼请睁眼', 0, RoleCodeType.MechanicalWolf);
        this.showNotice('记录机械狼的号码', 1, RoleCodeType.MechanicalWolf);

        if (this.checkRoleIfDead(RoleCodeType.MechanicalWolf)) {
          this.showNotice('机械狼已出局', 0, RoleCodeType.MechanicalWolf);
        }

        this.showNotice('', 0, RoleCodeType.MechanicalWolf);
        break;

      case 13:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('机械狼是否使用技能', 2, RoleCodeType.MechanicalWolf);
        if (this.currentStory.isIncludeRole(RoleCodeType.MechanicalWolf)) {
          var currentPlayer = this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.MechanicalWolf && p.isDead == false);
          if (currentPlayer) {
            if (!this.currentStory?.player.find(p => p.camp == CampType.Werewolf && p.id != currentPlayer?.id && p.isDead == false)) {
              this.showNotice('机械狼是单狼, 示意可以刀人', 2, RoleCodeType.MechanicalWolf);
              if (currentPlayer.simulatedRole == RoleCodeType.Werewolf) {
                this.showNotice('机械狼模拟狼人, 有一次双刀机会', 2, RoleCodeType.MechanicalWolf);
              }
            }
          }
        }
        this.showNotice('', 2, RoleCodeType.MechanicalWolf);
        break;

      case 14:

        break;

      case 15:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('机械狼请闭眼', 0, RoleCodeType.MechanicalWolf);
        this.showNotice('', 0, RoleCodeType.MechanicalWolf);
        break;


      case 16:
        if (this.currentStory?.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectNightMare;
        }
        this.showJudgeMessage('噩梦之影请睁眼', 0, RoleCodeType.ShadowOfNightmare);
        this.showNotice('记录噩梦之影的号码', 1, RoleCodeType.ShadowOfNightmare);
        if (this.checkRoleIfDead(RoleCodeType.ShadowOfNightmare)) {
          this.showNotice('噩梦之影已出局', 0, RoleCodeType.ShadowOfNightmare);
        }
        this.showNotice('', 0, RoleCodeType.ShadowOfNightmare);
        break;

      case 17:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('请噩梦之影选择你要恐惧的人', 0, RoleCodeType.ShadowOfNightmare);
        this.showNotice('记录被恐惧的人的号码', 0, RoleCodeType.ShadowOfNightmare);
        this.showNotice('', 0, RoleCodeType.ShadowOfNightmare)
        break;

      case 18:
        this.showJudgeMessage('噩梦之影请闭眼', 0, RoleCodeType.ShadowOfNightmare);
        this.showNotice('', 0, RoleCodeType.ShadowOfNightmare);
        break;

      case 19:
        if (this.currentStory?.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectGuard;
        }
        this.showJudgeMessage('守卫请睁眼', 0, RoleCodeType.Guard);
        if (this.checkRoleIfDead(RoleCodeType.Guard)) {
          this.showNotice('守卫已出局', 0, RoleCodeType.Guard);
        }

        this.showNotice('记录守卫的号码', 1, RoleCodeType.Guard);
        this.showNotice('', 0, RoleCodeType.Guard);
        break;

      case 20:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('请守卫选择你要守护的人', 0, RoleCodeType.Guard);
        this.showNotice('记录被守护的人的号码', 0, RoleCodeType.Guard);
        this.showNotice('', 0, RoleCodeType.Guard);
        break;

      case 21:
        this.showJudgeMessage('守卫请闭眼', 0, RoleCodeType.Guard);
        this.showNotice('', 0, RoleCodeType.Guard);
        break;

      case 22:
        if (this.currentStory?.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectEvilKnight;
        }
        this.showJudgeMessage('恶灵骑士请睁眼', 1, RoleCodeType.EvilKnight);
        this.showNotice('记录恶灵骑士的号码', 1, RoleCodeType.EvilKnight);
        this.showNotice('', 1, RoleCodeType.EvilKnight);
        break;

      case 23:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('恶灵骑士请闭眼', 1, RoleCodeType.EvilKnight);
        this.showNotice('', 1, RoleCodeType.EvilKnight);
        break;


      case 24:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('狼人请睁眼', 0);
        this.showNotice('影狼请不要睁眼', 0, RoleCodeType.ShadowWolf);
        this.showNotice('石像鬼请不要睁眼', 0, RoleCodeType.Gargoyle);
        this.showNotice('机械狼请不要睁眼', 0, RoleCodeType.MechanicalWolf);

        if (this.currentStory?.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectWolf;
        }

        this.showJudgeMessage('请相互确认身份', 1);
        this.showNotice('记录所有狼的号码', 1);
        this.showNotice('', 0);
        break;

      case 25:
        break;

      case 26:
        this.currentStory.currentStepType = StepType.SelectPersonWhoKillByWolf;
        this.showJudgeMessage('请选择要刀的人', 0);
        this.showNotice('记录被刀人的号码', 0);
        this.showNotice('', 0)
        break;

      case 27:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('狼人请闭眼', 0);
        this.showNotice('', 0);
        break;

      case 28:
        if (this.currentStory?.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectWolfBeauty;
        }
        this.showJudgeMessage('狼美人请睁眼', 0, RoleCodeType.WolfBeauty);
        this.showNotice('记录狼美人的号码', 1, RoleCodeType.WolfBeauty);
        if (this.checkRoleIfDead(RoleCodeType.WolfBeauty)) {
          this.showNotice('狼美人已出局', 0, RoleCodeType.WolfBeauty);
        }
        this.showNotice('', 0, RoleCodeType.WolfBeauty);
        break;

      case 29:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('请狼美人选择你要魅惑的人', 0, RoleCodeType.WolfBeauty);
        this.showNotice('记录被魅惑的人的号码', 0, RoleCodeType.WolfBeauty);
        this.showNotice('', 0, RoleCodeType.WolfBeauty);
        break;

      case 30:
        this.showJudgeMessage('狼美人请闭眼', 0, RoleCodeType.WolfBeauty);
        this.showNotice('', 0, RoleCodeType.WolfBeauty);
        break;

      case 31:
        this.showJudgeMessage('影狼请睁眼', 0, RoleCodeType.ShadowWolf);
        if (this.currentStory?.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectShadowWolf;
        }
        this.showNotice('记录影狼的号码，并告知其他狼人的号码', 1, RoleCodeType.ShadowWolf);

        if (this.checkRoleIfDead(RoleCodeType.ShadowWolf)) {
          this.showNotice('影狼已出局', 0, RoleCodeType.ShadowWolf);
        }

        this.showNotice('如果已无其他狼人,示意影狼刀人', 0, RoleCodeType.ShadowWolf);
        this.showNotice('', 0, RoleCodeType.ShadowWolf);
        break;

      case 32:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('影狼请闭眼', 0, RoleCodeType.ShadowWolf);
        this.showNotice('', 0, RoleCodeType.ShadowWolf);
        break;

      case 33:
        this.showJudgeMessage('幸运儿请睁眼, 你的技能是这个....是否使用技能', 0, RoleCodeType.MiracleMerchant);
        this.showNotice('记录技能使用状况', 0, RoleCodeType.MiracleMerchant);
        this.showNotice('', 0, RoleCodeType.MiracleMerchant);
        break;

      case 34:
        this.showJudgeMessage('幸运儿请闭眼', 0, RoleCodeType.MiracleMerchant);
        this.showNotice('', 0, RoleCodeType.MiracleMerchant);
        break;

      case 35:

        if (this.currentStory.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectWitch;
        }
        this.showJudgeMessage('女巫请睁眼', 0, RoleCodeType.Witch);
        this.showNotice('记录女巫的号码', 1, RoleCodeType.Witch);

        if (this.checkRoleIfDead(RoleCodeType.Witch)) {
          this.showNotice('女巫已出局', 0, RoleCodeType.Witch);
        }

        this.showNotice('', 0, RoleCodeType.Witch);
        break;

      case 36:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('今天这个人被刀了, 你要使用解药吗?', 0, RoleCodeType.Witch);
        this.showNotice(this.getWitchPowerStatus(1), 0, RoleCodeType.Witch);
        this.showNotice('如果使用药则记录', 0, RoleCodeType.Witch);
        this.showNotice('', 0, RoleCodeType.Witch);
        break;

      case 37:
        this.showJudgeMessage('要使用毒药吗?', 0, RoleCodeType.Witch);
        this.showNotice(this.getWitchPowerStatus(0), 0, RoleCodeType.Witch);
        this.showNotice('如果使用药则记录', 0, RoleCodeType.Witch);
        this.showNotice('', 0, RoleCodeType.Witch);
        break;

      case 38:
        this.showJudgeMessage('女巫请闭眼', 0, RoleCodeType.Witch);
        this.showNotice('', 0, RoleCodeType.Witch);
        break;

      case 39:
        if (this.currentStory?.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectChanneler;
        }
        this.showJudgeMessage('通灵师请睁眼', 0, RoleCodeType.Channeler);
        this.showNotice('记录通灵师的号码', 1, RoleCodeType.Channeler);

        if (this.checkRoleIfDead(RoleCodeType.Channeler)) {
          this.showNotice('通灵师已出局', 0, RoleCodeType.Channeler);
        }

        this.showNotice('', 0, RoleCodeType.Channeler);
        break;

      case 40:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('请通灵师选择你要查验的人', 0, RoleCodeType.Channeler);
        var tempPlayer = this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.Channeler && p.isDead == false);

        if (tempPlayer) {
          if (!tempPlayer.isFear) {
            this.showNotice('查验，并告知被查验玩家的角色', 0, RoleCodeType.Channeler);
          } else {
            this.showNotice('已被恐惧，不能查验', 0, RoleCodeType.Channeler);
          }
        }
        this.showNotice('', 0, RoleCodeType.Channeler);
        break;

      case 41:
        this.showJudgeMessage('通灵师请闭眼', 0, RoleCodeType.Channeler);
        this.showNotice('', 0, RoleCodeType.Channeler);
        break;

      case 42:
        if (this.currentStory.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectSeer;
        }
        this.showJudgeMessage('预言家请睁眼', 0, RoleCodeType.Seer);
        this.showNotice('记录预言家的号码', 1, RoleCodeType.Seer);

        if (this.checkRoleIfDead(RoleCodeType.Seer)) {
          this.showNotice('预言家已出局', 0, RoleCodeType.Seer);
        }

        this.showNotice('', 0, RoleCodeType.Seer);
        break;

      case 43:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('请预言家选择你要查验的人', 0, RoleCodeType.Seer);
        var tempPlayer = this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.Seer && p.isDead == false);

        if (tempPlayer) {
          if (!tempPlayer.isFear) {
            this.showNotice('查验，并告知查验结果', 0, RoleCodeType.Seer);
          } else {
            this.showNotice('已被恐惧，不能查验', 0, RoleCodeType.Seer);
          }
        }

        this.showNotice('', 0, RoleCodeType.Seer);
        break;

      case 44:
        this.showJudgeMessage('预言家请闭眼', 0, RoleCodeType.Seer);
        this.showNotice('', 0, RoleCodeType.Seer);
        break;

      case 45:
        if (this.currentStory.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectDeamer;
        }
        this.showJudgeMessage('摄梦人请睁眼', 0, RoleCodeType.Deamer);
        this.showNotice('记录摄梦人的号码', 1, RoleCodeType.Deamer);

        if (this.checkRoleIfDead(RoleCodeType.Deamer)) {
          this.showNotice('摄梦人已出局', 0, RoleCodeType.Deamer);
        }

        this.showNotice('', 0, RoleCodeType.Deamer);
        break;

      case 46:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('请摄梦人选择梦游的人', 0, RoleCodeType.Deamer);
        this.showNotice('记录梦游的人', 0, RoleCodeType.Deamer);
        this.showNotice('', 0, RoleCodeType.Deamer);
        break;

      case 47:
        this.showJudgeMessage('摄梦人请闭眼', 0, RoleCodeType.Deamer);
        this.showNotice('', 0, RoleCodeType.Deamer);
        break;

      case 48:
        if (this.currentStory.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectDemonHunter;
        }
        this.showJudgeMessage('猎魔人请睁眼', 0, RoleCodeType.DeamonHunter);
        this.showNotice('记录猎魔人的号码', 1, RoleCodeType.DeamonHunter);

        if (this.checkRoleIfDead(RoleCodeType.DeamonHunter)) {
          this.showNotice('猎魔人已出局', 0, RoleCodeType.DeamonHunter);
        }

        this.showNotice('', 0, RoleCodeType.DeamonHunter);
        break;

      case 49:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('猎魔人你要发动技能吗?', 0, RoleCodeType.DeamonHunter);
        this.showNotice('如果发动则记录', 0, RoleCodeType.DeamonHunter);
        this.showNotice('', 0, RoleCodeType.DeamonHunter);
        break;

      case 50:
        this.showJudgeMessage('猎魔人请闭眼', 0, RoleCodeType.DeamonHunter);
        this.showNotice('', 0, RoleCodeType.DeamonHunter);
        break;

      case 51:
        if (this.currentStory.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectElder;
        }
        this.showJudgeMessage('禁言长老请睁眼', 0, RoleCodeType.Elder);
        this.showNotice('记录禁言长老的号码', 1, RoleCodeType.Elder);

        if (this.checkRoleIfDead(RoleCodeType.Elder)) {
          this.showNotice('禁言长老已出局', 0, RoleCodeType.Elder);
        }

        this.showNotice('', 0, RoleCodeType.Elder);
        break;

      case 52:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('禁言长老你要发动技能吗?', 0, RoleCodeType.Elder);
        this.showNotice('如果发动则记录', 0, RoleCodeType.Elder);
        this.showNotice('', 0, RoleCodeType.Elder);
        break;

      case 53:
        this.showJudgeMessage('禁言长老请闭眼', 0, RoleCodeType.Elder);
        this.showNotice('', 0, RoleCodeType.Elder);
        break;

      case 54:
        if (this.currentStory.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectBear;
        }
        this.showJudgeMessage('熊请睁眼', 1, RoleCodeType.Bear);
        this.showNotice('记录熊的号码', 1, RoleCodeType.Bear);
        this.showNotice('', 1, RoleCodeType.Bear);
        break;

      case 55:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('熊请闭眼', 1, RoleCodeType.Bear);
        this.showNotice('', 1, RoleCodeType.Bear);
        break;

      case 56:
        if (this.currentStory.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectFox;
        }
        this.showJudgeMessage('子狐请睁眼', 2, RoleCodeType.Fox);
        this.showNotice('记录子狐的号码', 2, RoleCodeType.Fox);

        if (this.checkRoleIfDead(RoleCodeType.Fox)) {
          this.showNotice('子狐已出局', 0, RoleCodeType.Fox);
        }

        this.showNotice('', 2, RoleCodeType.Fox);
        break;

      case 57:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('子狐是否要发动技能', 2, RoleCodeType.Fox);
        this.showNotice('', 2, RoleCodeType.Fox);
        break;

      case 58:
        this.showJudgeMessage('子狐请闭眼', 0, RoleCodeType.Fox);
        this.showNotice('', 2, RoleCodeType.Fox);
        break;

      case 59:
        if (this.currentStory.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectPuffer;
        }
        this.showJudgeMessage('河豚请睁眼', 1, RoleCodeType.Puffer);
        this.showNotice('记录河豚的号码', 1, RoleCodeType.Puffer);
        this.showNotice('', 1, RoleCodeType.Puffer);
        break;

      case 60:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('河豚请闭眼', 1, RoleCodeType.Puffer);
        this.showNotice('', 1, RoleCodeType.Puffer);
        break;

      case 61:
        if (this.currentStory.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectWhiteCat;
        }
        this.showJudgeMessage('白猫请睁眼', 1, RoleCodeType.WhiteCat);
        this.showNotice('记录白猫的号码', 1, RoleCodeType.WhiteCat);
        this.showNotice('', 1, RoleCodeType.WhiteCat);
        break;

      case 62:
        this.showJudgeMessage('白猫请闭眼', 1, RoleCodeType.WhiteCat);
        this.showNotice('', 1, RoleCodeType.WhiteCat);
        break;

      case 63:
        if (this.currentStory.stages == 1) {
          this.currentStory.currentStepType = StepType.SelectHunter;
        }

        this.showJudgeMessage('猎人请睁眼', 0, RoleCodeType.Hunter);
        this.showNotice('记录猎人的号码', 1, RoleCodeType.Hunter);

        if (this.checkRoleIfDead(RoleCodeType.Hunter)) {
          this.showNotice('猎人已出局', 0, RoleCodeType.Hunter);
        }

        this.showNotice('', 0, RoleCodeType.Hunter);
        break;

      case 64:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('猎人的开枪态是', 0, RoleCodeType.Hunter);
        this.showNotice(this.currentStory?.getHunterGunStatus() ? '可开枪' : '不可开枪', 0, RoleCodeType.Hunter);
        this.showNotice('', 0, RoleCodeType.Hunter);
        break;

      case 65:
        this.showJudgeMessage('猎人请闭眼', 0, RoleCodeType.Hunter);
        this.showNotice('', 0, RoleCodeType.Hunter);
        break;

      case 66:
        this.showJudgeMessage('机械狼请睁眼, 你要模仿谁?', 1, RoleCodeType.MechanicalWolf);
        this.showJudgeMessage('机械狼请睁眼, 你获得的技能是....', 1, RoleCodeType.MechanicalWolf);
        this.showNotice('示意机械狼获得的技能', 1, RoleCodeType.MechanicalWolf);
        this.showNotice('', 1, RoleCodeType.MechanicalWolf);
        break;

      case 67:
        this.showJudgeMessage('机械狼请闭眼', 1, RoleCodeType.MechanicalWolf);
        this.showNotice('', 1, RoleCodeType.MechanicalWolf);
        break;

      case 68:
        this.currentStory.currentStepType = StepType.SelectKnight;
        this.showJudgeMessage('骑士请睁眼', 1, RoleCodeType.Knight);
        this.showNotice('记录骑士的号码', 1, RoleCodeType.Knight);
        this.showNotice('', 0, RoleCodeType.Knight);
        break;

      case 69:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('骑士请闭眼', 1, RoleCodeType.Knight);
        this.showNotice('', 0, RoleCodeType.Knight);
        break;

      case 70:
        this.currentStory.currentStepType = StepType.SelectFoolman;
        this.showJudgeMessage('白痴请睁眼', 1, RoleCodeType.Foolman);
        this.showNotice('记录白痴的号码', 1, RoleCodeType.Foolman);
        this.showNotice('', 0, RoleCodeType.Foolman);
        break;

      case 71:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('白痴请闭眼', 1, RoleCodeType.Foolman);
        this.showNotice('', 0, RoleCodeType.Foolman);
        break;

      case 72:
        this.currentStory.currentStepType = StepType.SelectGargoyle;
        this.showJudgeMessage('石像鬼请睁眼', 0, RoleCodeType.Gargoyle);
        this.showNotice('记录石像鬼的号码', 1, RoleCodeType.Gargoyle);

        if (this.checkRoleIfDead(RoleCodeType.Gargoyle)) {
          this.showNotice('石像鬼已出局', 0, RoleCodeType.Gargoyle);
        }

        this.showNotice('', 1, RoleCodeType.Gargoyle);
        break;

      case 73:
        this.currentStory.currentStepType = StepType.Common;
        this.showJudgeMessage('请石像鬼选择你要查验的人', 0, RoleCodeType.Gargoyle);
        this.showNotice('告知被查验人的具体角色', 1, RoleCodeType.Gargoyle);
        this.showNotice('如果已无其他狼人,示意石像鬼刀人', 0, RoleCodeType.Gargoyle);
        this.showNotice('', 0, RoleCodeType.Gargoyle);
        break;

      case 74:
        this.showJudgeMessage('石像鬼请闭眼', 0, RoleCodeType.Gargoyle);
        this.showNotice('', 0, RoleCodeType.Gargoyle);
        break;


      case 75:
        this.currentStory.currentStepType = StepType.Common;
        if (this.currentStory?.edition.isSpecialRulesInclude(SpecialRulesType.Police)) {

          this.showJudgeMessage('大家请睁眼，现在是竞选警长阶段', 1);
          this.showJudgeMessage('要竞选警长的请举牌示意', 1);

          var playerNo = this.getRandomInt(1, this.currentStory?.player.length || 0);
          var speakerDirection = '';

          if (this.getRandomInt(0, 1) == 0) {
            speakerDirection = '左边';
          }
          else {
            speakerDirection = '右边';
          }

          this.showJudgeMessage(`请${playerNo}号玩家${speakerDirection}开始发言`, 1);

          this.banPlayer = this.currentStory?.player.find(p => p.isCanNotSpeak && p.isDead == false);
          if (this.banPlayer) {
            this.showJudgeMessage(`${this.banPlayer.id}号玩家被禁言了`, 0, RoleCodeType.Elder);
            this.showNotice('', 0, RoleCodeType.Elder);
          }

          this.showNotice('等待发言结束...', 1);
          this.showNotice('')
        }



        break;

      case 76:
        if (this.currentStory?.edition.isSpecialRulesInclude(SpecialRulesType.Police)) {
          this.currentStory.currentStepType = StepType.SelectPolice;
          this.showJudgeMessage('竞选警长的有......请大家闭眼投票', 1);
          this.showNotice('根据投票结果记录警长的号码', 1);
          this.showNotice('')
        }
        break;

      case 77:
        this.showNotice('夜晚结束....');
        this.currentStory.currentStepType = StepType.Common;
        this.currentStory.isNight = false;
        this.isProccessed = true;
        this.currentStory.step = 0;

        break;

      default:
        break;
    }

    if (this.currentStory) {
      this.currentStory.step += 1;
    }
  }

  scrollToBottom(): void {
    try {
      this.logContainer.nativeElement.scrollTop = this.logContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  settlement() {
    let deadPersons: Player[] = [];
    this.currentStory?.player.filter(item => item.isDead == false).forEach(player => {


      // 狼刀
      if (player.isKilledByWolf) {
        this.showNotice(`${player.id}号玩家被狼人刀了`, 0);
        player.isDead = true;

        // 子狐的迷惑
        if (this.currentStory?.player.find(p => p.role?.camp == CampType.Werewolf && p.isDead == false && p.isConfused)) {
          this.showNotice(`狼群被迷惑了, 狼刀失效`, 0);
          player.isDead = false;
        }


        // 如果任何狼人被恐惧了, 则不出局
        if (this.currentStory?.player.find(p => p.role?.camp == CampType.Werewolf && p.isDead == false && p.isFear)) {
          this.showNotice(`狼人被恐惧了, 狼刀失效`, 0);
          player.isDead = false;
        }

        if (player.isGuarded) {
          if (this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.Guard && p.isDead == false && p.isFear)) {
            this.showNotice(`守卫被恐惧了, 守卫失效`, 0);
            player.isGuarded = false;
          } else {
            this.showNotice(`${player.id}号玩家被守卫守护了`, 0);
            player.isDead = false;
          }
        }

        if (player.isSimulationGuarded) {
          if (this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.MechanicalWolf && p.isDead == false && p.isFear)) {
            this.showNotice(`机械守卫被恐惧了, 守卫失效`, 0);
            player.isGuarded = false;
          } else {
            this.showNotice(`${player.id}号玩家被机械守卫守护了`, 0);
            player.isDead = false;
          }
        }



        if (player.isHealed) {
          if (this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.Witch && p.isDead == false && p.isFear)) {
            this.showNotice(`女巫被恐惧了, 解药失效`, 0);
            player.isHealed = false;
          } else {
            this.showNotice(`${player.id}号玩家被解药救了`, 0);
            player.isDead = false;
          }
        }

        if ((player.isGuarded || player.isSimulationGuarded) && player.isHealed) {
          this.showNotice(`${player.id}号玩家被同守同救, 出局了`, 0);
          player.isDead = true;
        }
      }

      // 女巫毒
      if (player.isPoisoned) {
        this.showNotice(`${player.id}号玩家被女巫毒了`, 0);
        player.isDead = true;

        if (this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.Witch && p.isDead == false && p.isFear)) {
          this.showNotice(`女巫被恐惧了, 毒药失效`, 0);
          player.isDead = false;
        }

        if (player.role?.roleType == RoleCodeType.DeamonHunter) {
          this.showNotice(`${player.id}号玩家是猎魔人免疫毒药`, 0);
          player.isDead = false;
        }

        if (player.role?.roleType == RoleCodeType.EvilKnight) {
          this.showNotice(`${player.id}号玩家是恶灵骑士免疫所有晚间伤害`, 0);
          player.isDead = false;
        }

        if (player.isSimulationGuarded) {
          this.showNotice(`${player.id}号玩家被机械守卫守护了, 机械守护可抵抗毒药`, 0);
          player.isDead = false;
        }

        if (player.role?.roleType == RoleCodeType.WolfKing) {
          this.showNotice(`${player.id}号玩家是狼王, 被毒出局不能发动狼王爪`, 0);
        }
      }

      // 机械毒
      if (player.isSimulationPoisoned) {
        this.showNotice(`${player.id}号玩家被机械狼毒了`, 0);
        player.isDead = true;

        if (this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.MechanicalWolf && p.isDead == false && p.isFear)) {
          this.showNotice(`机械狼被恐惧了, 毒药失效`, 0);
          player.isDead = false;
        }

        if (player.role?.roleType == RoleCodeType.DeamonHunter) {
          this.showNotice(`${player.id}号玩家是猎魔人免疫毒药`, 0);
          player.isDead = false;
        }

        if (player.role?.roleType == RoleCodeType.EvilKnight) {
          this.showNotice(`${player.id}号玩家是恶灵骑士免疫所有晚间伤害`, 0);
          player.isDead = false;
        }

        if (player.isSimulationGuarded) {
          this.showNotice(`${player.id}号玩家被机械守卫守护了, 机械守护可抵抗毒药`, 0);
          player.isDead = false;
        }

        if (player.role?.roleType == RoleCodeType.WolfKing) {
          this.showNotice(`${player.id}号玩家是狼王, 被毒出局不能发动狼王爪`, 0);
        }
      }

      // 幸运儿
      if (player.isGiftPoisoned) {

        this.showNotice(`${player.id}号玩家被幸运儿下毒了`, 0);
        player.isDead = true;

        if (this.currentStory?.player.find(p => p.isLucky && p.isDead == false && p.isFear)) {
          this.showNotice(`幸运儿被恐惧了, 毒药失效`, 0);
          player.isDead = false;
        }

        if (player.role?.roleType == RoleCodeType.DeamonHunter) {
          this.showNotice(`${player.id}号玩家是猎魔人免疫毒药`, 0);
          player.isDead = false;
        }

        if (player.role?.roleType == RoleCodeType.EvilKnight) {
          this.showNotice(`${player.id}号玩家是恶灵骑士免疫所有晚间伤害`, 0);
          player.isDead = false;
        }

        if (player.role?.roleType == RoleCodeType.WolfKing) {
          this.showNotice(`${player.id}号玩家是狼王, 被毒出局不能发动狼王爪`, 0);
        }
      }

      // 猎魔人刀
      if (player.isKilledByDeamonHunter) {

        if (player.camp == CampType.Werewolf) {
          this.showNotice(`${player.id}号玩家被猎魔人猎杀了`, 0);
          player.isDead = true;
        }

        if (this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.DeamonHunter && p.isDead == false && p.isFear)) {
          this.showNotice(`猎魔人被恐惧了, 技能失效`, 0);
          player.isDead = false;
        }

        if (player.isGuarded) {
          this.showNotice(`${player.id}号玩家被守卫守护了`, 0);
          player.isDead = false;
        }
      }


      // 恶灵骑士反伤伤害
      if (player.role?.roleType == RoleCodeType.EvilKnight) {

        if (player.isForetelled && player.hasDamageReflection) {

          var seer = this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.Seer && p.isDead == false);
          if (seer) {
            this.showNotice(`${player.id}号玩家是恶灵骑士被预言家预言了, 反伤了${seer.id}号预言家`, 0);
            seer.isDead = true;
            deadPersons.push(seer);
            player.hasDamageReflection = false;
          }
        }

        if (player.isGiftForetelled && player.hasDamageReflection) {
          var lucky = this.currentStory?.player.find(p => p.isLucky && p.isDead == false);
          if (lucky) {
            this.showNotice(`${player.id}号玩家是恶灵骑士被幸运儿预言了, 反伤了${lucky.id}号幸运儿`, 0);
            lucky.isDead = true;
            deadPersons.push(lucky);
            player.hasDamageReflection = false;
          }
        }


        if (player.isPoisoned && player.hasDamageReflection) {
          var witch = this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.Witch && p.isDead == false);

          if (witch) {
            this.showNotice(`${player.id}号玩家是恶灵骑士被女巫毒了, 反伤了${witch.id}号女巫`, 0);
            witch.isDead = true;
            deadPersons.push(witch);
            player.hasDamageReflection = false;
          }
        }

        if (player.isGiftPoisoned && player.hasDamageReflection) {
          var lucky = this.currentStory?.player.find(p => p.isLucky && p.isDead == false);

          if (lucky) {
            this.showNotice(`${player.id}号玩家是恶灵骑士被幸运儿下毒了, 反伤了${lucky.id}号幸运儿`, 0);
            lucky.isDead = true;
            deadPersons.push(lucky);
            player.hasDamageReflection = false;
          }
        }
      }


      // 摄梦人
      if (player.isDreamed) {

        if (this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.Deamer && p.isDead == false && p.isFear)) {
          this.showNotice(`摄梦人被恐惧了, ${player.id}号玩家梦游状态失效`, 0);
        } else {
          this.showNotice(`${player.id}号玩家被梦游了, 免疫任何伤害`, 0);
          player.isDead = false;

          if (player.isDreamedPreviously) {
            this.showNotice(`${player.id}号玩家被连续梦游两次, 出局`, 0);
            player.isDead = true;
          }

          if (player.role?.roleType == RoleCodeType.WolfKing) {
            this.showNotice(`${player.id}号玩家是狼王, 梦游两次出局不能发动狼王爪`, 0);
          }
        }
      }

      // 猎魔人错杀
      if (player.isKillWrongPerson && !player.isFear) {
        this.showNotice(`${player.id}号玩家错杀人了, 出局`, 0);
        player.isDead = true;
      }

      // 狼美人
      if (player.role?.roleType == RoleCodeType.WolfBeauty && player.isDead == true && !player.isFear) {
        var charmedPlayer = this.currentStory?.player.find(p => p.isCharmed);
        this.showNotice(`${player.id}号玩家是狼美人, 魅惑了${charmedPlayer?.id}号玩家`, 0);

        if (this.currentStory?.player.find(p => p.role?.camp == CampType.Werewolf && p.isDead == false && p.isConfused)) {
          this.showNotice(`狼群被迷惑了, 魅惑失效`, 0);
        } else {
          if (charmedPlayer!.isDead == true) {
            this.showNotice(`${charmedPlayer?.id}号玩家已经出局了, 所以没人和狼美人一起殉情`, 0);
          } else {
            this.showNotice(`${charmedPlayer?.id}号玩家和狼美人一起殉情, 出局`, 0);
            charmedPlayer!.isDead = true;
            deadPersons.push(charmedPlayer!);
          }
        }
      }

      // 奇迹商人-幸运给了狼
      if (player.isGiveLuckyToWolf && player.isDead == false && !player.isFear) {
        this.showNotice(`${player.id}号玩家是奇迹商人, 给了狼幸运，出局`, 0);
        player!.isDead = true;
      }

      if (player.isDead) {
        if (!deadPersons.find(p => p.id == player.id)) {
          deadPersons.push(player);
        }
      }

      // 摄梦人出局，梦游者一同出局
      if (player.isDead && player.role?.roleType == RoleCodeType.Deamer && !player.isFear) {
        var dreamer = this.currentStory?.player.find(p => p.isDreamed && p.isDead == false);
        if (dreamer) {
          this.showNotice(`${player.id}号玩家是摄梦人, 梦游了${dreamer.id}号玩家, ${dreamer.id}号玩家一同出局`, 0);
          dreamer.isDead = true;
          deadPersons.push(dreamer);
        }
      }

      if (player.isDead && player.isLover) {
        var lover = this.currentStory?.player.find(p => p.isLover && p.id != player.id);
        if (lover) {
          this.showNotice(`${player.id}号和${lover.id}号玩家是恋人, 一同出局`, 0);
          lover.isDead = true;
          deadPersons.push(lover);
        }
      }


    });

    this.showNotice('');
    if (deadPersons.length == 0) {
      this.showJudgeMessage('这一晚是平安夜', 0);
    } else {

      this.showJudgeMessage('这一晚出局的玩家有:', 0);
      deadPersons.forEach(player => {
        if (player.isDead) {
          this.showJudgeMessage(`${player.id}号玩家`, 0);

          if (player.role?.roleType == RoleCodeType.MechanicalWolf) {
            var condition = player.simulatedRole == RoleCodeType.Hunter && !player.isFear && !player.isPoisoned && !player.isGiftPoisoned && !player.isSimulationPoisoned && !player.isSilent && !player.isDreamed;
            if (condition) {
              this.showNotice(`机械猎人可开枪`, 0);
            } else {
              this.showNotice(`机械狼处于中毒,梦游,恐惧和沉默状态下不可开枪`, 0);
            }
          }
        }
      });
      this.showJudgeMessage('是否发动技能?', 0);
    }
    this.showNotice('');

  }

  // no=1 毒药， no=2 解药
  getWitchPowerStatus(no: number): string {
    let s = '';
    let witch = this.currentStory?.player.find(p => p.role?.roleType == RoleCodeType.Witch);

    if (no == 0) {
      if (witch?.hasPoison) {
        s = '毒药可使用';
      } else {
        s = '毒药不可使用';
      }
    } else if (no == 1) {
      if (witch?.hasHeal) {
        s = '解药可使用';
      } else {
        s = '解药不可使用';
      }
    } else {
      return '';
    }

    return s;
  }

  checkRoleIfDead(role: RoleCodeType): boolean {
    let player = this.currentStory?.player.find(p => p.role?.roleType == role && p.isDead == true);
    if (player) {
      return true;
    } else {
      return false;
    }
  }

  showSpecialRules() {
    alert(this.currentStory?.edition.editionSpecialRules.map(r => r).join('\r\n'));
  }

  finishGame() {
    this.currentStory!.status = StoryStatusType.Ended;
    this.currentStory!.endTime = new Date();
    this.currentStory?.saveToLocalStorage();
    this.router.navigate(['/home']);
  }

}
