import { CampType, RoleCodeType, SpecialRulesType, StepType, StoryStatusType } from "../enums";
import { Edition } from "./edition";
import { Player } from "./player";
import { Result } from "./result";


export class Story {
    storyName: string;
    edition: Edition;

    startTime: Date;
    endTime: Date;

    // 轮次
    stages: number = 1;
    step: number = 1;
    isNight: boolean = true;
    currentStepType: StepType = StepType.Common;

    winner: CampType = CampType.Unknown;

    player: Player[] = [];

    history: string[] = [];


    status: StoryStatusType = StoryStatusType.NotStarted;

    constructor(storyName: string, edition: Edition) {
        this.storyName = storyName;
        this.edition = edition;
        this.startTime = new Date();
        this.endTime = new Date();

        for (let i = 1; i <= edition.PlayerCount; i++) {
            this.player.push(new Player(i, `Player ${i}`));
        }

        this.saveToLocalStorage();
    }

    saveToLocalStorage(): void {
        var storyListJson = localStorage.getItem('StoryList');

        var storyList: Story[] = [];
        if (storyListJson) {
            storyList = JSON.parse(storyListJson);
        }
        // check if the story already exists in localStorage
        const storyExists = storyList.some((s: Story) => s.storyName === this.storyName);
        // if it doesn't exist, add it to the array
        if (!storyExists) {
            storyList.push(this);
        } else {
            // if it exists, update the existing story
            const index = storyList.findIndex((s: Story) => s.storyName === this.storyName);
            storyList[index] = this;
        }

        localStorage.setItem('StoryList', JSON.stringify(storyList));
    }

    isIncludeRole(role: RoleCodeType): boolean {
        return this.edition.getRoleList().some((r) => r.roleType === role);
    }

    getHunterGunStatus(): boolean {

        if (!this.isIncludeRole(RoleCodeType.Hunter)) return false;

        var hunter = this.player.find((p) => p.role?.roleType === RoleCodeType.Hunter);

        if (hunter?.isFear || hunter?.isPoisoned || hunter?.isGiftPoisoned || hunter?.isSimulationPoisoned || hunter?.isSilent || hunter?.isDreamed) {
            return false;
        }

        return true;
    }

    isEnd(): Result {
        let result = new Result();
        // 屠城-狼胜利
        let villagers = this.player.filter((p) => p.role?.camp != CampType.Werewolf && !p.isDead).length;
        if (villagers == 0) {
            this.winner = CampType.Werewolf;

            result.isOK = true;
            result.message = '驱逐所有村民, 狼胜利';

            return result;
        }

        // 反狼-村民胜利
        let wolves = this.player.filter((p) => p.role?.camp == CampType.Werewolf && !p.isDead).length;
        if (wolves == 0) {
            this.winner = CampType.Villager;
            result.isOK = true;
            result.message = '驱逐所有狼人, 村民胜利';
            return result;
        }


        // 屠边-狼胜利
        if (this.edition.isSpecialRulesInclude(SpecialRulesType.WinAsAllPowerPersonDie)) {
            let powerVillagers = this.player.filter((p) => p.role?.camp != CampType.Werewolf && !p.isDead && p.role?.isPowerRole).length;
            if (powerVillagers == 0) {
                this.winner = CampType.Werewolf;
                result.isOK = true;
                result.message = '驱逐所有神民, 狼胜利';
                return result;
            }
        }

        // 屠村-狼胜利
        if (this.edition.isSpecialRulesInclude(SpecialRulesType.WinAsAllVillagerDie)) {
            let villagers = this.player.filter((p) => p.role?.camp != CampType.Werewolf && !p.isDead && !p.role?.isPowerRole).length;
            if (villagers == 0) {
                this.winner = CampType.Werewolf;

                result.isOK = true;
                result.message = '驱逐所有平民, 狼胜利';
                return result;
            }
        }


        return result;

    }


    static loadStoryListFromLocalStorage(storyName: string): Story | null {
        const storyListJson = localStorage.getItem('StoryList');
        if (storyListJson) {
            const storyList: Story[] = JSON.parse(storyListJson);
            var story = storyList.find((s: Story) => s.storyName === storyName);

            // rehydrate the edition object
            var edition = Object.assign(new Edition('', [], {}), story?.edition);

            return story ? new Story(story.storyName, edition) : null;
        }

        return null;
    }

    static getCurrentStory(): Story | null {
        const storyName = localStorage.getItem('currentStoryName');
        if (storyName) {
            return Story.loadStoryListFromLocalStorage(storyName);
        }

        return null;
    }
}