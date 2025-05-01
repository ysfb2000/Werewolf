import { CampType, PowerType, RoleCodeType, SpecialRulesType } from "../enums";

export class Role {
    roleType: RoleCodeType;
    name: string;
    description: string;
    camp: CampType;
    isPowerRole: boolean;
    specialRules: SpecialRulesType[] = [];
    Powers: PowerType[] = [];
    actionOrder: number = 0;
    selectedCount: number = 0;


    constructor(roleType: RoleCodeType, name: string, description: string, camp: CampType, isPowerRole: boolean, specialRules: SpecialRulesType[] = [], actionOrder: number = 0, powers: PowerType[] = []) {
        this.roleType = roleType;
        this.name = name;
        this.description = description;
        this.camp = camp;
        this.isPowerRole = isPowerRole;
        this.specialRules = specialRules;
        this.actionOrder = actionOrder;
        this.Powers = powers;
    }

    static loadDefaultRoles(): Role[] {

        return [
            new Role(
                RoleCodeType.UnKnown,
                '(未知)', '',
                CampType.Villager,
                false,
                [],
                0,
                []
            ),


            new Role(
                RoleCodeType.Villager,
                '平民', 
                '好人阵营，普通的村民，夜晚只能沉睡，白天通过发言、推理和观察来识别狼人。虽然你没有特殊能力，但你拥有判断力与投票权，这是揭露狼人的关键。',
                CampType.Villager,
                false,
                [],
                0,
                []
            ),

            new Role(
                RoleCodeType.Hunter,
                '猎人',
                '好人阵营，神民，当且仅当猎人被狼人杀害或被投票放逐时，猎人可以亮出自己的身份牌并指定枪杀一名玩家。',
                CampType.Villager,
                true,
                [SpecialRulesType.HunterCanShoot],
                10,
                [PowerType.Hunt]
            ),

            new Role(
                RoleCodeType.Seer,
                '预言家',
                '好人阵营，神民，每天晚上可以查验一个玩家的身份，可以获知玩家是好人还是狼人。',
                CampType.Villager,
                true,
                [],
                4,
                [PowerType.Foretell]
            ),

            new Role(
                RoleCodeType.Witch,
                '女巫',
                `好人阵营，神民，每晚可以选择救活一名被狼人袭击的玩家，或使用毒药使一名玩家出局。

1.女巫每晚只能选择解药和毒药两瓶药中的一瓶使用。
2.部分版本允许女巫第一夜自救，部分不允许，需要根据不同板子的规则而定。
3.女巫使用解药后将无法得知狼人夜间的袭击信息。
4.当白天公布出局讯息后同时满足好人与狼人的胜利条件时（例如狼人夜间完成屠边，女巫也毒死最后一名狼人），视为狼人获胜，该规则又被称为“狼刀在先”原则。
                `,
                CampType.Villager,
                true,
                [SpecialRulesType.WitchCanSaveSelfFirstNight],
                3,
                [PowerType.Poison, PowerType.Heal]
            ),

            new Role(
                RoleCodeType.Guard,
                '守卫',
`好人阵营，神民，每晚可以守护一名玩家，但不能连续两晚守护同一名玩家。被守卫守护的玩家当晚不会被狼人杀害。

1.守卫不能守中女巫的毒药，守卫的技能只对狼人的袭击有效。
2.守卫守了被女巫解救的目标，该目标在第二天会出局，这种情况被称为“同守同救”或“奶穿了”。`,
                CampType.Villager,
                true,
                [],
                2,
                [PowerType.Protect]
            ),

            new Role(
                RoleCodeType.Knight,
                '骑士',
`好人阵营，神民，骑士可以在白天警长竞选结束后，放逐投票之前，随时翻牌决斗场上除自己以外的任意一位玩家。

1.如果被决斗的玩家是狼人，则该狼人死亡并立即进入黑夜；
2.如果被决斗的玩家是好人，则骑士死亡并继续进行白天原本的发言流程。`,
                CampType.Villager,
                true,
                [],
                0,
                [PowerType.Duel]
            ),

            new Role(
                RoleCodeType.Deamer,
                '摄梦人',
`好人阵营，神民
摄梦人每晚必须选择一名玩家成为梦游者，梦游者不知道自己正在梦游，且免疫夜间伤害。摄梦人在夜晚出局则梦游者一并出局，连续两晚成为梦游者也会出局。

1.摄梦人不能对自己使用技能。
2.摄梦人不能主动放弃使用技能。
3.女巫不能看到梦游出局的玩家，除非梦游者被狼人袭击。女巫看到的永远是狼人袭击信息。
4.女巫对第一夜成为梦游者的玩家用毒药也毒不出局，对第二夜成为梦游者的玩家用解药也救不活。
5.因梦游出局的猎人或狼王不能发动技能。且猎人和狼王不知道自己是因为梦游还是女巫的毒药出局。`,
                CampType.Villager,
                true,
                [],
                4,
                [PowerType.Dream]
            ),

            new Role(
                RoleCodeType.Foolman,
                '白痴',
`好人阵营，神民
白痴若被投票出局，可以翻开自己的身份牌，免疫此次放逐，之后可以正常发言，但不能投票，狼人仍需要击杀他才能让他死亡。

1.若是白痴因非投票原因死亡，则无法发动技能，立即死亡。`,
                CampType.Villager,
                true,
                [],
                0,
                [PowerType.ImmuneToVote]
            ),

            new Role(
                RoleCodeType.DeamonHunter,
                '猎魔人',
                `好人阵营，神民
从第二晚开始，每晚都可以选择一名玩家进行狩猎。如果对方是狼人，则次日对方出局；如果对方是好人，则次日猎魔人出局。女巫的毒药对猎魔人无效。

1.猎魔人可以放弃发动技能。
2.猎魔人不能对自己使用技能。
3.猎魔人不能分辨狩猎出局的狼人的身份。`,
                CampType.Villager,
                true,
                [],
                5,
                [PowerType.ImmuneToPoison, PowerType.NightHunt]
            ),

            new Role(
                RoleCodeType.MiracleMerchant,
                '奇迹商人',
                `好人阵营，神民
奇迹商人在每夜第一个行动，选择一名其他玩家成为幸运儿，使其获得三个一次性技能中的一个：预言家的查验、女巫的毒药或守卫的守护，每局游戏限一次。
若幸运儿是狼人，则幸运儿不会获得技能，且次日奇迹商人出局。 

1.奇迹商人可以将 (查验、毒、守护) 其中一个技能赋予一名幸运儿。
2.若赋予狼人技能，则奇迹商人次日出局 （又称为交易失败）。
3.奇迹商人赋予的技能，与角色原有技能互不干扰 （使用不会获得神职技能称号）。`,
                CampType.Villager,
                true,
                [],
                0,
                [PowerType.GivePower]
            ),

            new Role(
                RoleCodeType.Elder,
                '禁言长老',
                `好人阵营，神民
禁言长老，用于狼人杀面杀，可以在每回合禁止一位玩家说话，玩家只可以用肢体语言来表达自己的想法。`,
                CampType.Villager,
                true,
                [],
                11,
                [PowerType.CanNotSpeak]
            ),

            new Role(
                RoleCodeType.Bear,
                '熊',
                `天亮后，如果熊存活且熊两边存活的玩家之中存在狼人，则法官会向场上所有玩家宣布“熊咆哮了”。
如果熊死亡或熊相邻存活的玩家之中没有狼人，则法官会向场上所有玩家宣布“熊没有咆哮”。

1.天亮后，会立即公布熊是否咆哮
2.如果是第一天，会先宣布熊是否咆哮，再进入警长竞选环节。
3.如果不是第一天，会先宣布熊是否咆哮，再公布夜间死讯。`,
                CampType.Villager,
                true,
                [],
                11,
                [PowerType.Roar]
            ),
            new Role(
                RoleCodeType.Fox,
                '子狐',
                `从第二个夜晚开始，子狐可以在夜晚迷惑场上一名玩家，如果迷惑到了狼人阵营，则整个狼队当夜不能发动选中出局的技能。

1.如果子狐迷惑到了狼美人，狼美人当夜无法选择魅惑目标。
2.子狐一局游戏仅能发动一次技能。`,
                CampType.Villager,
                true,
                [],
                11,
                [PowerType.Confused]
            ),
            new Role(
                RoleCodeType.Puffer,
                '河豚',
                `放逐投票后，河豚可以主动翻牌，带走所有在本次投票中投给河豚的玩家。河豚一局游戏仅能发动一次技能。另外，如果狼队夜晚落刀河豚，第二天天亮河豚翻牌出局，狼美人技能在当天白天失效。

1.河豚发动河豚之怒翻牌后，如果河豚不是放逐投票中得票最多的玩家，就不会出局。
2.如果河豚被放逐出局，河豚可以翻牌带人。
3.如果出现平票对决，河豚可以在第二次投票结束后选择是否发动技能带走在两次投票中所有投票给河豚的玩家。
4.河豚可以选择不发动河豚之怒技能。
5.河豚不能投票给自己。
6.如果狼美人被河豚带走，前一夜只要没有被子狐迷惑就都可以带人。
7.若没有玩家投票给河豚，河豚不可以翻牌。
`,
                CampType.Villager,
                true,
                [],
                11,
                []
            ),

            new Role(
                RoleCodeType.WhiteCat,
                '白猫',
                `白猫在因为任何原因出局时，都会翻牌并额外存活至白猫下次放逐投票阶段后。

1.白猫翻牌后无法被选为狼击倒、狼美人魅惑、子狐迷惑和放逐投票目标。
2.白猫翻牌后不会由于狼美人魅惑或者河豚翻牌而出局。
3.如果白猫【跟随】狼美人出局，尚未翻牌的白猫会翻牌并存活至下一次放逐投票后，已经翻牌的白猫免疫狼美人魅惑。
4.如果第一天白天白猫被放逐翻牌，第二天狼人自曝身份的话， 白猫会在狼人自曝身份后出局。
5.如果晚上白猫被击倒，白天天亮翻牌，狼人自曝身份，白猫会在狼人自曝身份后出局。
6.白猫不可以选择不发动技能。
7.最后一神白猫在夜晚被狼击倒翻牌，白天最后一狼被放逐，由于先结算放逐投票结果再结算白猫的延迟出局，算好人阵营获胜。
`,
                CampType.Villager,
                true,
                [],
                11,
                []
            ),

            new Role(
                RoleCodeType.Channeler,
                '通灵师',
                `在每个夜晚，通灵师拥有查验任意一名玩家具体身份的能力。法官会在当晚根据通灵师所查验的角色，给予相应的手势提示。

1.第一晚查验机械狼会显示为狼阵营。
2.第二晚开始查验机械狼，则显示机械狼所模仿的角色。
`,
                CampType.Villager,
                true,
                [],
                11,
                []
            ),




            new Role(
                RoleCodeType.Werewolf,
                '狼人',
                `狼阵营

每晚可以袭击一名玩家。 
自爆：白天遗言、投票以外的任意时间，狼人可以明示自己身份并出局，当前白天将立即结束并进入黑夜。`,
                CampType.Werewolf,
                false,
                [],
                0,
                [PowerType.SelfDestruction]
            ),

            new Role(
                RoleCodeType.WolfKing,
                '狼王',
                `狼阵营
可以自刀，可以自曝身份。具有狼王爪技能，出局后可以使用狼王爪技能，选择一名玩家，使其一并出局。

1.狼王自曝身份后不能发动技能，只有夜间中刀或白天被放逐时可以发动技能，被女巫毒出局也无法发动技能。
2.狼人被两次梦游出局时，狼王也无法发动技能。`,
                CampType.Werewolf,
                false,
                [],
                0,
                [PowerType.WolfKingClaw]
            ),

            new Role(
                RoleCodeType.WhiteWolfKing,
                '白狼王',
                `狼阵营
白狼王可以在白天自爆的时候，选择带走一名玩家，非自爆出局不得发动技能。`,
                CampType.Werewolf,
                false,
                [],
                0,
                [PowerType.WolfKingSelfDestruction]
            ),

            new Role(
                RoleCodeType.EvilKnight,
                '恶灵骑士',
                `狼阵营
恶灵骑士免疫夜间伤害。
拥有一次性的反伤技能：若被预言家查验，次日预言家出局；若被女巫使用毒药，次日女巫出局。

1.不能自爆，不能自刀。
2.免疫夜间伤害指无法在夜间出局，被女巫使用了毒药也不会出局，且无法成为狼人夜间袭击的目标。
3.反伤技能为一次性技能，但免疫夜间伤害的效果是永久的。
4.法官不会告知恶灵骑士的技能是否发动，玩家只能通过出局信息自行分析。
5.女巫不能救活中了恶灵骑士反伤技能的预言家。`,
                CampType.Werewolf,
                false,
                [],
                0,
                [PowerType.CannotSelfDestruction, PowerType.NightNotDie]
            ),

            new Role(
                RoleCodeType.WolfBeauty,
                '狼美人',
                `狼阵营
狼美人在夜里可以魅惑一人，天亮后，如果狼美人被放逐出局或者被猎人射杀，被魅惑的玩家跟随狼美人一起出局，且无技能。（被魅惑的玩家不知情）

1.狼美人不能自爆。
2.狼美人不能自刀。
3.狼美人被骑士决斗出局时，狼美人不用翻牌， 并且不能发动技能。
`,
                CampType.Werewolf,
                false,
                [],
                0,
                [PowerType.Charmed]
            ),

            new Role(
                RoleCodeType.BloodMoonApostle,
                '血月使徒',
                `狼阵营
自爆：白天遗言、投票以外的任意时间，血月使徒可以明示自己身份并出局，当前白天将立即结束并进入黑夜。
血月使徒自爆后的当晚所有好人的技能都将会被封印。

1.若血月使徒是最后一个被放逐出局的狼人，他可以存活到下一个白天天亮之后才出局。`,
                CampType.Werewolf,
                false,
                [],
                0,
                [PowerType.BloodMoonSelfDestruction]
            ),

            new Role(
                RoleCodeType.ShadowOfNightmare,
                '噩梦之影',
                `狼阵营
每晚在其他所有人行动之前恐惧一名玩家，使其当夜无法行动。若对方为狼人，则整个狼人阵营也无法进行袭击。不能连续两晚恐惧同一名玩家，首夜进行恐惧时与其他狼人并不互知身份。 
自爆：白天遗言、投票以外的任意时间，噩梦之影可以明示自己身份并出局，发表遗言后，当前白天将立即结束并进入黑夜。 

1.噩梦之影可以自爆或自刀。
2.噩梦之影不可以对自己使用技能。
3.噩梦之影可以主动放弃使用技能，若放弃技能，则对其他玩家无影响。
4.若噩梦之影当晚对猎人使用技能，猎人当晚被狼人袭击，则第二天白天无法开枪。
5.若噩梦之影当晚对猎人使用技能，猎人白天被票选出局，则第二天白天可以开枪。
6.在双药都使用的情况下，女巫不可以知道自己被噩梦之影恐惧。
7.噩梦之影不可以恐惧狼队友，但在首夜不知道身份的情况下有一定几率恐惧到狼队友。任何狼队友被恐惧都会导致整个狼人阵营夜间无法袭击玩家。`,
                CampType.Werewolf,
                false,
                [],
                1,
                [PowerType.Fear]
            ),

            new Role(
                RoleCodeType.ShadowWolf,
                '影狼',
                `狼阵营
被预言家查验结果始终为好人。当其他所有狼人出局后，可在夜间进行袭击。

1.不能自爆。
2.在其他所有狼人出局前，夜间无法参与袭击。
3.隐狼可以看到狼人队友的身份，但不知道具体是什么狼人。
4.狼人队友不能看到隐狼的身份。`,
                CampType.Werewolf,
                false,
                [SpecialRulesType.ShadowWolfKnowOtherWolf, SpecialRulesType.ShadowWolfCanLiveAlone],
                0,
                [PowerType.Disguise]
            ),

            new Role(
                RoleCodeType.Gargoyle,
                '石像鬼',
                `狼阵营
每晚可以查验一名玩家的具体身份。当其他所有狼人出局后，可在夜间进行袭击。

1.不能自爆，夜间无法与狼人讨论、无法参与袭击、也无法与其他狼人互知身份。
2.石像鬼被预言家查验始终显示为狼人。
3.石像鬼不可以查验自己或重复查验某名玩家的身份。`,
                CampType.Werewolf,
                false,
                [],
                0,
                [PowerType.Check, PowerType.LoneWolf]
            ),
            new Role(
                RoleCodeType.MechanicalWolf,
                '机械狼',
                `狼阵营
机械狼在开局后的第一个夜晚便拥有首次睁眼选择权，可挑选一名玩家进行模仿。机械狼在夜间不会与其他狼人同伴相见，当所有狼人同伴均出局后，在机械狼单独行动的回合，法官会给出“带刀手势”，此时机械狼方可进行砍人动作。

1.在游戏开局后的第一个夜晚，当通灵师查验到机械狼时，法官会给出相应的机械狼手势。
2.除了首个夜晚外，每当通灵师查验到机械狼，法官会揭示机械狼所学习到的技能角色身份。
3.若被模仿的玩家是平民，机械狼将获得平民的技能，而从第二个夜晚开始，法官会继续单独唤醒机械狼，但夜间并无其他特殊事件发生。
4.若被模仿的玩家是通灵师，机械狼将获得通灵师的查验功能。自第二个夜晚起，机械狼每晚都可以使用此功能查验一名玩家的真实身份。
5.若被模仿的玩家是守卫，机械狼将获得强化版的守卫技能——机械盾。从第二个夜晚开始，机械狼每晚可选择一名玩家进行守护。此技能可抵御“夜晚的狼刀”、“女巫的毒药”以及“猎人夜晚的子弹”（需注意，猎人在夜晚被刀后开枪无法带走当晚被机械盾守护的玩家，但若在白天被放逐则可带走任意玩家）。同时，若机械盾与女巫的毒药同时作用于同一玩家，则该玩家会立即出局。
6.若被模仿的玩家是女巫，机械狼将获得女巫的一瓶毒药。自第二个夜晚起，机械狼可在任意夜晚选择一名玩家进行毒杀。
7.若被模仿的玩家是猎人，机械狼在首个白天即可获得猎人的技能。当机械狼出局时，他可以选择一名玩家进行猎杀（需注意，若机械狼在首个夜晚被刀出局则无枪可用，而在首个白天抗推出局时则可开枪）。
8.若被模仿的玩家是狼人，机械狼将获得一把额外的狼刀。在其他小狼全部出局后，法官会在夜间提示带刀，此时机械狼可以在任意一个夜晚连续砍两刀（但两刀必须分别作用于不同的玩家）。`,
                CampType.Werewolf,
                false,
                [],
                0,
                [PowerType.Simulation]
            ),




            new Role(
                RoleCodeType.Bomber,
                '炸弹人',
                '第三方，白天被投票放逐后，所有给他上票的玩家全部死亡，其他方式死亡无法发动技能。如果炸弹人被放逐时炸死了场上所有人，则炸弹人单独获得胜利。',
                CampType.Neutral,
                false,
                [],
                0,
                [PowerType.Explosion]
            ),

            new Role(
                RoleCodeType.Cupid,
                '丘比特',
                `第三方
丘比特在首夜狼人行动前，选择任意两名玩家成为情侣。
这两名玩家若是其中一名死去，另一名也要跟着殉情。第一天晚上情侣睁眼互相确认，丘比特无法得知情侣的具体身份。
丘比特不可以不使用技能。 

1.丘比特既不算神职、平民，也不算狼人牌，但被预言家查验为好人。丘比特也无法获得神职通用称号。
2.因殉情出局的猎人或狼王不可以发动技能，殉情时可以有遗言。
3.若情侣双方都为好人，则丘比特与好人胜利条件相同；若情侣双方都为狼人，则丘比特与狼人胜利条件相同；若情侣双方分别为好人和狼人，则丘比特与情侣成为第三方阵营，胜利条件为所有其他阵营玩家出局。
如果情侣没形成第三方阵营，好人和狼人的胜利条件和原来一样；如果情侣形成了第三方阵营，好人和狼人在原来的胜利条件基础上还要加上放逐或击杀情侣，但不需要放逐或击杀丘比特。`,
                CampType.Neutral,
                false,
                [],
                0,
                [PowerType.Lover]
            ),


        ];
    }

}