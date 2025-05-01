import { defaultEdition } from "../defaultEdition";
import { RoleCodeType, SpecialRulesType } from "../enums";
import { EditionPlayerItem } from "./edition-player-item";
import { Result } from "./result";
import { Role } from "./role";

export class Edition {
    editionName: string;
    player: EditionPlayerItem[] = [];
    editionSpecialRules: string[] = [];
    PlayerCount: number = 0;
    isDefault: boolean = false;


    constructor(editionName: string, roles: Role[], specialRules: { [rule: string]: boolean }) {
        this.editionName = editionName;

        for (const rule in specialRules) {
            if (specialRules[rule]) {
                this.editionSpecialRules.push(rule);
            }
        }

        var hasPolice = this.editionSpecialRules.includes(SpecialRulesType.Police);
        if (!hasPolice) {
            this.editionSpecialRules.push(SpecialRulesType.NoPolice);
        }

        if (roles.find((r) => r.roleType === RoleCodeType.Witch)) {
            var hasWitchCanSaveSelfFirstNight = this.editionSpecialRules.includes(SpecialRulesType.WitchCanSaveSelfFirstNight);
            if (!hasWitchCanSaveSelfFirstNight) {
                this.editionSpecialRules.push(SpecialRulesType.WitchCanNotSaveSelf);
            }
        }

        if (roles.find((r) => r.roleType === RoleCodeType.Hunter)) {
            var hasHunterCanShoot = this.editionSpecialRules.includes(SpecialRulesType.HunterCanShoot);
            if (!hasHunterCanShoot) {
                this.editionSpecialRules.push(SpecialRulesType.HunterCanNotShoot);
            }
        }

        for (const role of roles) {
            if (role.selectedCount > 0) {
                this.player.push(new EditionPlayerItem(role.roleType, role.camp, role.selectedCount));
            }
        }

        this.PlayerCount = this.player.reduce((total, item) => total + item.number, 0);
    }

    saveToLocalStorage(edition: Edition): void {

        // get the current edition from localStorage
        const currentEditionJson = localStorage.getItem('edition');
        let currentEdition: Edition[] | null = null;
        if (currentEditionJson) {
            currentEdition = JSON.parse(currentEditionJson);
        }

        // if current edition is null, initialize it as an empty array
        if (!currentEdition) {
            currentEdition = [];
            currentEdition.push(edition);
        } else {
            // check if the edition already exists in localStorage
            const editionExists = currentEdition.some((e: Edition) => e.editionName === edition.editionName);

            // if it doesn't exist, add it to the array
            if (!editionExists) {
                currentEdition.push(edition);
            } else {
                // if it exists, update the existing edition
                const index = currentEdition.findIndex((e: Edition) => e.editionName === edition.editionName);
                currentEdition[index] = edition;
            }
        }

        // save the updated array back to localStorage
        localStorage.setItem('edition', JSON.stringify(currentEdition));
    }

    getRoleList(): Role[] {
        const defaultRoleList: Role[] = Role.loadDefaultRoles();
        const roleList: Role[] = [];
        roleList.push(defaultRoleList.find((r) => r.roleType === RoleCodeType.UnKnown) as Role);
        roleList.push(defaultRoleList.find((r) => r.roleType === RoleCodeType.Werewolf) as Role);

        for (const editionPlayer of this.player) {
            const role = editionPlayer.role;
            const defaultRole = defaultRoleList.find((r) => r.roleType === role);

            if (defaultRole) {
                if (roleList.map((r) => r.roleType).includes(defaultRole.roleType)) continue
                roleList.push(defaultRole);
            }
        }

        return roleList;
    }

    isSpecialRulesInclude(rule: SpecialRulesType): boolean {
        let result = this.editionSpecialRules.some((editionRule) => editionRule === rule);
        return result;
    }



    static loadDefaultEditions(): Edition[] {
        const defaultEditions: Edition[] = JSON.parse(defaultEdition);
        return defaultEditions;
    }

    static loadAllEditions(): Edition[] {
        const editionJson = localStorage.getItem('edition');

        var allEditions: Edition[] = [];

        let editions: Edition[] = [];
        var defaultEdition = Edition.loadDefaultEditions();
        if (editionJson) {
            editions = JSON.parse(editionJson);
        }

        return allEditions.concat(editions, defaultEdition);
    }

    static loadEdition(editionName: string): Edition | undefined {
        var allEditions = Edition.loadAllEditions();
        var edition: Edition | undefined = allEditions.find((edition) => edition.editionName === editionName);

        return edition;
    }
}