import { CampType, RoleCodeType, SpecialRulesType, StepType, StoryStatusType } from "../enums";
import { Edition } from "./edition";
import { EditionPlayerItem } from "./edition-player-item";
import { Player } from "./player";
import { Result } from "./result";


export class Story {
    private static readonly storageKey = 'storylist';
    private static readonly legacyStorageKey = 'StoryList';

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

    private static readStoryList(): Story[] {
        const currentStoryListJson = localStorage.getItem(Story.storageKey);
        const legacyStoryListJson = localStorage.getItem(Story.legacyStorageKey);
        const storyListJson = currentStoryListJson ?? legacyStoryListJson;

        if (!storyListJson) {
            return [];
        }

        try {
            const storyList = JSON.parse(storyListJson) as Story[];

            if (!currentStoryListJson && legacyStoryListJson) {
                Story.writeStoryList(storyList);
            }

            return storyList;
        } catch {
            return [];
        }
    }

    private static writeStoryList(storyList: Story[]): void {
        localStorage.setItem(Story.storageKey, JSON.stringify(storyList));
    }

    saveToLocalStorage(): void {
        const storyList = Story.readStoryList();
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

        Story.writeStoryList(storyList);
    }

    static deleteFromLocalStorage(storyName: string): void {
        const storyList = Story.readStoryList();
        const updatedStoryList = storyList.filter((story) => story.storyName !== storyName);

        Story.writeStoryList(updatedStoryList);

        if (localStorage.getItem('currentStoryName') === storyName) {
            localStorage.removeItem('currentStoryName');
        }
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


    private static rehydrateEdition(rawEdition: Edition): Edition {
        const edition = Object.assign(new Edition(rawEdition?.editionName ?? '', [], {}), rawEdition);
        edition.player = (rawEdition?.player ?? []).map((playerItem) =>
            Object.assign(new EditionPlayerItem(playerItem.role, playerItem.camp, playerItem.number), playerItem)
        );

        return edition;
    }

    private static rehydratePlayer(rawPlayer: Player): Player {
        const player = Object.assign(new Player(rawPlayer?.id ?? 0, rawPlayer?.name ?? ''), rawPlayer);
        if (rawPlayer?.role) {
            player.role = Object.assign({}, rawPlayer.role);
        }

        return player;
    }

    private static rehydrateStory(rawStory: Story): Story {
        const story = Object.create(Story.prototype) as Story;

        Object.assign(story, rawStory, {
            edition: Story.rehydrateEdition(rawStory.edition),
            player: (rawStory.player ?? []).map((player) => Story.rehydratePlayer(player)),
            history: [...(rawStory.history ?? [])],
            startTime: rawStory.startTime ? new Date(rawStory.startTime) : new Date(),
            endTime: rawStory.endTime ? new Date(rawStory.endTime) : new Date(),
        });

        return story;
    }

    static loadAllStoriesFromLocalStorage(): Story[] {
        return Story.readStoryList()
            .map((story) => Story.rehydrateStory(story))
            .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    }

    static loadStoryListFromLocalStorage(storyName: string): Story | null {
        const storyList = Story.readStoryList();
        const story = storyList.find((s: Story) => s.storyName === storyName);

        return story ? Story.rehydrateStory(story) : null;
    }

    static getCurrentStory(): Story | null {
        const storyName = localStorage.getItem('currentStoryName');
        if (storyName) {
            return Story.loadStoryListFromLocalStorage(storyName);
        }

        return null;
    }
}
