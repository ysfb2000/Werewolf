export enum RoleCodeType {
    Werewolf = '狼人',
    WolfKing = '狼王',
    WhiteWolfKing = '白狼王',
    EvilKnight = '恶灵骑士',
    WolfBeauty = '狼美人',
    BloodMoonApostle = '血月使徒',
    ShadowOfNightmare = '噩梦之影',
    ShadowWolf = '影狼',
    Gargoyle = '石像鬼',
    MechanicalWolf = '机械狼',


    Villager = '平民',
    Seer = '预言家',
    Witch = '女巫',
    Hunter = '猎人',
    Foolman = '白痴',
    Guard = '守卫',
    Knight = '骑士',
    Deamer = '摄梦人',
    DeamonHunter = '猎魔人',
    MiracleMerchant = '奇迹商人',
    Bear = '熊',
    Elder = '禁言长老',
    Fox = '子狐',
    Puffer = '河豚',
    WhiteCat = '白猫',
    Channeler = '通灵师',
    
    Bomber = '炸弹人',
    Cupid = '丘比特',

    UnKnown = '(未知)',

}


export enum PowerType {
    Poison = '毒药',
    GiftPoison = '毒药(赠)',
    Heal = '解药',
    Foretell = '预言',
    GiftForetell = '预言(赠)',
    Protect = '守护',
    GiftProtect = '守护(赠)',
    Duel = '决斗',
    Hunt = '狩猎',
    ImmuneToVote = '免疫驱逐',
    Dream = '摄梦',
    ImmuneToPoison = '免疫毒药',
    NightHunt = '夜间狩猎',
    GivePower = '给予能力(预言,守护,毒药)',
    Roar = '咆哮',
    CanNotSpeak = '禁言',
    Lover = '恋人',
    Confused = '迷惑',
    Channel = '通灵',


    SelfDestruction = '自爆',
    WolfKingClaw = '狼王爪',
    WolfKingSelfDestruction = '白狼王自爆',
    CannotSelfDestruction = '不可自爆',
    NightNotDie = '夜间不死',
    Charmed = '魅惑',
    BloodMoonSelfDestruction = '血月自爆',
    Fear = '恐惧',
    Disguise = '伪装',
    Explosion = '爆炸',
    Check = '查验',
    LoneWolf = '独狼',
    Simulation = '模拟',
    SimulationChannel = '机械通灵',
    SimulationPoison = '机械毒药',
    SimulationGuard = '机械守护',
    simulationHunt = '机械狩猎',

}



export enum CampType {
    Werewolf = 'Werewolf',
    Villager = 'Villager',
    Neutral = 'Neutral',
    Unknown = 'Unknown',
}

export enum SpecialRulesType {
    Police = '有警长',
    NoPolice = '无警长',
    Police15 = '警长1.5票',
    WinAsAllPowerPersonDie = '所有神民死亡狼即获胜',
    WinAsAllVillagerDie = '所有平民死亡狼即获胜',
    WolfCanNotAttackFirstNight = '狼首夜不能攻击',

    HunterCanShoot = '猎人被公投出局可开枪',
    HunterCanNotShoot = '猎人被公投出局不可开枪',
    WitchCanSaveSelfFirstNight = '女巫首夜可自救',
    WitchCanNotSaveSelf = '女巫不可自救',

    ShadowWolfKnowOtherWolf = '影狼知道其他狼',
    ShadowWolfCanLiveAlone = '影狼可独活',

}

export enum StoryStatusType {
    NotStarted = 'NotStarted',
    InProgress = 'InProgress',
    Ended = 'Ended'
}


export enum EventCodeType {
    UnKnown = '(未知)',
    KnightDuelFail = '骑士决斗失败',
    EvilKnightReflection = '恶灵骑士反弹',
    DeamonHunterKillWrongPerson = '猎魔人杀错人',
    GiveLuckyToWolf = '幸运给了狼',
    showJudgeMessage = '显示法官信息',
    showNoticeMessage = '显示提示',
}


export enum StepType {
    Common = 'Common',
    SelectWolf = 'SelectWolf',
    SelectPersonWhoKillByWolf = 'SelectPersonWhoKillByWolf',
    SelectWitch = 'SelectWitch',
    SelectSeer = 'SelectSeer',
    SelectHunter = 'SelectHunter',
    SelectPolice = 'SelectPolice',
    SelectKnight = 'SelectKnight',
    SelectGuard = 'SelectGuard',
    SelectCupid = 'SelectCupid',
    SelectEvilKnight = 'SelectEvilKnight',
    SelectDeamer = 'SelectDeamer',
    SelectFoolman = 'SelectFoolman',
    SelectWolfBeauty = 'SelectWolfBeauty',
    SelectBloodMoonApostle = 'SelectBloodMoonApostle',
    SelectDemonHunter = 'SelectDemonHunter',
    SelectNightMare = 'SelectNightMare',
    SelectMiracleMerchant = 'SelectMiracleMerchant',
    SelectFox = 'SelectFox',
    SelectPuffer = 'SelectPuffer',
    SelectElder = 'SelectElder',
    SelectBear = 'SelectBear',
    SelectWhiteCat = 'SelectWhiteCat',
    SelectChanneler = 'SelectChanneler',
    SelectMechanicalWolf = 'SelectMechanicalWolf',
    SelectGargoyle = 'SelectGargoyle',
    SelectShadowWolf = 'SelectShadowWolf',

}


