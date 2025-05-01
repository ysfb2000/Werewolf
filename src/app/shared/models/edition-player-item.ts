import { CampType, RoleCodeType } from "../enums";

export class EditionPlayerItem {
    role: RoleCodeType;
    camp: CampType;
    number: number;

    constructor(role: RoleCodeType, camp:CampType, number: number) {
        this.role = role;
        this.camp = camp;
        this.number = number;
    }
}