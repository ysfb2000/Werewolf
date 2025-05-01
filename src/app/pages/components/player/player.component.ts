import { Component, ElementRef, model, output, ViewChild } from '@angular/core';
import { Player } from '../../../shared/models/player';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { CampType, EventCodeType, PowerType, RoleCodeType, SpecialRulesType, StepType } from '../../../shared/enums';
import { Role } from '../../../shared/models/role';
import { FormsModule } from '@angular/forms';
import { Story } from '../../../shared/models/story';
import { GameEvent } from '../../../shared/models/event';


@Component({
  selector: 'app-player',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.less'
})
export class PlayerComponent {
  player = model<Player>();

  skill = model<PowerType>();
  selectCount = model<number>(0); // 选择的角色数量
  event = output<GameEvent>();

  currentStory = model<Story>();

  currentPlayer: Player | null = null;
  originalPlayer: Player | null = null;
  selectedRole: RoleCodeType | null = null;
  roles: Role[] = [];

  selectedGift: string = '';

  @ViewChild('myModal', { static: false }) myModal!: ElementRef;
  @ViewChild('selectGiftModal', { static: false }) selectGiftModal!: ElementRef;

  private modalInstance!: Modal;
  private modalInstance2!: Modal;


  constructor() {

  }

  ngOnInit() {
    this.currentPlayer = this.player() || null;
    this.originalPlayer = this.currentPlayer ? { ...this.currentPlayer } : null;


    this.roles = this.currentStory()!.edition.getRoleList() || [];
    this.selectedRole = this.currentPlayer?.role?.roleType || null;
  }

  get showDeathMark(): boolean {
    return this.currentPlayer?.isDead == true;
  }

  get background(): any {
    var color = '';

    if (this.currentPlayer?.camp == CampType.Werewolf) {
      color = '#9d4ff5';
    }

    if (this.currentPlayer?.isDead == true) {
      color = '#5f6161';
    }

    return { 'background-color': true ? color : '' }
  }

  detail() {
    alert(this.currentPlayer?.role?.description || '');
  }

  savePlayerData() {

    this.selectedRole = this.currentPlayer?.role?.roleType || null;

    this.originalPlayer = this.currentPlayer ? { ...this.currentPlayer } : null;
    this.player.update(value => value = this.currentPlayer ?? undefined);
  }

  show() {

    // 常用阶段快捷处理
    if (this.currentStory()?.currentStepType != StepType.Common) {
      switch (this.currentStory()?.currentStepType) {
        case StepType.SelectWolf:

          if (this.currentPlayer?.role?.roleType == RoleCodeType.Werewolf) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;

            if (this.currentPlayer!.isLucky) {
              this.currentStory()?.player.forEach(p => {
                if (p.role?.roleType == RoleCodeType.MiracleMerchant && p.isDead == false) {
                  p.isGiveLuckyToWolf = false;
                  this.player.update(value => value = p ?? undefined);
                }
              });
            }
          } else {
            this.currentPlayer!.role = Role.loadDefaultRoles().find(r => r.roleType == RoleCodeType.Werewolf) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;

            if (this.currentPlayer!.isLucky) {
              this.currentStory()?.player.forEach(p => {
                if (p.role?.roleType == RoleCodeType.MiracleMerchant && p.isDead == false) {
                  p.isGiveLuckyToWolf = true;
                  this.player.update(value => value = p ?? undefined);
                }
              });
            }
          }
          break;

        case StepType.SelectPersonWhoKillByWolf:

          if (this.currentPlayer?.role?.roleType == RoleCodeType.WolfBeauty) {
            alert('狼美人不能自刀!');
            return;
          }

          if (this.currentPlayer?.isKilledByWolf) {
            this.currentPlayer!.isKilledByWolf = false;
          } else {
            this.currentPlayer!.isKilledByWolf = true;
          }
          break;

        case StepType.SelectWitch:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Witch) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          }
          else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Witch) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
            this.currentPlayer!.hasPoison = true;
            this.currentPlayer!.hasHeal = true;
          }
          break;

        case StepType.SelectSeer:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Seer) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Seer) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectHunter:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Hunter) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Hunter) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
            this.currentPlayer!.canShoot = true;
          }
          break;

        case StepType.SelectPolice:
          if (this.currentPlayer?.isPolice == true) {
            this.currentPlayer!.isPolice = false;
          } else {
            this.currentPlayer!.isPolice = true;
          }
          break;

        case StepType.SelectGuard:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Guard) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Guard) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectKnight:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Knight) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Knight) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectCupid:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Cupid) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Cupid) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectEvilKnight:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.EvilKnight) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.EvilKnight) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
            this.currentPlayer!.hasDamageReflection = true;
          }
          break;

        case StepType.SelectFoolman:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Foolman) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Foolman) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectWolfBeauty:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.WolfBeauty) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.WolfBeauty) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;
        
        case StepType.SelectDemonHunter:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.DeamonHunter) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.DeamonHunter) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectDeamer:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Deamer) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Deamer) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectNightMare:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.ShadowOfNightmare) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.ShadowOfNightmare) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectMiracleMerchant:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.MiracleMerchant) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.MiracleMerchant) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectBear:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Bear) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Bear) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectElder:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Elder) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Elder) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectFox:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Fox) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
            this.currentPlayer!.hasConfuse = false;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Fox) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
            this.currentPlayer!.hasConfuse = true;
          }
          break;

        case StepType.SelectPuffer:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Puffer) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Puffer) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectWhiteCat:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.WhiteCat) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.WhiteCat) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectChanneler:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Channeler) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Channeler) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectMechanicalWolf:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.MechanicalWolf) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.MechanicalWolf) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectShadowWolf:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.ShadowWolf) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.ShadowWolf) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        case StepType.SelectGargoyle:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Gargoyle) {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.UnKnown) || null;
            this.currentPlayer!.camp = CampType.Unknown;
          } else {
            this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === RoleCodeType.Gargoyle) || null;
            this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;
          }
          break;

        default:
      }

      this.savePlayerData();

      return
    }


    if (this.selectCount() > 0) {
      switch (this.skill()) {
        case PowerType.Foretell:
        case PowerType.GiftForetell:
          this.currentPlayer!.isForetelled = true;
          if (this.currentPlayer?.camp == CampType.Villager || this.currentPlayer?.camp == CampType.Neutral || this.currentPlayer?.camp == CampType.Unknown || this.currentPlayer?.role?.roleType == RoleCodeType.ShadowWolf) {
            alert('好人');
          } else {
            if (this.currentPlayer?.simulatedRole == RoleCodeType.Villager) {
              alert('好人');
            } else {
              alert('坏人');
            }
          }
          break;


        case PowerType.Channel:
          if (this.currentStory()?.stages == 1) {
            if (this.currentStory()?.stages == 1 && (this.currentPlayer?.camp == CampType.Villager || this.currentPlayer?.camp == CampType.Neutral || this.currentPlayer?.camp == CampType.Unknown || this.currentPlayer?.role?.roleType == RoleCodeType.ShadowWolf)) {
              alert('好人');
            } else {
              alert('坏人');
            }
          }


          if (this.currentStory()!.stages > 1 && this.currentPlayer?.role?.roleType != RoleCodeType.MechanicalWolf) {
            alert(this.currentPlayer?.role?.roleType == RoleCodeType.UnKnown ? '平民' : this.currentPlayer?.role?.roleType);
          }

          if (this.currentStory()!.stages > 1 && this.currentPlayer?.role?.roleType == RoleCodeType.MechanicalWolf) {
            alert(this.currentPlayer?.simulatedRole == RoleCodeType.UnKnown ? '平民' : this.currentPlayer?.simulatedRole);
          }

          break;

        case PowerType.SimulationChannel:
          if (this.currentStory()!.stages > 1) {
            alert(this.currentPlayer?.role?.roleType == RoleCodeType.UnKnown ? '平民' : this.currentPlayer?.role?.roleType);
          }
          break;

        case PowerType.Poison:

          this.currentPlayer!.isPoisoned = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          break;

        case PowerType.GiftPoison:
          this.currentPlayer!.isGiftPoisoned = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          break;

        case PowerType.SimulationPoison:
          this.currentPlayer!.isSimulationPoisoned = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          break;

        case PowerType.Heal:
          if (this.currentPlayer?.role?.roleType == RoleCodeType.Witch
            && !this.currentStory()?.edition.isSpecialRulesInclude(SpecialRulesType.WitchCanSaveSelfFirstNight)
            && this.currentStory()?.stages == 1) {
            alert('女巫不能在第一夜救自己！');
            return;
          }
          this.currentPlayer!.isHealed = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          break;

        case PowerType.Duel:
          if (this.currentPlayer?.camp == CampType.Werewolf) {
            this.currentPlayer!.isDead = true;

            this.player.update(value => value = this.currentPlayer ?? undefined);
            this.event.emit(new GameEvent(EventCodeType.showJudgeMessage, `骑士决斗成功, ${this.currentPlayer?.id}号玩家出局`));

            if (this.currentPlayer?.isLover) {
              var tempPlayer = this.currentStory()?.player.find(p => p.isLover && p.id != this.currentPlayer?.id);
              if (tempPlayer) {
                tempPlayer.isDead = true;
                this.player.update(value => value = this.currentPlayer ?? undefined);
                this.event.emit(new GameEvent(EventCodeType.showJudgeMessage, `情侣${tempPlayer.id}号玩家一同出局`));
              }
            }

          } else {
            this.event.emit(new GameEvent(EventCodeType.KnightDuelFail, `${this.currentPlayer?.id}号骑士决斗失败, 出局`));
          }
          break;

        case PowerType.Protect:
          if (this.currentPlayer?.isGuardedPreviously) {
            alert('不能连续两次守护同一个人！');
            return;
          }
          this.currentPlayer!.isGuarded = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          break;

        case PowerType.GiftProtect:
          if (this.currentPlayer?.isGuardedPreviously) {
            alert('不能连续两次守护同一个人！');
            return;
          }

          this.currentPlayer!.isGuarded = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          break;

        case PowerType.SimulationGuard:

        if (this.currentPlayer?.isGuardedPreviously) {
          alert('不能连续两次守护同一个人！');
          return;
        }

          this.currentPlayer!.isSimulationGuarded = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          break;

        case PowerType.Hunt:
          this.currentPlayer!.isDead = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          this.event.emit(new GameEvent(EventCodeType.showJudgeMessage, `猎人开枪了, ${this.currentPlayer?.id}号玩家出局`));

          if (this.currentPlayer?.isLover) {
            var tempPlayer = this.currentStory()?.player.find(p => p.isLover && p.id != this.currentPlayer?.id);
            if (tempPlayer) {
              tempPlayer.isDead = true;
              this.player.update(value => value = this.currentPlayer ?? undefined);
              this.event.emit(new GameEvent(EventCodeType.showJudgeMessage, `情侣${tempPlayer.id}号玩家一同出局`));
            }
          }
          break;

        case PowerType.simulationHunt:
            this.currentPlayer!.isDead = true;
            this.player.update(value => value = this.currentPlayer ?? undefined);
            this.event.emit(new GameEvent(EventCodeType.showJudgeMessage, `猎人开枪了, ${this.currentPlayer?.id}号玩家出局`));
  
            if (this.currentPlayer?.isLover) {
              var tempPlayer = this.currentStory()?.player.find(p => p.isLover && p.id != this.currentPlayer?.id);
              if (tempPlayer) {
                tempPlayer.isDead = true;
                this.player.update(value => value = this.currentPlayer ?? undefined);
                this.event.emit(new GameEvent(EventCodeType.showJudgeMessage, `情侣${tempPlayer.id}号玩家一同出局`));
              }
            }
            break;

        case PowerType.Dream:

          if (this.currentPlayer?.role?.roleType == RoleCodeType.Deamer) {
            alert('摄梦人不能摄梦自己!');
            return;
          }

          this.currentPlayer!.isDreamed = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          break;

        case PowerType.NightHunt:

          if (this.currentPlayer?.camp == CampType.Werewolf) {
            this.currentPlayer!.isKilledByDeamonHunter = true;
            this.player.update(value => value = this.currentPlayer ?? undefined);
          } else {
            this.event.emit(new GameEvent(EventCodeType.DeamonHunterKillWrongPerson, `${this.currentPlayer?.id}号猎魔人夜间狩猎失败, 出局`));
          }
          break;

        case PowerType.GivePower:
          if (this.currentPlayer?.camp == CampType.Werewolf) {
            this.currentPlayer!.isGiveLuckyToWolf = true;
            this.event.emit(new GameEvent(EventCodeType.GiveLuckyToWolf, `${this.currentPlayer?.id}号幸运商人遇到狼`));
          } else {
            this.currentPlayer!.isLucky = true;

            if (this.selectGiftModal) {
              this.modalInstance2 = new Modal(this.selectGiftModal.nativeElement);
              this.modalInstance2.show();
            }
  
            this.player.update(value => value = this.currentPlayer ?? undefined);
          }
          break;

        case PowerType.CanNotSpeak:
          this.currentPlayer!.isCanNotSpeak = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          break;

        case PowerType.Lover:
          this.currentPlayer!.isLover = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          break;

        case PowerType.WolfKingSelfDestruction:
          this.currentPlayer!.isDead = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          this.event.emit(new GameEvent(EventCodeType.showJudgeMessage, `${this.currentPlayer?.id}号玩家在白狼王自爆中出局, 直接进入黑夜`));

          if (this.currentPlayer?.isLover) {
            var tempPlayer = this.currentStory()?.player.find(p => p.isLover && p.id != this.currentPlayer?.id);
            if (tempPlayer) {
              tempPlayer.isDead = true;
              this.player.update(value => value = this.currentPlayer ?? undefined);
              this.event.emit(new GameEvent(EventCodeType.showJudgeMessage, `情侣${tempPlayer.id}号玩家一同出局`));
            }
          }

          break;

        case PowerType.Charmed:
          this.currentPlayer!.isCharmed = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          break;

        case PowerType.Fear:

          if (this.currentPlayer?.isFearPreviously) {
            alert('不能连续两次恐惧同一个人！');
            return;
          }

          this.currentPlayer!.isFear = true;
          this.player.update(value => value = this.currentPlayer ?? undefined);
          break;

        case PowerType.Check:
          if (this.currentPlayer?.role?.roleType != RoleCodeType.MechanicalWolf) {
            alert(this.currentPlayer?.role?.roleType == RoleCodeType.UnKnown ? '平民' : this.currentPlayer?.role?.roleType);
          }

          if (this.currentPlayer?.role?.roleType == RoleCodeType.MechanicalWolf) {
            alert(this.currentPlayer?.simulatedRole == RoleCodeType.UnKnown ? '平民' : this.currentPlayer?.simulatedRole);
          }
          break;

        case PowerType.Confused:
          if (this.currentPlayer?.camp == CampType.Werewolf) {
            this.currentPlayer!.isConfused = true;
            this.player.update(value => value = this.currentPlayer ?? undefined);
          }
          break;

        case PowerType.Simulation:
          var tempPlayer = this.currentStory()?.player.find(p => p.role?.roleType == RoleCodeType.MechanicalWolf && p.isDead == false);
          
          if (tempPlayer) {
            if (this.currentPlayer && this.currentPlayer.role) {

                if (this.currentPlayer.camp == CampType.Werewolf) {
                  tempPlayer.simulatedRole = RoleCodeType.Werewolf;
                  this.event.emit(new GameEvent(EventCodeType.showNoticeMessage, `机械狼模拟${this.currentPlayer?.id}号玩家为狼人`));
                } else {
                  tempPlayer.simulatedRole = this.currentPlayer.role.roleType ?? RoleCodeType.UnKnown;

                  if (tempPlayer.simulatedRole == RoleCodeType.UnKnown) {
                    tempPlayer.simulatedRole = RoleCodeType.Villager;
                  }

                  this.event.emit(new GameEvent(EventCodeType.showNoticeMessage, `机械狼模拟${this.currentPlayer?.id}号玩家为${this.currentPlayer.role.roleType}`));

                  if (tempPlayer.simulatedRole == RoleCodeType.Witch) {
                    tempPlayer.hasSimulatedWitch = true;
                  }
                }

                this.player.update(value => value = this.currentPlayer ?? undefined);
            }
          }
          break;

        default:
          break;
      }

      this.selectCount.update(value => value - 1);
      return;
    }

    this.originalPlayer = this.currentPlayer ? { ...this.currentPlayer } : null;

    if (this.myModal) {
      this.modalInstance = new Modal(this.myModal.nativeElement);
      this.modalInstance.show();
    }
  }

  submit() {
    if (this.modalInstance) {
      this.originalPlayer = this.currentPlayer ? { ...this.currentPlayer } : null;
      this.player.update(value => value = this.currentPlayer ?? undefined);
      this.modalInstance.hide();
    };
  }

  close(): void {
    if (this.modalInstance) {
      this.currentPlayer = this.originalPlayer ? { ...this.originalPlayer } : null;
      this.selectedRole = this.currentPlayer?.role?.roleType || null;

      this.modalInstance.hide();
    };
  }

  onRoleChange(data: any) {
    if (data === '(未知)') {
      this.currentPlayer!.role = new Role(RoleCodeType.UnKnown, '(未知)', '', CampType.Unknown, false);
      return;
    }

    this.currentPlayer!.role = this.roles.find((role: Role) => role.roleType === data) || null;

    this.currentPlayer!.camp = this.currentPlayer!.role?.camp || CampType.Unknown;

    // 恶灵骑士技能初始化
    if (this.currentPlayer!.role?.roleType == RoleCodeType.EvilKnight) {
      this.currentPlayer!.hasDamageReflection = true;
    }

    // 女巫专属技能初始化
    if (this.currentPlayer!.role?.roleType == RoleCodeType.Witch) {
      this.currentPlayer!.hasPoison = true;
      this.currentPlayer!.hasHeal = true;
    }

    // 子狐专属技能初始化
    if (this.currentPlayer!.role?.roleType == RoleCodeType.Fox) {
      this.currentPlayer!.hasConfuse = true;
    }

  }

  getGift() {
    switch (this.selectedGift) {
      case 'poison':
        this.currentPlayer!.hasGiftPoison = true;
        break;

      case 'foretell':
        this.currentPlayer!.hasForetell = true;
        break;

      case 'guard':
        this.currentPlayer!.hasGuard = true;
        break;
      default:
        break;
    }

    this.player.update(value => value = this.currentPlayer ?? undefined);
    this.modalInstance2.hide();
  }

  // 使用毒药
  poison() {

    this.submit();

    localStorage.setItem('activedPlayer', this.currentPlayer?.id.toString() || '');
    this.currentPlayer!.hasPoison = false;

    this.skill.update(value => value = PowerType.Poison);
    this.selectCount.update(value => value = 1);

  }

  // 使用毒药(赠)
  giftPoison() {

    this.submit();

    localStorage.setItem('activedPlayer', this.currentPlayer?.id.toString() || '');
    this.currentPlayer!.hasGiftPoison = false;

    this.skill.update(value => value = PowerType.GiftPoison);
    this.selectCount.update(value => value = 1);
  }


  // 使用解药
  heal() {

    this.submit();
    this.currentPlayer!.hasHeal = false;

    this.skill.update(value => value = PowerType.Heal);
    this.selectCount.update(value => value = 1);

  }

  // 使用预言
  foreTell() {

    this.submit();

    this.skill.update(value => value = PowerType.Foretell);
    this.selectCount.update(value => value = 1);
  }

  // 使用预言(赠)
  giftForeTell() {

    this.submit();

    this.currentPlayer!.hasForetell = false;
    this.skill.update(value => value = PowerType.GiftForetell);
    this.selectCount.update(value => value = 1);
  }

  // 决斗
  duel() {

    this.submit();

    this.skill.update(value => value = PowerType.Duel);
    this.selectCount.update(value => value = 1);
  }

  guard() {
    this.submit();

    this.skill.update(value => value = PowerType.Protect);
    this.selectCount.update(value => value = 1);
  }

  giftGuard() {

    this.submit();

    this.currentPlayer!.hasGuard = false;
    this.skill.update(value => value = PowerType.GiftProtect);
    this.selectCount.update(value => value = 1);
  }

  // 狩猎
  hunt() {
    if (this.currentPlayer?.canShoot) {

      this.submit();

      this.skill.update(value => value = PowerType.Hunt);
      this.selectCount.update(value => value = 1);
    } else {
      alert('不能开枪！');
    }

  }

  // 摄梦
  dream() {

    this.submit();

    this.skill.update(value => value = PowerType.Dream);
    this.selectCount.update(value => value = 1);
  }

  // 夜间狩猎
  nightHunt() {

    this.submit();

    this.skill.update(value => value = PowerType.NightHunt);
    this.selectCount.update(value => value = 1);
  }

  // 给予能力(预言,守护,毒药)
  givePower() {

    this.submit();

    this.skill.update(value => value = PowerType.GivePower);
    this.selectCount.update(value => value = 1);
  }

  // 禁言
  canNotSpeak() {

    this.submit();

    this.skill.update(value => value = PowerType.CanNotSpeak);
    this.selectCount.update(value => value = 1);
  }

  // 选择情侣
  selectLover() {

    this.submit();

    this.skill.update(value => value = PowerType.Lover);
    this.selectCount.update(value => value = 2);
  }

  // 自爆
  selfDestruction() {

    this.submit();

    this.currentPlayer!.isDead = true;
    this.player.update(value => value = this.currentPlayer ?? undefined);

    this.event.emit(new GameEvent(EventCodeType.showJudgeMessage, `${this.currentPlayer?.id}号自爆, 出局, 直接进入黑夜`));
  }

  // 白狼王自爆
  WolfKingSelfDestruction() {

    this.submit();

    this.currentPlayer!.isDead = true;
    this.player.update(value => value = this.currentPlayer ?? undefined);

    this.skill.update(value => value = PowerType.WolfKingSelfDestruction);
    this.selectCount.update(value => value = 1);
  }

  // 魅惑
  charmed() {

    this.submit();

    this.skill.update(value => value = PowerType.Charmed);
    this.selectCount.update(value => value = 1);
  }

  // 血月自爆
  bloodMoonSelfDestruction() {

    this.submit();

    this.currentPlayer!.isDead = true;
    this.player.update(value => value = this.currentPlayer ?? undefined);
    this.event.emit(new GameEvent(EventCodeType.showJudgeMessage, `${this.currentPlayer?.id}号血月自爆, 出局, 直接进入黑夜，村民阵营夜间不能发动技能`));
  }

  // 恐惧
  fear() {

    this.submit();

    this.skill.update(value => value = PowerType.Fear);
    this.selectCount.update(value => value = 1);
  }

  // 查验
  check() {

    this.submit();

    this.skill.update(value => value = PowerType.Check);
    this.selectCount.update(value => value = 1);
  }

  // 迷惑
  confuse() {
    this.submit();

    this.currentPlayer!.hasConfuse = false;
    this.skill.update(value => value = PowerType.Confused);
    this.selectCount.update(value => value = 1);
  }

  // 通灵
  channel() {
    this.submit();

    this.skill.update(value => value = PowerType.Channel);
    this.selectCount.update(value => value = 1);
  }

  // 模仿
  simulating() {
    this.submit();

    this.skill.update(value => value = PowerType.Simulation);
    this.selectCount.update(value => value = 1);
  }

  // 机械通灵
  simulationChannel() {
    this.submit();

    this.skill.update(value => value = PowerType.SimulationChannel);
    this.selectCount.update(value => value = 1);
  }

  // 机械毒药
  simulationPoison() {
    this.submit();

    this.skill.update(value => value = PowerType.SimulationPoison);
    this.selectCount.update(value => value = 1);
  }

  // 机械守护
  simulationGuard() {
    this.submit();

    this.skill.update(value => value = PowerType.SimulationGuard);
    this.selectCount.update(value => value = 1);
  }

  // 机械狩猎
  simulationHunt() {
    this.submit();

    this.skill.update(value => value = PowerType.simulationHunt);
    this.selectCount.update(value => value = 1);
  }

  out() {
    // 狼美人魅惑生效
    if (this.currentPlayer?.isDead && this.currentPlayer?.role?.roleType == RoleCodeType.WolfBeauty) {
      this.currentStory()?.player.forEach((p) => {
        if (p.isCharmed) {
          p.isDead = true;
          this.event.emit(new GameEvent(EventCodeType.showJudgeMessage, `${p.id}号被${this.currentPlayer?.id}狼美人魅惑, 一同出局`));
        }
      });

    }

    // 狼王爪
    if (this.currentPlayer?.isDead && this.currentPlayer?.role?.roleType == RoleCodeType.WolfKing) {
        this.event.emit(new GameEvent(EventCodeType.showNoticeMessage, `${this.currentPlayer.id}号是狼王, 可发动狼王爪`));
    }

    // 恋人
    if (this.currentPlayer?.isDead && this.currentPlayer?.isLover) {
      this.currentStory()?.player.forEach((p) => {
        if (p.isLover && p.id != this.currentPlayer?.id) {
          p.isDead = true;
          this.event.emit(new GameEvent(EventCodeType.showJudgeMessage, `${p.id}号是${this.currentPlayer?.id}号的恋人, 一同出局`));
        }
      });
    }
  }
  


}
