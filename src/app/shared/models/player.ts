import { CampType, RoleCodeType } from "../enums";
import { Role } from "./role";

export class Player {
    id: number;
    name: string;
    role: Role | null;
    camp: CampType = CampType.Unknown;

    isPolice: boolean;
    isDead: boolean = false;

    // 特殊状态
    isSilent: boolean = false;
    isCursed: boolean = false;
    isLucky: boolean = false;
    isFool: boolean = false;
    isGuarded: boolean = false;
    isGuardedPreviously: boolean = false;
    isCharmed: boolean = false;
    isFear: boolean = false;
    isFearPreviously: boolean = false;
    isCanNotSpeak: boolean = false;
    isDreamed: boolean = false;
    isDreamedPreviously: boolean = false;
    isLover: boolean = false;
    isPoisoned: boolean = false;
    isHealed: boolean = false;
    isKilledByWolf: boolean = false;
    isKilledByDeamonHunter: boolean = false;
    isKillWrongPerson: boolean = false;
    isGiveLuckyToWolf: boolean = false;
    isForetelled: boolean = false;
    isGiftForetelled: boolean = false;
    isGiftPoisoned: boolean = false;
    isConfused: boolean = false;
    isSimulationPoisoned: boolean = false;
    isSimulationGuarded: boolean = false;


    replacedWith: number = 0; // 被替换的玩家ID
    isReplacedPreviously: boolean = false; // 是否被替换过

    // 角色状态
    // 女巫
    hasPoison: boolean = false;
    hasHeal: boolean = false;

    // 幸运儿
    hasForetell: boolean = false; 
    hasGuard: boolean = false;
    hasGiftPoison: boolean = false;

    // 机械狼
    simulatedRole: RoleCodeType = RoleCodeType.UnKnown;
    hasSimulatedWitch: boolean = false;

    // 猎人
    canShoot: boolean = false;

    // 奇迹商人
    hasMiracle: boolean = false;

    // 恶灵骑士
    hasDamageReflection: boolean = false;

    // 狼美人
    hasCharmed: boolean = false;

    // 子狐
    hasConfuse: boolean = false;

    // 影狼
    canAttack: boolean = false;

    // 噩梦之影
    canNotFearWho: number = 0;




    

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        this.role = new Role(RoleCodeType.UnKnown, '(未知)', '', CampType.Unknown, false);
        this.isPolice = false;
    }

}